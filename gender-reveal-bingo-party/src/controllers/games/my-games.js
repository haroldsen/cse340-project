
import { getGamesForUserId } from "../../models/games/games.js";

const myGamesPage = async (req, res, next) => {

    const userGames = await getGamesForUserId(req.session.user.id);

    res.render('my-games', {
        title: 'My Games | Gender Reveal Bingo Party',
        games: userGames
    });
}

const editGamePage = async (req, res, next) => {
    res.render('games/edit-game', {
        title: 'Edit Game | Gender Reveal Bingo Party'
    });
}

const playGamePage = async (req, res, next) => {
    res.render('games/play-game', {
        title: 'Play | Gender Reveal Bingo Party'
    });
}

export { myGamesPage, editGamePage, playGamePage };
