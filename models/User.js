const mongoose = require('mongoose');
const crypto = require('crypto');

//  npm package for encrypting package
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
  {
    googleId: String,
    displayName: String,
    firstName: String,
    lastName: String,
    image: String,
    email: {
      type: String,
      unique: true,
      // required: [true, 'User must have an email'],
    },

    password: {
      type: String,
      // required: [true, 'User must have a password'],
      minlength: 8,
      select: false,
    },

    passwordUpdatedAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
    },
    passwordTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

//  pre save middleware for hashing password before saving it to db
userSchema.pre('save', async function (next) {
  // const plainPassword = this.password;
  // const hash = await bcrypt.hash(plainPassword, 12);
  // this.password = hash;

  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// user method for verifying login password as same as of db
userSchema.methods.verifyPassword = async function (
  plainPassword,
  databasePassword
) {
  const ans = await bcrypt.compare(plainPassword, databasePassword);
  return ans;
};

// check if user is same after changing password
userSchema.methods.checkTokenExpiry = function (tokenDate) {
  let changedTimeStamp;
  if (this.passwordUpdatedAt) {
    changedTimeStamp = parseInt(this.passwordUpdatedAt.getTime() / 1000, 10);
  }
  return tokenDate < changedTimeStamp;
};

userSchema.methods.createPasswordResetToken = function () {
  // generating reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // encrypting and storing encrypted version in db
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // encrypted reset token expires after 10mins
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // we will send this plain version by email to user
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
