import Post from '../models/post.model'
import userModel from '../models/user.model';
const path = require('path');

module.exports.createPost = async (req, res) => {
  try {
    // auth middleware should set req.user
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    if (!req.file) return res.status(400).json({ message: 'Image file required' });

    const imageUrl = `/uploads/${req.file.filename}`;
    const { caption } = req.body;

    const post = await Post.create({
      author: user._id,
      caption: caption || '',
      imageUrl
    });

    res.status(201).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create post', error: err.message });
  }
};

module.exports.getFeed = async (req, res) => {
  try {
    // Optionally: show posts by followed users + self
    const user = req.user;
    const filter = user ? { author: { $in: [user._id, ...(user.following || [])] } } : {};
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate('author', 'fullname avatarUrl')
      .lean();

    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch feed' });
  }
};

module.exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'fullname avatarUrl');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch post' });
  }
};

module.exports.toggleLike = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await post.toggleLike(user._id);
    res.json({ likesCount: post.likesCount, liked: post.likes.includes(user._id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not toggle like' });
  }
};