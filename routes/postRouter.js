import express from 'express';

import validateUser from '../middlewares/validateUser.js';
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
} from '../controllers/postController.js';

const router = express.Router();

// for admins only
router.route('/').get(validateUser, getAllPosts);

// rest of the people
router
  .route('/:id')
  .get(validateUser, getPost)
  .post(validateUser, createPost)
  .put(validateUser, updatePost)
  .delete(validateUser, deletePost);

router.route('/:id/like').post(validateUser, likePost);
router.route('/:id/comment').post(validateUser, commentPost);

export default router;
