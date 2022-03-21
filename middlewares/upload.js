const multer = require("multer");

const multerStorage = multer.memoryStorage();


const upload = multer({
  storage: multerStorage,
  filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg", "application/octet-stream"];
        if (match.indexOf(file.mimetype) === -1) {
          var message = `${file.originalname} không hợp lệ! Chỉ chấp nhận file đuôi .png hoặc .jpeg.`;
          return callback(message, null);
        }
    
        var filename = `${Date.now()}-image${path.extname(file.originalname)}`;
        callback(null, filename);
      }
});

const uploadFiles = upload.array("upload", 10); // limit to 10 images

module.exports = (req, res, next) => {
  uploadFiles(req, res, err => {
    if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
      if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
        return res.status(500).json({msg:"Quá nhiều files để upload!"});
      }
    } else if (err) {
      console.error(err);
      return res.status(500).json({msg:`Xảy ra lỗi khi đang tải lên nhiều files: ${err}`});
    }

    // Everything is ok.
    next();
  });
};

// const multer = require("multer")
// const filepath = "../resources/images";
// const util = require("util");
// const path = require("path");

// var storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, path.join(`${__dirname}/${filepath}`));
//   },
//   filename: (req, file, callback) => {
//     const match = ["image/png", "image/jpeg", "application/octet-stream"];
//     if (match.indexOf(file.mimetype) === -1) {
//       var message = `${file.originalname} không hợp lệ! Chỉ chấp nhận file đuôi .png hoặc .jpeg.`;
//       return callback(message, null);
//     }

//     var filename = `${Date.now()}-image${path.extname(file.originalname)}`;
//     callback(null, filename);
//   }
// });

// var uploadFile = multer({ storage: storage }).array('upload',50);
// var uploadFileMiddleware = util.promisify(uploadFile);
// module.exports = uploadFileMiddleware;