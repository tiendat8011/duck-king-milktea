const ErrorResponse = require('../common/ErrorResponse');
const homeRouter = require('./home.router');
const userRouter = require('./user.router');
const franchiseRouter = require('./franchise.router');
const authRouter = require('./auth.router');
const introduceRouter = require('./introduce.router');
const productRouter = require('./product.router');
const newsRouter = require('./news.router');
const storeRouter = require('./store.router');
const recruitmentRouter = require('./recruitment.router');
const orderRouter = require('./order.router');
const orderProductRouter = require('./orderProduct.router');
const notfoundRouter = require('./notfound.router');
const noPermissionRouter = require('./nopermission.router');

function route(app) {
    app.use('/orders', orderRouter);
    app.use('/order-product', orderProductRouter);
    app.use('/users', userRouter);
    app.use('/auth', authRouter);
    app.use('/products', productRouter);
    app.use('/franchise', franchiseRouter);
    app.use('/introduce', introduceRouter);
    app.use('/news', newsRouter);
    app.use('/stores', storeRouter);
    app.use('/recruitment', recruitmentRouter);
    app.use('/notfound', notfoundRouter);
    app.use('/nopermission', noPermissionRouter);
    app.use('/', homeRouter);
    app.use('*', (req, res, next) => {
        // return next(new ErrorResponse('Not found route', 404));
        return res.redirect('/notfound');
    });
}

module.exports = route;
