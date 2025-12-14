 mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'Firstname must be 3 char long']
        },
        lastname: {
            type: String,
            required:true,
            minlength: [3, 'Lastname must be 3 char long']
        }
    },
    email: {
            type: String,
            required: true,
            minlength: [6, 'email must be 6 char long']
    },
    password: {
            type: String,
            required: true,
            minlength: [6, 'Password must be 6 char long'],
            select: false,
    },
    avatarUrl: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('user', userSchema);
export default userModel;