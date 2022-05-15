const asyncHandle = require('../middlewares/asyncHandle');
const Product = require('../models/Product');
const User = require('../models/User');

module.exports = {
    // [GET] /products
    getAllProducts: asyncHandle(async (req, res) => {
        const user = await User.findOne({ username: res.locals.username });
        const products = await Product.find();
        res.render('products', {
            products,
            userFName: user?.full_name,
            userRole: user?.role,
            userId: user?.id,
        });
    }),

    // [GET] /products/admin
    getAllProductsAdmin: asyncHandle(async (req, res) => {
        const user = await User.findOne({ username: res.locals.username });
        const products = await Product.find();
        res.render('admin/products', {
            products,
            userFName: user?.full_name,
            userRole: user?.role,
            userId: user?.id,
        });
    }),

    //[GET] /products/:id
    getProduct: asyncHandle(async (req, res) => {
        let { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    }),

    // [GET] /products/create/admin
    createProductSite: asyncHandle(async (req, res) => {
        const user = await User.findOne({ username: res.locals.username });
        res.render('admin/products/create', {
            userFName: user?.full_name,
            userRole: user?.role,
            userId: user?.id,
        });
    }),

    //[POST] /products
    createProduct: asyncHandle(async (req, res) => {
        await Product.create(req.body);
        res.redirect('/products/admin');
    }),

    //[PUT] /products/:id
    updateProductById: asyncHandle(async (req, res) => {
        let { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        res.status(200).json(product);
    }),

    //[DELETE] /products/admin/:id
    deleteProductById: asyncHandle(async (req, res) => {
        let { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(204).json({ msg: 'successfully delete' });
    }),
};
