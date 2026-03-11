
import { Router } from "express";
import { validationResult } from "express-validator";
import { editGameValidation } from '../../middleware/validation/forms.js';
import { getGamesForUserId, updateGameByGameId } from "../../models/games/games.js";

const myGamesPage = async (req, res, next) => {

    const userGames = await getGamesForUserId(req.session.user.id);

    res.render('my-games', {
        title: 'My Games | Gender Reveal Bingo Party',
        games: userGames
    });
}

const editGamePage = async (req, res, next) => {
    res.render('games/edit-game', {
        title: 'Edit Game | Gender Reveal Bingo Party',
        gameId: req.params.gameId
    });
}

const playGamePage = async (req, res, next) => {
    res.render('games/play-game', {
        title: 'Play | Gender Reveal Bingo Party'
    });
}

const handleEditGameSubmission = async (req, res) => {

    const gameId = req.params.gameId;

    // Check for validation errors
    const errors = validationResult(req);

    // If one or more errors exist
    if (!errors.isEmpty()) {
        // Store each validation error as a separate flash message
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect(`my-games/edit-game/${gameId}`);
    }

    try {
        // Extract validated data
        const { title, gender } = req.body;

        // Update database object
        await updateGameByGameId(gameId, title, gender);
        
        req.flash('success', 'Game edited successfully!');
        res.redirect('/my-games');
    } catch (error) {
        console.error('Error editing game:', error);
        req.flash('error', 'Unable to edit game. Please try again later.');
        res.redirect(`/${gameId}`);
    }
}

const editGameRoutes = Router();

editGameRoutes.get('/:gameId', editGamePage);

editGameRoutes.post('/:gameId', editGameValidation, handleEditGameSubmission);

export { myGamesPage, editGameRoutes, playGamePage };
