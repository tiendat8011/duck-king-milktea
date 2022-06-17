const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = async (to, subject, htmlContent) => {
    const transporter = await nodeMailer.createTransport(
        smtpTransport({
            // host: 'smtp.googlemail.com',
            service: 'gmail',
            port: 587,
            secure: true,
            auth: {
                user: process.env.ADMIN_MAIL,
                pass: process.env.ADMIN_MAIL_PASSWORD,
            },
        })
    );
    // console.log(transporter);
    // let info = await transporter.sendMail({
    await transporter.sendMail({
        from: process.env.ADMIN_MAIL,
        to: to,
        subject: subject,
        html: htmlContent,
    });
    // console.log(info);
    console.log('successfully send email');
};
