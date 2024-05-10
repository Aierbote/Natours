const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A user name is required'],
    unique: [true, 'A user name must be unique'],
    trim: true,
    maxlength: [24, 'A user name cannot be longer than 24 characters'],
  },
  email: {
    type: String,
    require: [true, 'A user email is required'],
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
  password: {
    type: String,
    require: [true, 'A user password is required'],
    trim: true,
    minlength: [8, 'A secure password must be longer than 8 characters'],
    // validate: [
    //   validator.isAlphanumeric,
    //   'A password must contains numbers, (upper and lower case) letters and special characters',
    // ],
  },
  passwordConfirm: {
    type: String,
    require: [true, 'A user must type password twice for confirmation'],
    trim: true,
    validate: [
      // this works only CREATE and on SAVE!!
      function (val) {
        return val === this.password;
      },
      'Passwords not matching',
    ],
  },
});

userSchema.pre('save', async function (next) {
  // to avoid re-encrypting unchanged password
  if (!this.isModified('password')) return next();

  // hashing password with a cost o f12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field after validation
  this.passwordConfirm = undefined; // required input, but not persistent in DB

  next();
});

// middleware post-save-hook after encrypted the password

const User = mongoose.model('User', userSchema);

module.exports = User;
