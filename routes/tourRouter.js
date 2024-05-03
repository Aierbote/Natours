const express = require('express');

/* Route Handlers */
const {
  getTour,
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  // checkId,
  checkBody,
} = require('../controllers/tourControllers');

/* Middlewares */

const router = express.Router();

// router.param('id', checkId);

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
