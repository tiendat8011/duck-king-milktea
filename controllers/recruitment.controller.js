const asyncHandle = require('../middlewares/asyncHandle');
const User = require('../models/User');
const renderSite = asyncHandle(async (req, res, next) => {
  const user = await User.findOne({ username: res.locals.username });
  res.render('recruitment', {
    userFName: user?.full_name,
    userRole: user?.role,
    userId: user?.id,
    user,
  });
});

module.exports = {
  renderSite,
};
