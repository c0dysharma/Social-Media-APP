import express from 'express';

import getStats from '../controllers/statsController.js';
import validateUser from '../middlewares/validateUser.js';

const router = express.Router();

router.route('/hourly').get(validateUser, getStats);

export default router;
