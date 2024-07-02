const express = require('express');
const multer = require('multer');

/* Route Handlers */
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

/* Middlewares */

// NOTE : `dest` short for destination. It is the folder where the uploaded files will be stored.
const upload = multer({ dest: '/public/img/users' });

const router = express.Router();

/* Routes */

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

/* Protected Routes */

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);

router.patch('/updateMe', upload.single('photo'), userController.updateMe);

router.delete('/deleteMe', userController.deleteMe);

// Restrict all routes after this middleware
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
