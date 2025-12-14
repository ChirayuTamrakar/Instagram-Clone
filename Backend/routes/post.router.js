const express = require('express');
const router = express.Router();
const upload = require('../Middleware/multer.middleware');
const postController = require('../controller/post.controller');
const authMiddleware = require('../Middleware/auth.middleware');

router.post('/',authMiddleware.authUser,  upload.single('image'),  postController.createPost);

// Feed n single post 
router.get( '/feed', authMiddleware.authUser, postController.getFeed);
router.get('/:id',   postController.getPost);

// Likes to make the like
router.post('/:id/like', authMiddleware.authUser, postController.toggleLike);

export default router;