import catchAsync from '../utils/catchAsync.js';
import addNotification from '../utils/addNotification.js';

import User from '../models/userModel.js';
import AppError from '../utils/appError.js';

export const getAllUser = catchAsync(async (req, res, next) => {
  // only admins can access this route
  if (!req.user?.isAdmin) return next(new AppError('Access Denied', 403));
  const allUsers = await User.find({});
  return res.status(200).json({ status: 'success', data: allUsers });
});

export const getUser = catchAsync(async (req, res, next) => {
  const foundUser = await User.find({ username: req.params.username });
  if (!foundUser?.length)
    return next(new AppError('Requested User not found', 404));
  return res.status(200).json({ status: 'success', data: foundUser });
});

export const updateuser = catchAsync(async (req, res, next) => {
  // logged in user can change itself or the adming
  const foundUser = await User.findOne({ username: req.params.username });
  if (!foundUser) return next(new AppError('Requested User not found', 404));

  if (req.user._id.equals(foundUser._id) || req.user.isAdmin) {
    const updatedUser = await User.findByIdAndUpdate(foundUser._id, req.body, {
      new: true,
    });
    return res.status(200).json({ status: 'success', data: updatedUser });
  }
  // eslint-disable-next-line quotes
  return next(new AppError("You can't update someone else's account.", 403));
});

export const followUnfollowUser = catchAsync(async (req, res, next) => {
  const foundUser = await User.findOne({ username: req.params.username });
  if (!foundUser) return next(new AppError('Requested User not found', 404));

  // you cannot follow urself
  if (req.user._id.equals(foundUser._id))
    return next(new AppError('You can only follow other user', 403));

  // if already follow- unfollow
  if (req.user.following.includes(foundUser._id)) {
    // remove foundUser to loggedInUser's following list
    // remove loggedInUser to foundUser's followers list
    req.user.following.pull(foundUser._id);
    foundUser.followers.pull(req.user._id);
    await req.user.save({ validateBeforeSave: false });
    await foundUser.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json({ status: 'success', data: req.user.following });
  }
  // else follow
  // add foundUser to loggedInUser's following list
  // add loggedInUser to foundUser's followers list
  req.user.following.push(foundUser._id);
  foundUser.followers.push(req.user._id);
  await req.user.save({ validateBeforeSave: false });
  await foundUser.save({ validateBeforeSave: false });

  await addNotification(foundUser, `${req.user.name} started following you.`);

  return res.status(200).json({ status: 'success', data: req.user.following });
});
