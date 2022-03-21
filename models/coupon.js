const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
        code: {type: String, required: true},
        percentOff: {type: Number, required: true},
        maxOff: {type: Number, required: false},
        minOff: {type: Number, required: false},
    },
    {
        collection: "specs",
    }
)

module.exports = mongoose.model("Spec", couponSchema);