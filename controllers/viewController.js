const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour Data from collection
  const tours = await Tour.find();

  // 2) Build Template})

  // 3) Render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'Exciting tours for adventurous people',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // 2) Build the template
  // 3) Render template using data from 1)

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Log In',
  });
};
