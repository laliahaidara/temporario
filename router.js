const express = require('express');
const authController = require('./controllers/authController');
const homeController = require('./controllers/homeController');
const aboutController = require('./controllers/aboutController');
const contactController = require('./controllers/contactController');

const router = express.Router();

router.get('auth/login', authController.login);
router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleAuthCallback);
router.get('/logout', authController.logout);

router.get('/', homeController.home);
router.get('/about', aboutController.about);
router.get('/contact', contactController.contact);

module.exports = router;
