require('dotenv').config()
const express = require('express');
const app = express()
const http = require('http').Server(app);
const path = require("path")
const httpPort = 3000;
const mongoose = require('mongoose');
const indexRoutes = require("./routes/index.js")
const cors = require("cors")
const fs = require("fs")
const request = require('request')
const bodyParser = require('body-parser')

//Override console log function to log to a file
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'a'});
var log_stdout = process.stdout;

console.log = function(d) {
  var datetimeArray = (new Date()).toISOString().split("T");
  var datetime = datetimeArray[0] + "|" + datetimeArray[1].split(".")[0]; 
  log_file.write(util.format(`[${datetime}] `+d) + '\n');
  log_stdout.write(util.format(`[${datetime}] `+d) + '\n');
};

console.error = function(d) {
  console.log("ERROR: "+ util.format(d))
}

console.olog = function(d) {
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

//Mark the start of the application
console.olog("==========================================================================")
console.olog("APPLICATION STARTED: "+ Date(Date.now).toString())
console.olog("==========================================================================\n")
//Connect to MongoAtlas
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
//Config ExpressJS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
//Use api routes
app.use(indexRoutes);
// Webserver
app.use(express.static(path.join(__dirname, '../frontend/dist/frontend')))

// Implemented image webserver via Nginx, deprecated
app.get('/static/images/:name',function(req,res) {
  if (fs.existsSync(path.join(__dirname, process.env.UPLOAD_PATH+"/"+req.params.name))) {
    res.sendFile(path.join(__dirname, process.env.UPLOAD_PATH+"/"+req.params.name))
  } else {
    res.sendFile(path.join(__dirname, process.env.UPLOAD_PATH+'/nophoto.jpg'))
  }
})

// Implemented image webserver via Nginx, deprecated
app.get('/static/photo/:name',function(req,res) {
  if (fs.existsSync(path.join(__dirname, "./static"+"/"+req.params.name))) {
    res.sendFile(path.join(__dirname, "./static"+"/"+req.params.name))
  } else {
    res.sendFile(path.join(__dirname, "./static"+'/nophoto.jpg'))
  }
})

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/frontend'))
})
app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname, '../frontend/dist/frontend/index.html'))
})

//Listen to request at port

http.listen(httpPort, function () {
  console.log(`Listening on port ${httpPort}!`)
})

//Cors proxy

app.all('/cors', function (req, res, next) {
  if (req.method === 'OPTIONS') {
      // CORS Preflight
      res.send();
  } else {
      var targetURL = req.header('Target-URL');
      if (!targetURL) {
          res.send(400, { error: 'There is no Target-Endpoint header in the request' });
          return;
      }
      request({ url: targetURL, method: req.method, json: req.body, headers: {'Authorization': req.header('Authorization')} },
          function (error, response, body) {
              if (error) {
                  console.error('error: ' + response.statusCode)
              }
          }).pipe(res);
  }
});


// On mongodb connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB!")
});
