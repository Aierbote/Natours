const Tour = require('../models/tourModel');

/* Route Handlers */

exports.getTour = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;

  // // simplistic check, tours array is short
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: `Invalid ID:
  //     simplistic check said it was bigger than tour array length`,
  //    });
  // }

  // const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // data: {
    //   tour,
    // },
  });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    // Bad Request (probably a missing field)
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length, // NOTE : not a standard, but useful for counting multiple objects in array
      data: {
        tours /* explicitly `tours: tours` */,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour: '<PLACEHOLDER: Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: null,
  });
};
