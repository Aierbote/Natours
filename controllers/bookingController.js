const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    /*
      SESSION INFO
    */
    payment_method_types: ['card'], // required
    success_url: `${req.protocol}://${req.get('host')}/`, // required
    mode: 'payment', // required
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`, // required
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    /*
      PRODUCT INFO
    */
    line_items: [
      {
        quantity: 1,
        price_data: {
          unit_amount: tour.price * 100,
          currency: 'eur', // 'usd' for Dollar
          product_data: {
            name: `${tour.name} Tour`,
            // TODO : update with the correct links
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
            description: tour.summary,
          },
        },
      },
    ],
  });

  // 3) Send it to the client
  res.status(200).json({
    status: 'success',
    session,
  });
});
