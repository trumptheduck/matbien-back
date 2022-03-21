const Order = require("../models/order");
const Spec = require("../models/spec");
const Product = require("../models/product");

exports.createOrder = async (req,res) => {
    try {
        if (
            !(req.body.customerName&&
            req.body.data&&
            req.body.phone&&
            req.body.province&&
            req.body.district&&
            req.body.ward&&
            req.body.address)
            ) {
            return res.status(422).json({ msg: "Thông tin chưa đầy đủ" });
        }
        const data = req.body.data;
        const processedData = [];
        if (!Array.isArray(data)) return res.status(401).json({ msg: "Thông tin không hợp lệ" });
        let _total = 0;
        for (let i = 0; i < data.length; i++) {
            const _product = await Product.findById(data[i].product);
            const _spec = await Spec.findById(data[i].spec);
            const processed = {
                amount: data[i].amount,
                product: data[i].product._id,
                spec: data[i].spec._id,
                total: data[i].amount*_spec.price,
                name: _product.name + " | " + _spec.name,
                price: _spec.price,
                thumbnail: _spec.images[0],
            }
            processedData.push(processed);
            _total += processed.total;
        }
        const order = new Order({
            customerName: req.body.customerName,
            data: processedData,
            timestamp: Date.now(),
            coupon: req.body.coupon,
            phone: req.body.phone,
            email: req.body.email,
            province: req.body.province,
            district: req.body.district,
            ward: req.body.ward,
            address: req.body.address,
            total: _total,
            status: 0
          });
        const savedOrder = await order.save();
        return res.status(200).json(savedOrder);
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: "Internal server error!"})
    }
}

exports.changeOrderStatus = async (req,res) => {
    try {
        if (!(req.body._id&&req.body.status)) return res.status(422).json({ msg: "Thông tin chưa đầy đủ" });
        await Order.findByIdAndUpdate(req.body._id, {status: req.body.status});
        const updatedOrder = await Order.findById(req.body._id);
        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: "Internal server error!"})
    }
}

exports.getAllOrders = async (req,res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg:"Internal server error!"})
    }
}

exports.getOrderById = async (req,res) => {
    try {
        const id = req.params.id;
        const order = await Order.findById(id);
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg:"Internal server error!"})
    }
}