const jwt = require('jsonwebtoken');

const Order = require('../models/Order');
const User = require('../models/User');
const OrderProduct = require('../models/OrderProduct');
const asyncHandle = require('../middlewares/asyncHandle');
const ErrorResponse = require('../common/ErrorResponse');

module.exports = {
  // [GET] /orders/admin
  getAllOrdersOfUsers: asyncHandle(async (req, res) => {
    const user = await User.findOne({ username: res.locals.username });
    const orders = await Order.find()
      .populate('user')
      .populate({
        path: 'products',
        populate: {
          path: 'product',
        },
      });
    return res.render('admin/orders', {
      orders,
      userFName: user?.full_name,
      userRole: user?.role,
      userId: user?.id,
      user,
    });
  }),

  // [GET] /orders/deleted/admin
  getAllDeletedOrders: asyncHandle(async (req, res) => {
    const user = await User.findOne({ username: res.locals.username });
    const orders = await Order.findDeleted()
      .populate('user')
      .populate({
        path: 'products',
        populate: {
          path: 'product',
        },
      });
    return res.render('admin/orders/deleted', {
      orders,
      userFName: user?.full_name,
      userRole: user?.role,
      userId: user?.id,
      user,
    });
  }),

  // [GET] /orders/admin/:userId
  getAllOrdersOfUserByIdAdmin: asyncHandle(async (req, res) => {
    const user = await User.findOne({ username: res.locals.username });
    const { userId } = req.params;
    const owner = await User.findById(userId);
    const ordersDeleted = await Order.findDeleted({ user: userId })
      .populate('user')
      .populate({
        path: 'products',
        populate: {
          path: 'product',
        },
      });
    const orders = await Order.find({ user: userId })
      .populate('user')
      .populate({
        path: 'products',
        populate: {
          path: 'product',
        },
      });

    return res.render('admin/orders/userorders', {
      owner,
      orders: [...orders, ...ordersDeleted],
      userId,
      userFName: user?.full_name,
      userRole: user?.role,
      user,
    });
  }),

  // [GET] /orders/:userId
  getAllOrdersOfUserById: asyncHandle(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const ordersDeleted = await Order.findDeleted({ user: userId })
      .populate('user')
      .populate({
        path: 'products',
        populate: {
          path: 'product',
        },
      });
    const orders = await Order.find({ user: userId })
      .populate('user')
      .populate({
        path: 'products',
        populate: {
          path: 'product',
        },
      });
    return res.render('myorders', {
      orders: [...orders, ...ordersDeleted],
      userId,
      userFName: user?.full_name,
      userRole: user?.role,
      user,
    });
  }),

  //[POST] /orders/:userId
  createOrder: asyncHandle(async (req, res) => {
    const { userId } = req.params;
    const reqBody = req.body;
    const user = await User.findById(userId);
    const products = await OrderProduct.insertMany(reqBody.products);
    const order = {
      customer_address: reqBody.customer_address,
      phone_number: reqBody.phone_number || user.phone_number,
      user: userId,
      products,
      note: reqBody.note,
    };
    await Order.create(order);
    return res.send('Create order successfully');
  }),

  //[PUT] /orders/:orderId
  updateOrderByOrderId: asyncHandle(async (req, res) => {
    const reqBody = req.body;
    const { orderId } = req.params;
    const order = {
      customer_address: reqBody.customer_address,
      phone_number: reqBody.phone_number,
      products: reqBody.products,
    };
    await Order.findByIdAndUpdate(orderId, order);
    return res.send('Update successfully');
  }),

  // [PATCH] /orders/trash/:orderId/restore
  restoreOrderByOrderId: asyncHandle(async (req, res) => {
    const { orderId } = req.params;
    await Order.restore({ _id: orderId });
    res.send('Restore successfully');
  }),

  // [DELETE] /orders/:orderId
  deleteOrderByOrderId: asyncHandle(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    order.products.forEach(
      async (id) => await OrderProduct.deleteMany({ _id: id })
    );

    res.send('Delete successfully');
  }),

  // [DELETE] /orders/trash/:orderId
  moveOrderToTrashByOrderId: asyncHandle(async (req, res) => {
    await Order.delete({ _id: req.params.orderId });
    res.send('Delete successfully');
  }),
};
