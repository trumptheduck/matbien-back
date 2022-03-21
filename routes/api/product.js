const router = require('express').Router();
const productController = require("../../controllers/product");
const { verifyUser } = require('../../middlewares/verify');
const resize = require('../../middlewares/resize');
const upload = require('../../middlewares/upload');

router.get('/products', productController.getAllProduct);
router.get('/product/:id', productController.getAllProduct);
router.post('/product', productController.createProduct);
router.patch('/product', productController.updateProduct);
router.delete('/product/:id', productController.deleteProduct);
router.post('/product/:id/spec', upload, resize, productController.createSpec);
router.delete('/product/:id/spec/:specId', productController.deleteSpec);

module.exports = router;
