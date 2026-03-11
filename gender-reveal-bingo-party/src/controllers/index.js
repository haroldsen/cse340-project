
// Route handlers for static pages

const homePage = (req, res) => {
    res.render('index', { title: 'Home' });
};

const aboutPage = (req, res) => {
    res.render('about', { title: 'About' });
};

const getCardsPage = (req, res) => {
    res.render('get-cards', { title: 'Get Cards | Gender Reveal Bingo Party' })
}

const demoPage = (req, res) => {
    res.render('demo', { title: 'Middleware Demo Page' });
};

const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

export { homePage, aboutPage, getCardsPage, demoPage, testErrorPage };
