const express = require('express');

/* Route Handlers */
const {
  getTour,
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
} = require('../controllers/tourControllers');

/* Middlewares */

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
