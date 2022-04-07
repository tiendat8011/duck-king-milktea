const asyncHandle = require('../middlewares/asyncHandle');
const User = require('../models/User');

const renderSite = asyncHandle(async (req, res, next) => {
    const user = await User.findOne({ name: 'chee' });
    res.render('home', {
        user,
    });
});

module.exports = {
    renderSite,
};
