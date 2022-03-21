const Product = require("../models/product");
const Spec = require("../models/spec");
const fs = require("fs");

exports.getProductById = async (req,res) => {
    try {
        if (!(req.params.id)) return res.status(422).json({ msg: "Thông tin chưa đầy đủ" });
        const product = await Product.findById(req.params.id).populate('specs');
        return res.status(200).json(product);
    } catch (error) {
       console.error(error);
       return res.status(500).json({msg: "Internal server error!"})
    }
}

exports.getAllProduct = async (req,res) => {
    try {
        const products = await Product.find().populate('specs');
        return res.status(200).json(products);
    } catch (error) {
       console.error(error);
       return res.status(500).json({msg: "Internal server error!"})
    }
}

exports.createProduct = async (req,res) => {
    try {
        const product = new Product({
            name: req.body.name??'',
            specs: [],
            desc: req.body.desc??'',
            info: req.body.info??'',
            usage: req.body.usage??'',
            ingredients: req.body.ingredients??'',
        })
        const savedProduct = await product.save();
        return res.status(200).json(savedProduct);
    } catch (error) {
       console.error(error);
       return res.status(500).json({msg: "Internal server error!"})
    }
}

exports.createSpec = async (req,res) => {
    try {
        const productId = req.params.id;
        let spec = new Spec({
            name: req.body.name,
            price: req.body.price,
            images: res?.locals?.images??[],
        })
        const savedSpec = await spec.save();
        await Product.findByIdAndUpdate(productId, {$addToSet: {specs: savedSpec._id}});
        const updatedProduct = await Product.findById(productId);
        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: "Internal server error!"})
    }
}

exports.deleteSpec = async (req,res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndUpdate(productId, {$pull: {specs: req.params.specId}});
        const deletedSpec = await Spec.findByIdAndDelete(req.params.specId);
        if (!deletedSpec) return res.status(400).json({msg: "Spec không tồn tại"})
        const updatedProduct = await Product.findById(productId);
        if (Array.isArray(deletedSpec.images))
        for (let i = 0; i< deletedSpec.images.length; i++) {
            fs.unlinkSync(`${process.env.UPLOAD_PATH}/${deletedSpec.images[i]}`);
        }
        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: "Internal server error!"})
    }
}

exports.deleteProduct = async (req,res) => {
    try {
        if (!(req.params.id)) return res.status(422).json({ msg: "Thông tin chưa đầy đủ" });
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json(deletedProduct);
    } catch (error) {
       console.error(error);
       return res.status(500).json({msg: "Internal server error!"})
    }
}

exports.updateProduct = async (req,res) => {
    try {
        if (!(req.body._id)) return res.status(422).json({ msg: "Thông tin chưa đầy đủ" });
        await Product.findByIdAndUpdate(req.body._id, req.body);
        const updatedProduct = await Product.findById(req.body._id);
        return res.status(200).json(updatedProduct);
    } catch (error) {
       console.error(error);
       return res.status(500).json({msg: "Internal server error!"})
    }
}