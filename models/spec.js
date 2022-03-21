const mongoose = require("mongoose");

const specSchema = new mongoose.Schema({
        name: {type: String, required: true},
        price: {type: Number, required: true},
        images: [{type: String, required: true}],
    },
    {
        collection: "specs",
    }
)

module.exports = mongoose.model("Spec", specSchema);