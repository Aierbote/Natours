const express = require('express');

/* Route Handlers */
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userControllers');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('../controllers/authControllers');

/* Middlewares */

const router = express.Router();

/* Routes */

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

/* Protected Routes */

// Protect all routes after this middleware
router.use(protect);

router.patch('/updateMyPassword', updatePassword);

router.get('/me', getMe, getUser);

router.patch('/updateMe', updateMe);

router.delete('/deleteMe', deleteMe);

// Restrict all routes after this middleware
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
