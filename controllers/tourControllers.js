// const fs = require('fs');
const Tour = require('../models/tourModel');

// // testing from local file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// // example of middleware no longer needed, now MongoDB will deal with that
// exports.checkId = (req, res, next, val) => {
//   console.log(`tour id: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       requestedAt: req.requestTime,
//       data: {
//         tour: 'Invalid ID: simplistic check, cannot delete if not found',
//       },
//     });
//   }

//   next();
// };

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Both `name` and `price` are required',
    });
  }

  next();
};

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

exports.createTour = (req, res) => {
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       requestedAt: req.requestTime,
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   },
  // );
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length, // NOTE : not a standard, but useful for counting multiple objects in array
    // data: {
    //   tours /* explicitly `tours: tours` */,
    // },
  });
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
