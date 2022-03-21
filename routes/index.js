const router = require('express').Router();


router.use('/api', require('./api/post.js'));
router.use('/api', require('./api/order.js'));
router.use('/api', require('./api/product.js'));
router.use('/api', require('./api/user.js'));
module.exports = router;
