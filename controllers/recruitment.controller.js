const asyncHandle = require('../middlewares/asyncHandle');

const renderSite = asyncHandle(async (req, res, next) => {
    res.render('recruitment');
});

module.exports = {
    renderSite,
};
