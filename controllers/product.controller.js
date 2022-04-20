const asyncHandle = require('../middlewares/asyncHandle');
const Product = require('../models/Product');

module.exports = {
    // [GET] /products
    renderSite: asyncHandle(async (req, res) => {
        res.render('product');
    }),

    //[GET] /products/:id
    getProduct: asyncHandle(async (req, res) => {
        let { id } = req.params;
        const user = await Product.findById(id);
        res.status(200).json(user);
    }),

    //[POST] /products
    createProduct: asyncHandle(async (req, res) => {
        await Product.create(req.body);
        res.redirect('/products');
    }),

    //[PUT] /products/:id
    updateProductById: asyncHandle(async (req, res) => {
        let { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        res.status(200).json(product);
    }),

    //[DELETE] /products/:id
    deleteProductById: asyncHandle(async (req, res) => {
        let { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(204).json({ msg: 'successfully delete' });
    }),
};
