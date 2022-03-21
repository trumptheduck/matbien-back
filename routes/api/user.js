const router = require('express').Router();
const userController = require("../../controllers/user");
const { verifyUser } = require('../../middlewares/verify');

router.post('/auth/login', userController.login);
router.post('/auth/autologin', userController.autoLogin);
router.post('/auth/register', userController.signup);

module.exports = router;
