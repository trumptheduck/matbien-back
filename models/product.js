const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    
    name: {type: String, required: true},
    specs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Spec' }],
    desc: {type: String, required: true},
    info: {type: String, required: true},
    usage: {type: String, required: true},
    ingredients: {type: String, required: true},
  },
  {
    collection: "products",
  }
);
module.exports = mongoose.model("Product", productSchema);
