import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  desc: { type: String, required: true },
  likes: { type: Array, default: [] },
  comments: {
    type: [
      {
        userId: mongoose.Types.ObjectId,
        commentTexts: Array,
      },
    ],
    default: [],
  },
});

export default mongoose.model('post', postSchema);
