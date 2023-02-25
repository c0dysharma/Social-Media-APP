import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const generateJWTtoken = (id) =>
  jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const signup = catchAsync(async (req, res, next) => {
  delete req.body.isAdmin;
  const user = await User.create(req.body);
  const token = generateJWTtoken(user._id);
  res.status(201).json({ status: 'success', token });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide email and password'), 400);

  // select to get field which has select:false
  const user = await User.findOne({ email }).select('+password');

  // check if user exists and password is correct
  if (!user || !(await user.validatePassword(password, user.password)))
    return next(new AppError('Email or password is incorrect', 400));

  const token = generateJWTtoken(user._id);
  return res.status(200).json({ status: 'success', token });
});
