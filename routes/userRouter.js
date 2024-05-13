const express = require('express');

/* Route Handlers */
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');
const { signup, login } = require('../controllers/authControllers');

/* Middlewares */

const router = express.Router();

/* Routes */

router.post('/signup', signup);
router.post('/login', login);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
