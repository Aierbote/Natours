const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy', false);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/* GLOBAL Middlewares */

// Implement CORS
app.use(cors());

app.options('*', cors());
// app.options("/api/v1/tours/:id", cors()); // Example of allowing specific route

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'connect-src': ["'self'", 'ws://localhost:1234'],
        'default-src': [
          "'self'",
          'ws://localhost:1234',
          'https://js.stripe.com/v3/',
        ],
        'script-src-elem': [
          "'self'",
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js ',
          'https://unpkg.com/axios/dist/axios.min.js',
          'https://js.stripe.com/v3/',
        ],
        'script-src': [
          "'self'",
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
          'https://unpkg.com/axios/dist/axios.min.js',
          // "'unsafe-inline'",
        ],
        'style-src': [
          "'self'",
          'https://*.googleapis.com',
          'https://unpkg.com',
        ],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          'https://*.openstreetmap.org',
          'https://unpkg.com',
        ],
      },
    },
  }),
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  validate: { xForwardedForHeader: false },
});
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// url encoded parser to get the body of a form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Cookie parser, reading data from the browser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression());

// Test middleware
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

// Routes

/*

// // Version 1: Refactoring more readable and declarative look
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Version 2: Refactoring same routes together + Routes Chaining, then moved to its own module

*/

// Mounting The Router
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
