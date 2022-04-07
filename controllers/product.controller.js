const asyncHandle = require('../middlewares/asyncHandle');

const renderSite = asyncHandle(async (req, res, next) => {
    res.render('product');
});

module.exports = {
    renderSite,
};
