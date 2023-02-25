import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  desc: { type: String, required: true },
  likes: { type: Array, default: [] },
  comments: { type: Array, default: [] },
});

export default mongoose.model('post', postSchema);
