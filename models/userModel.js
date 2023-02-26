/* eslint-disable quotes */
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, 'Name should have >=3 characters'],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: [3, 'Username should have >=3 characters'],
    },
    email: {
      type: String,
      required: true,
      validator: [validator.isEmail, 'Enter a valid email address'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, 'Password needs to be atleast 8 characters long.'],
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator(el) {
          return el === this.password;
        },
        message: "Passwords don't match.",
      },
    },
    displayImage: String,
    passwordChangedAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.methods.validatePassword = (candidatePassword, userPasswordHash) =>
  bcrypt.compare(candidatePassword, userPasswordHash);

// this is only allowed in legacy function (){}
userSchema.methods.validateToken = function (tokenIAT) {
  // return true if validation successfull else false
  if (this.passwordChangedAt) {
    const lastChangedSeconds = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return tokenIAT >= lastChangedSeconds;
  }
  return true;
};
export default mongoose.model('User', userSchema);
