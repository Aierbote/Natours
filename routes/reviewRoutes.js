const express = require('express');

const {
  createReview,
  getAllReviews,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authControllers');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
