
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

import { myGamesPage, editGamePage, playGamePage } from './games/my-games.js';
import { createGameForUserId } from '../models/games/games.js';

import { Router } from 'express';

// Create a new router instance
const router = Router();

/* ROUTE SPECIFIC MIDDLEWARE */

// Add catalog-specific styles to all catalog routes
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

// Add faculty-specific styles to all faculty routes
router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
    next();
});

// Add contact-specific styles to all contact routes
router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

// Add login-specific styles to all login routes
// router.use('/login', (req, res, next) => {
//     res.addStyle('<link rel="stylesheet" href="/css/login.css">');
//     next();
// });

/* DECLARE ROUTES */

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);

// Game management pages
router.get('/my-games', requireLogin, myGamesPage);
router.get('/my-games/edit-game/:gameId', requireLogin, editGamePage);
router.get('/my-games/play-game/:gameId', requireLogin, playGamePage);
router.get('/purchase-confirmation', (req, res, next) => {
    
    createGameForUserId(req.session.user.id);

    res.redirect('/my-games');
});

// Course catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

// Faculty routes
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultySlug', facultyDetailPage);

// Contact form routes
router.use('/contact', contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// Login routes (form and submission)
router.use('/login', loginRoutes);

// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

// Demo page with special middleware
router.get('/demo', addDemoHeaders, demoPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

export default router;
