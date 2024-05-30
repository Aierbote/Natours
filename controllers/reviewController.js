const Review = require('../models/reviewModel');

const catchAsync = require('../utils/catchAsync');

// ROUTE HANDLERS

exports.createReview = catchAsync(async (req, res, next) => {
  // allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user;
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()
    .populate({
      path: 'tour',
      select: 'name',
    })
    .populate({
      path: 'user',
      select: 'name',
    });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
