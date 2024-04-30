const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT | 3000;

/* Middlewares */

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the Middleware');

  // IMPORTANT to execute middleware
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'Not Yet Implemented',
    },
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'Not Yet Implemented',
    },
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'Not Yet Implemented',
    },
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'Not Yet Implemented',
    },
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: {
      message: 'Not Yet Implemented',
    },
  });
};

// Version 0 - starting example
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the Server Side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint..');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/* Routes */

// // Version 1: Refactoring more readable and declarative look
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Version 2: Refactoring same routes together

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// Mounting The Router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
