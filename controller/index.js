module.exports = () => {
    const blissPaymentController = require('./BlissPaymentController');
    const webhookController = require('./StripeWebhooksController');

    return  {
        blissPaymentController,
        webhookController
    };
}