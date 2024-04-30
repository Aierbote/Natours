const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();
const PORT = process.env.PORT | 3000;

/* Middlewares */

app.use(morgan('dev'));

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

// Version 0 - starting example
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the Server Side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint..');
// });

/* Routes

// // Version 1: Refactoring more readable and declarative look
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Version 2: Refactoring same routes together + Routes Chaining, then moved to its own module

*/

// Mounting The Router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
