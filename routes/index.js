const router = require('express').Router();


router.use('', require('./api/post.js'));
router.use('', require('./api/order.js'));
router.use('', require('./api/product.js'));
router.use('', require('./api/user.js'));
module.exports = router;
