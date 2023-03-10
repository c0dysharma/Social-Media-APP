import catchAsync from '../utils/catchAsync.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';
import AppError from '../utils/appError.js';

const getHourlyStatsNested = async (model, subField = null) => {
  const unwinds = [];
  subField?.split('.').forEach((field) => {
    unwinds.push({
      $unwind: {
        path: unwinds.length
          ? `${unwinds[unwinds.length - 1].$unwind.path}.${field}`
          : `$${field}`,
      },
    });
  });
  return model.aggregate([
    ...unwinds,
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        avgPerHour: { $avg: '$count' },
        minPerHour: { $min: '$count' },
        maxPerHour: { $max: '$count' },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
};
export default catchAsync(async (req, res, next) => {
  // only admins can access the route
  if (!req.user.isAdmin) return next(new AppError('Access Denied', 403));

  const postStats = await getHourlyStatsNested(Post);
  const userSingupStats = await getHourlyStatsNested(User);
  const notificationStats = await getHourlyStatsNested(
    Notification,
    'notifications'
  );
  const likesStats = await getHourlyStatsNested(Post, 'likes');
  const commentsStats = await getHourlyStatsNested(
    Post,
    'comments.commentTexts'
  );

  return res.status(200).json({
    status: 'success',
    data: {
      postStats,
      userSingupStats,
      notificationStats,
      likesStats,
      commentsStats,
    },
  });
});
