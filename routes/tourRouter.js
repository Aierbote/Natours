const express = require('express');

/* Route Handlers */
const {
  getTour,
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  aliasTopTours,
} = require('../controllers/tourControllers');

/* Middlewares */

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
