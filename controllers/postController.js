import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import addNotification from '../utils/addNotification.js';

import Post from '../models/postModel.js';
import User from '../models/userModel.js';

export const getAllPosts = catchAsync(async (req, res, next) => {
  // if query get only those posts
  if (req.query.q) {
    const foundPosts = await Post.find({ desc: { $regex: req.query.q } });
    if (foundPosts.length)
      return res.status(200).json({ status: 'success', data: foundPosts });
    return next(new AppError('No search result found', 404));
  }

  // a users all post
  const allPosts = await Post.find({ userId: req.user._id });
  return res.status(200).json({ status: 'success', data: allPosts });
});

export const getPost = catchAsync(async (req, res, next) => {
  const foundPost = await Post.findById(req.params.id);
  if (!foundPost) return next(new AppError('Requested post not found', 404));
  return res.status(200).json({ status: 'success', data: foundPost });
});

export const createPost = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const newPost = await Post.create({
    userId,
    desc: req.body.desc,
  });

  return res.status(201).json({ status: 'success', data: newPost });
});

export const updatePost = catchAsync(async (req, res, next) => {
  const foundPost = await Post.findById(req.params.id);
  if (!foundPost) return next(new AppError('Requested post not found', 404));

  // you can delete post only if it belongs to you or your are admin
  if (req.user._id.equals(foundPost.userId) || req.user.isAdmin) {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        desc: req.body.desc,
      },
      { new: true }
    );
    return res.status(200).json({ status: 'success', data: updatedPost });
  }
  return next(new AppError('You can only delete your post', 403));
});

export const deletePost = catchAsync(async (req, res, next) => {
  const foundPost = await Post.findById(req.params.id);
  if (!foundPost) return next(new AppError('Requested post not found', 404));

  // you can delete post only if it belongs to you or your are admin
  if (req.user._id.equals(foundPost.userId) || req.user.isAdmin) {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: 'success', data: deletedPost });
  }
  return next(new AppError('You can only delete your post', 403));
});

export const likePost = catchAsync(async (req, res, next) => {
  const foundPost = await Post.findById(req.params.id);
  if (!foundPost) return next(new AppError('Requested post not found', 404));

  // already liked- unlike
  if (foundPost.likes.includes(req.user._id))
    foundPost.likes.pull(req.user._id);
  // like now
  else foundPost.likes.push(req.user._id);

  await foundPost.save();
  await addNotification(
    await User.findById(foundPost.userId),
    `${req.user.name} Liked your post`
  );

  return res.status(200).json({ status: 'success', data: foundPost.likes });
});
export const commentPost = catchAsync(async (req, res, next) => {
  const foundPost = await Post.findById(req.params.id);
  if (!foundPost) return next(new AppError('Requested post not found', 404));

  // if he commented before add in same array
  let index = -1;
  foundPost.comments.forEach((comment, i) => {
    if (comment.userId.equals(req.user._id)) index = i;
  });

  if (index >= 0) foundPost.comments[index].commentTexts.push(req.body.comment);
  // else add a new object
  else
    foundPost.comments.push({
      userId: req.user._id,
      commentTexts: [req.body.comment],
    });

  await foundPost.save();
  await addNotification(
    await User.findById(foundPost.userId),
    `${req.user.name} commented on your post`
  );

  return res.status(200).json({ status: 'success', data: foundPost.comments });
});
