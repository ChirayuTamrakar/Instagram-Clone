import express from "express";
import { upload } from "../Middleware/multer.middleware.js";
import {
  createPost,
  getFeed,
  getPosts
} from "../controller/post.controller.js";
import { authUser } from "../Middleware/auth.middleware.js";

const router = express.Router();


router.post('/',authUser,  upload.single('image'), createPost);

// Feed n single post 
router.get( '/feed', authUser, getFeed);
router.get('/:id', getPosts);

// Likes to make the like
router.post('/:id/like', authUser, toggleLike);

export default router;