const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // NOTE : we are going to use Parent Referencing here.
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
  // NOTE : case limit admin can create one for Postman testing
  paid: {
    type: Boolean,
    default: true,
  },
});

// DOCUMENT MIDDLEWARES

// QUERY MIDDLEWARE

bookingSchema.pre(/^find/, function (next) {
  // NOTE : we won't have too many query for this Entity, so it won't be an Efficiency issue, only Tour Guides or Admin will be able to query these.
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
});

// AGGREGATION MIDDLEWARE

const Booking = mongoose.model('Booking', bookingSchema);
