import Notification from '../models/notificationModel.js';

export default async (targetUser, text) => {
  const foundBucket = await Notification.find({ userId: targetUser._id });

  // if its first notification
  if (!foundBucket.length)
    return Notification.create({
      userId: targetUser._id,
      notifications: [text],
    });

  foundBucket[0].notifications.push(text);
  return foundBucket[0].save();
};
