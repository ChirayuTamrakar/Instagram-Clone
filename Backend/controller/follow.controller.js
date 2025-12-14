import userModel from "../models/user.model";

const followToggle = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const targetId = req.params.id;
    if (user._id.toString() === targetId) return res.status(400).json({ message: 'Cannot follow yourself' });

    const target = await userModel.findById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const isFollowing = user.following.some(id => id.toString() === targetId);
    if (isFollowing) {
      // unfollow
      user.following = user.following.filter(id => id.toString() !== targetId);
      target.followers = target.followers.filter(id => id.toString() !== user._id.toString());
      await user.save();
      await target.save();
      return res.json({ following: false });
    } else {
      // follow
      user.following.push(target._id);
      target.followers.push(user._id);
      await user.save();
      await target.save();
      return res.json({ following: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Follow/unfollow failed' });
  }
};

export default followToggle;