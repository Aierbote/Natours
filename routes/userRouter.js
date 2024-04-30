const express = require('express');

/* Route Handlers */

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

/* Middlewares */

const router = express.Router();

/* Routes */

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
