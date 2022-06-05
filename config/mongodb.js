const mongoose = require('mongoose');

async function connectToDB() {
    await mongoose
        .connect(process.env.MONGODB || 'mongodb://0.0.0.0:27017/milktea-web')
        .then(() => {
            console.log('Connected to mongo database');
        })
        .catch((err) => {
            console.log(err.message);
        });
}

module.exports = connectToDB;
