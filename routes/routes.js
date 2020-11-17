
module.exports = () => {
    const express = require('express');
    const router = express.Router();
    const controller = require('../controller');

    const blissPaymentController = controller().blissPaymentController();
    const webhookController = controller().webhookController();

    router.post('payment/pay', async (req, res) => {
        const clientId = req.body.client_id;
        const paymentAmount = req.body.payment_amount;
        const currency = req.body.currency;
        const paymentMethod = req.body.payment_method;

        try {
            if(paymentMethod === undefined)
                paymentMethod === null;

            const clientSecret = await blissPaymentController.pay(clientId, paymentAmount, currency, paymentMethod);

            res.send({
                MESSAGE: 'DONE',
                RESPONSE: 'PaymentIntent Fetched',
                CODE: 'PAYMENT_INTENT_FETCHED',
                CLIENTSECRET: clientSecret
            });
        } catch(err) {
            console.error(`ERR: ${err.message}`);

            res.status(400).send({
                ERR: err.message,
                RESPONSE: 'PaymentIntent Fetch Failed!',
                CODE: 'PAYMENT_INTENT_FETCH_FAILED'
            });
        }
    })

    router.post('payment/save/profile', async (req, res) => {
        const clientId = req.body.client_id;

        try {
            const clientSecret = await blissPaymentController.savePaymentProfileForFuturePayment(clientId);

            res.send({
                MESSAGE: 'DONE',
                RESPONSE: 'SetupIntent Fetched',
                CODE: 'SETUP_INTENT_FETCHED',
                CLIENTSECRET: clientSecret
            });
        } catch(err) {
            console.error(`ERR: ${err.message}`);

            res.status(400).send({
                ERR: err.message,
                RESPONSE: 'SetupIntent Fetch Failed!',
                CODE: 'SETUP_INTENT_FETCH_FAILED'
            });   
        }
    });

    router.post('payment/get/profile', async (req, res) => {
        const clientId = req.body.client_id;

        try {
            const paymentMethods = await blissPaymentController.getPaymentProfileSaved(clientId);

            res.send({
                MESSAGE: 'DONE',
                RESPONSE: 'PaymentMethods Fetched',
                CODE: 'PAYMENT_METHODS_FETCHED',
                CLIENTSECRET: paymentMethods
            });
        } catch(err) {
            console.error(`ERR: ${err.message}`);

            res.status(400).send({
                ERR: err.message,
                RESPONSE: 'PaymentMethods Fetch Failed',
                CODE: 'PAYMENT_METHODS_FETCH_FAILED'
            });
        }
    })

    router.post('webhook', async (request, response) => {
        let event;
        try {
          event = JSON.parse(request.body);
        } catch (err) {
          console.log(`Webhook error while parsing basic request.`, err.message);
          return response.send();
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                await webhookController.handlePaymentIntentSucceeded(paymentIntent);
                break;
            default:
                console.log(`Unhandled event type ${event.type}.`);
        }

        response.send();
      });

    router.get('ping', (req, res) => {
        res.send('OK');
    });

    return router;
}