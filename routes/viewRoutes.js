const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

// USERS ROUTES

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);

router.get('/login', authController.isLoggedIn, viewController.login);

// PROTECTED ROUTES

router.get('/me', authController.protect, viewController.getAccount);

module.exports = router;
