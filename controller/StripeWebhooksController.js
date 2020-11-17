'use strict';

module.exports = () => {
    const nodemailer = require('nodemailer');

    const handlePaymentIntentSucceeded = async (paymentIntent) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.FROM_EMAIL
            }
        });

        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: process.env.TO_EMAIL,
            subject: "Bliss Client Payment Receipt",
            text: `Client Payment Intent: ${paymentIntent}`
        });

        transporter.sendMail(info, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    };

    return {
        handlePaymentIntentSucceeded
    };
}