// review / rating / createdAt / ref to tour / ref to user

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must a have a text'],
      trim: true,
      maxlength: [100, 'A review text must have less or equal 100 characters.'],
      minlength: [4, 'A review text must have more or equal 4 characters.'],
    },
    rating: {
      type: Number,
      required: [true, 'A review must have a numeric rating.'],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a  user '],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// DOCUMENT MIDDLEWARES

// reviewSchema.pre('save', function (next) {
//   // TODO :
//   this;

//   next();
// });

// QUERY MIDDLEWARE

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name -_id',
  }).populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// AGGREGATION MIDDLEWARE

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
