const router = require('express').Router();
const postController = require("../../controllers/post");
const resize = require('../../middlewares/resize');
const upload = require('../../middlewares/upload');
const { verifyUser } = require('../../middlewares/verify');

router.get('/posts', postController.searchForPosts);
router.get('/post/:id', postController.getPostById);
router.post('/post', verifyUser, upload, resize, postController.createPost);

module.exports = router;
