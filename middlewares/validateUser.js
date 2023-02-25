import { promisify } from 'es6-promisify';
import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export default catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!(authorization && authorization.split(' ')[0] === 'Bearer'))
    return next(
      new AppError('No authorization token found, Please login again.', 401)
    );

  // verify token
  const token = authorization.split(' ')[1];
  const decodedData = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);

  // check if user exists
  const user = await User.findById(decodedData.id);
  if (!user)
    return next(new AppError('Authorization error, please login again'), 401);

  // check if password changed after token issue time
  const stillValid = user.validateToken(decodedData.iat);
  if (!stillValid)
    return next(new AppError('Authorization error, please login again'), 401);

  req.user = user;
  next();
});
