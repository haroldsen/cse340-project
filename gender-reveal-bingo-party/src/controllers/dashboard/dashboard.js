
import { Router } from "express";

import { validationResult } from "express-validator";
import { editGameValidation } from '../../middleware/validation/forms.js';

import { createGameForUserId } from "../../models/games/games.js";

const dashboardPage = (req, res) => {

    res.addScript('<script src="/js/dashboard.js" defer></script>');
    
    res.render('dashboard/dashboard', { title: 'Dashboard | Gender Reveal Bingo Party' });
}

const dashboardRoutes = Router();

dashboardRoutes.get('/', dashboardPage);
// dashboardRoutes.get('/view-account/:userId');
// dashboardRoutes.post('/view-account/:userId');

export default dashboardRoutes;
