const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

require('dotenv').config();

// MONGODB
const connectToMongoDB = require('./config/mongodb');

const app = express();
const port = process.env.PORT || 3000;

const route = require('./routes/index');

connectToMongoDB();

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

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Running server on port ${port}`);
});
