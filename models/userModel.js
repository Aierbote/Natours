const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user name is required'],
    unique: [true, 'A user name must be unique'],
    trim: true,
    maxlength: [24, 'A user name cannot be longer than 24 characters'],
  },
  email: {
    type: String,
    required: [true, 'A user email is required'],
    unique: [
      true,
      'A user email can be used just for one subscription. TIP: Retrieve/restore your password',
    ],
    trim: true,
    validate: [
      // (val) => val.match(/^[a-zA-Z0-9.-|(+)]+@(\w+)(\.(\w{2,})){1,2}$/),
      validator.isEmail,
      'A user email address is must be valid.',
    ],
    lowercase: true,
  },
  photo: {
    type: String,
    default: '👤',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A user password is required'],
    trim: true,
    minlength: [8, 'A secure password must be longer than 8 characters'],
    select: false, // NOTE : SECURITY REASON!
    // validate: [
    //   validator.isAlphanumeric,
    //   'A password must contains numbers, (upper and lower case) letters and special characters',
    // ],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must type password twice for confirmation'],
    trim: true,
    validate: [
      // this works only CREATE and on SAVE!!
      function (val) {
        return val === this.password;
      },
      'Passwords not matching',
    ],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false, // NOTE : SECURITY REASON!
  },
});

userSchema.pre('save', async function (next) {
  // to avoid re-encrypting unchanged password
  if (!this.isModified('password')) return next();

  // hashing password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field after validation
  this.passwordConfirm = undefined; // required input, but not persistent in DB

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False, NOT CHANGED
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// middleware post-save-hook after encrypted the password

const User = mongoose.model('User', userSchema);

module.exports = User;
