const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 }
}, { timestamps: true });

postSchema.methods.toggleLike = async function (userId) {
  const idx = this.likes.findIndex(id => id.toString() === userId.toString());
  if (idx === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(idx, 1);
  }
  this.likesCount = this.likes.length;
  await this.save();
  return this;
};

const Post = mongoose.model('Post', postSchema);
export default Post;