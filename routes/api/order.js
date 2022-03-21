const router = require('express').Router();
const orderController = require("../../controllers/order");
const { verifyUser } = require('../../middlewares/verify');

router.get('/orders', orderController.getAllOrders);
router.get('/order/:id', orderController.getOrderById);
router.post('/order', orderController.createOrder);
router.patch('/order', orderController.changeOrderStatus);

module.exports = router;
