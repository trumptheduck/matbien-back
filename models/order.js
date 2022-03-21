const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: {type: String, required: true},
  code: {type: String, required: true},
})

const dataSchema =  new mongoose.Schema({
    amount: {type: Number, required: true},
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    spec: { type: mongoose.Schema.Types.ObjectId, ref: 'Spec' },
    name: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true},
    total: {type: Number, required: true},
  })

const orderSchema = new mongoose.Schema(
  {
    
    customerName: {type: String, required: true},
    data: [dataSchema],
    timestamp: {type: String, required: true},
    coupon: {type: String, required: false},
    phone: {type: String, required: true},
    email: {type: String, required: false},
    province: addressSchema,
    district: addressSchema,
    ward: addressSchema,
    address: {type: String, required: true},
    status: {type: Number, required: true},
    total: {type: Number, required: true}
  },
  {
    collection: "orders",
  }
);
module.exports = mongoose.model("Order", orderSchema);
