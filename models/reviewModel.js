// review / rating / createdAt / ref to tour / ref to user

const mongoose = require('mongoose');
const Tour = require('./tourModel');

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
  // this.populate({
  //   path: 'tour',
  //   select: 'name _id',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo _id',
  // });

  this.populate({
    path: 'user',
    select: 'name photo _id',
  });

  next();
});

// AGGREGATION MIDDLEWARE

// STATIC METHODS

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // DEBUG :
  console.log(tourId);

  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // DEBUG :
  console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].nRating,
    ratingsQuantity: stats[0].nRating,
  });
};

reviewSchema.post('save', function () {
  // `this` points to current review document
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
