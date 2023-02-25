import express from 'express';

import {
  getAllUser,
  getUser,
  updateuser,
  followUser,
  unFollowUser,
} from '../controllers/userController.js';
import validateUser from '../middlewares/validateUser.js';

const router = express.Router();

router.route('/').get(validateUser, getAllUser);
router
  .route('/:username')
  .get(validateUser, getUser)
  .put(validateUser, updateuser);
router.route('/:username/follow').post(validateUser, followUser);
router.route('/:username/unfollow').post(validateUser, unFollowUser);

export default router;
