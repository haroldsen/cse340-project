
import { Router } from "express";

import { getGamesForUserId, getGameById } from "../../models/games/games.js";

import editGameRoutes from "./edit-game.js";

const myGamesPage = async (req, res, next) => {

    const userGames = await getGamesForUserId(req.session.user.id);

    res.addScript('<script src="/js/purchase.js" defer></script>');

    res.render('my-games', {
        title: 'My Games | Gender Reveal Bingo Party',
        games: userGames
    });
}

const playGamePage = async (req, res, next) => {

    res.addScript('<script type="module" src="/js/play/play.js" defer></script>');

    const gameToPlay = await getGameById(req.params.gameId);

    const sessionUserId = req.session.user.id;
    const gameUserId = gameToPlay.userId;

    if (sessionUserId === gameUserId) {
        res.render('games/play-game', {
            title: 'Play | Gender Reveal Bingo Party',
            winningGender: gameToPlay.gender
        });
    } else {
        res.render('games/access-issue', {
            title: 'Access Denied | Gender Reveal Bingo Party',
        });
    }
}

const myGamesRoutes = Router();

myGamesRoutes.get('/', myGamesPage);
myGamesRoutes.use('/edit-game', editGameRoutes);
myGamesRoutes.get('/play-game/:gameId', playGamePage);

export default myGamesRoutes;
