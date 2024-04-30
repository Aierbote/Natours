const express = require('express');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

/* Route Handlers */

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  // // simplistic check, tours array is short
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: `Invalid ID:
  //     simplistic check said it was bigger than tour array length`,
  //   });
  // }

  const tour = tours.find((el) => el.id === id);

  // realistic check, existence
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      requestedAt: req.requestTime,
      message: `Invalid ID:
      realistic check, find returned undefined`,
    });
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour,
    },
  });
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length, // NOTE : not a standard, but useful for counting multiple objects in array
    data: {
      tours /* explicitly `tours: tours` */,
    },
  });
};

const createTour = (req, res) => {
  // // DEBUG :
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      requestedAt: req.requestTime,
      data: {
        tour: 'Invalid ID: simplistic check, cannot update if not found',
      },
    });
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour: '<PLACEHOLDER: Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      requestedAt: req.requestTime,
      data: {
        tour: 'Invalid ID: simplistic check, cannot delete if not found',
      },
    });
  }

  res.status(204).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: null,
  });
};

/* Middlewares */

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
