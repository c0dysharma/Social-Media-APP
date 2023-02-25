import express from 'express';

import {
  getAllUser,
  getUser,
  updateuser,
  followUnfollowUser,
} from '../controllers/userController.js';
import validateUser from '../middlewares/validateUser.js';

const router = express.Router();

router.route('/').get(validateUser, getAllUser);
router
  .route('/:username')
  .get(validateUser, getUser)
  .put(validateUser, updateuser);
router.route('/:username/follow').post(validateUser, followUnfollowUser);

export default router;
