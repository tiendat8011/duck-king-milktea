const { stat, access } = require('node:fs');
const { unlinkSync } = require('node:fs');

const uploadService = require('../services/upload.service');
const asyncHandle = require('../middlewares/asyncHandle');
const Product = require('../models/Product');
const User = require('../models/User');
const ErrorResponse = require('../common/ErrorResponse');
const pick = require('../common/pick');
const logger = require('../config/logger');

module.exports = {
  // [GET] /products
  getAllProducts: asyncHandle(async (req, res) => {
    // Giam gia vao thu 7 ...
    // const checkTime = new Date();
    // console.log(checkTime.getDay());
    const user = await User.findOne({ username: res.locals.username });
    const products = await Product.find();
    res.render('products', {
      products,
      userFName: user?.full_name,
      userRole: user?.role,
      userId: user?.id,
      user,
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
      user,
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
      user,
    });
  }),

  //[POST] /products/admin
  createProduct: asyncHandle(async (req, res) => {
    let mimetypes = ['image/gif', 'image/jpeg', 'application/pdf'];

    const documentBodyUploaded = await uploadService.uploadFile(
      req,
      'product',
      mimetypes
    );

    // console.log(documentBodyUploaded);
    const { image, fields } = documentBodyUploaded;
    if (Array.isArray(image))
      throw new ErrorResponse(400, 'Yeu cau gui 1 file duy nhat');

    const imageData = image.filepath;

    const product = pick(fields, ['name', 'price', 'category', 'description']);
    const productCreated = await Product.create({
      ...product,
      image: imageData,
    });
    res.status(200).json(productCreated);
    // res.redirect('/products/admin');
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
    const product = await Product.findByIdAndDelete(id);
    access('public' + product.image, function (err) {
      if (err) {
        logger.error("File not found!. Can't delete image");
      } else {
        unlinkSync('public' + product.image);
        logger.info('Delete image successfully');
      }
    });
    // unlinkSync(product.image);
    res.status(204).json({ msg: 'successfully delete' });
  }),
};
