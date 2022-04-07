const asyncHandle = require('../middlewares/asyncHandle');

const renderSite = asyncHandle(async (req, res, next) => {
    res.render('introduce');
});

module.exports = {
    renderSite,
};
