import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  notifications: {
    type: Array,
    default: [],
  },
});

export default mongoose.model('notification', notificationSchema);
