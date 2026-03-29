
import { addDemoHeaders } from '../middleware/demo/headers.js';

import {
    homePage,
    aboutPage,
    getCardsPage,
    contactUsPage,
    introVideoPage
} from './index.js';

import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

import myGamesRoutes from './games/my-games.js';
import paymentHandlerRoutes from './stripe/stripe.js';

import { Router } from 'express';

// Create a new router instance
const router = Router();

/* ROUTE SPECIFIC MIDDLEWARE */

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

/* DECLARE ROUTES */

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/contact-us', contactUsPage);
router.get('/get-cards', requireLogin, getCardsPage);
router.get('/intro-video', introVideoPage);

// Game management routes
router.use('/my-games', requireLogin, myGamesRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// Login routes (form and submission)
router.use('/login', loginRoutes);

// Stripe purchase routes
router.use('/purchase-game', paymentHandlerRoutes);

// Authentication-related routes at root level
router.get('/logout', processLogout);

export default router;
