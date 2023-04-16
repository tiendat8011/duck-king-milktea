const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const route = require('./routes/index');
const morgan = require('./config/morgan');

const port = process.env.PORT || 3000;
require('dotenv').config();

// MONGODB
const connectToMongoDB = require('./config/mongodb');

const errorHandle = require('./middlewares/errorHandle');
const logger = require('./config/logger');

const autoCreateAdmin = require('./common/autoCreateAdmin');
autoCreateAdmin();

const app = express();
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

connectToMongoDB();

app.use(cookieParser(process.env.PRIVATE_MESSAGE));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  express.urlencoded({
    // middleware xu li du lieu duoc submit len tu form
    extended: true,
  })
);

app.use(express.json());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);

app.use(errorHandle);

// Admin info logger
logger.info(`Admin full name: ${process.env.ADMIN_FULLNAME}`);
logger.info(`Admin phone number: ${process.env.ADMIN_PHONENUM}`);
logger.info(`Admin username: ${process.env.ADMIN_USERNAME}`);
logger.info(`Admin mail: ${process.env.ADMIN_MAIL}`);

app.listen(port, (err) => {
  if (err) console.log(err);
  logger.info(`Running server on port ${port}`);
});
