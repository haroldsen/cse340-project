
import { Router } from "express";

import { validationResult } from "express-validator";
import { editGameValidation } from '../../middleware/validation/forms.js';

import { createGameForUserId } from "../../models/games/games.js";

import { getUserById } from "../../models/users/users.js";

const dashboardPage = async (req, res) => {

    res.addScript('<script src="/js/dashboard.js" defer></script>');
    
    res.render('dashboard/dashboard', { title: 'Dashboard | Gender Reveal Bingo Party' });
};

const viewAccountPage = async (req, res) => {

    const selectedUser = await getUserById(req.params.userId);
    console.log(`SELECTED USER: ${selectedUser}`);

    res.render('dashboard/view-account', {
        title: 'View Account | Gender Reveal Bingo Party',
        selectedUser: selectedUser
    });
};

const dashboardRoutes = Router();

dashboardRoutes.get('/', dashboardPage);
dashboardRoutes.get('/view-account/:userId', viewAccountPage);
// dashboardRoutes.post('/view-account/:userId');

export default dashboardRoutes;
