const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body); // WARNING: SECURITY FLAW, a `req.body` could have `photo` and more unintended fields
  const newUser = await User.create({
    // explicit fields: to prevent malevolent users to self assign a `role`
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
