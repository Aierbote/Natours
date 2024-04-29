const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT | 3000;

app.use(express.json());

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

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length, // NOTE : not a standard, but useful for counting multiple objects in array
    data: {
      tours /* explicitly `tours: tours` */,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
      message: `Invalid ID:
      realistic check, find returned undefined`,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // // DEBUG :
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      data: {
        tour: 'Invalid ID: simplistic check, cannot update if not found',
      },
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<PLACEHOLDER: Updated tour here...>',
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      data: {
        tour: 'Invalid ID: simplistic check, cannot delete if not found',
      },
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
