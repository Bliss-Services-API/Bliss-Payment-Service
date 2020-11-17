'use strict';

module.exports = () => {
    const stripeTestSecretApiKey = process.env.STRIPE_TEST_SECRET_API_KEY;
    const stripe = require('stripe')(stripeTestSecretApiKey);

    const pay = async (customerId, paymentAmount, currency, paymentMethod = null) => {
        if(!paymentMethod) {
            const stripePaymentIntent = await stripe.paymentIntents.create({
                amount: paymentAmount,
                currency: currency,
                customer: customerId
            });

            return stripePaymentIntent.client_secret;
        }
        else {
            const stripePaymentIntent = await stripe.paymentIntents.create({
                amount: paymentAmount,
                currency: currency,
                customer: customerId,
                paymentMethod: paymentMethod
            });

            return stripePaymentIntent.client_secret;
        }
    };

    const getPaymentProfileSaved = async (clientId) => {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: clientId,
            type: 'card'
        });

        return paymentMethods;
    };

    const savePaymentProfileForFuturePayment = async (clientId) => {
        const intent =  await stripe.setupIntents.create({
            customer: clientId
        });

        return intent.client_secret;
    };

    return {
        pay, 
        savePaymentProfileForFuturePayment,
        getPaymentProfileSaved
    };
}