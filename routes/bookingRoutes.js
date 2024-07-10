const express = require('express');

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(authController.protect);

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession,
);

// router
//   .route('/:id')
//   .get(reviewController.getReview)
//   .patch(
//     authController.restrictTo('user', 'admin'),
//     reviewController.updateReview,
//   )
//   .delete(
//     authController.restrictTo('user', 'admin'),
//     reviewController.deleteReview,
//   );

module.exports = router;
