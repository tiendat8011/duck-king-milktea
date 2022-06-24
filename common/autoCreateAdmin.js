const User = require('../models/User');
const logger = require('../config/logger');

const autoCreateAdmin = async () => {
    let admin = await User.findOne({
        username: process.env.ADMIN_USERNAME,
    });
    if (admin) {
        if (admin.role === 'user') admin.role = 'admin';
        if (admin.email !== process.env.ADMIN_MAIL)
            logger.warn(
                'The current admin email is not like the email in .env file!!'
            );
        return;
    } else {
        admin = await User.create({
            full_name: process.env.ADMIN_FULLNAME,
            phone_number: process.env.ADMIN_PHONENUM,
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
            email: process.env.ADMIN_MAIL,
            role: 'admin',
        });
    }
};

module.exports = autoCreateAdmin;
