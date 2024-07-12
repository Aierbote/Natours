const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
<<<<<<< HEAD
=======
  // NOTE : we are going to use Parent Referencing here.
>>>>>>> b67c2c454026bff7447fae21d259523f166c4760
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price!'],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

// DOCUMENT MIDDLEWARES

// QUERY MIDDLEWARE

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });

  next();
});

// AGGREGATION MIDDLEWARE

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
