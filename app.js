const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const stripeSecretKey =
  'sk_test_51JZTWQSIUZLasS08u9zNVrRNGjlNZ3u9CiijMHpdMAzeEMIPPvs6AKqaKoGm1yL5IQ8gRxW4CMHh35hNCjrsP7e300LYhor1Mi';
const asyncHanlder = require('express-async-handler');
const stripeController = require('./controller/stripe');
const app = express();

app.use(cors());

// Routes:
// Pass Name as query to create customer
app.get('/createCustomer', stripeController.createCustomer);
app.get('/getCustomer', stripeController.getCustomerFromStripe);
// Create Subscription
app.get('/createSubscription', stripeController.createSubscription);
// Create Session and Make Subscription
app.get('/createSession', stripeController.createSession);

// Get Product Details From Stripe
app.get('/getProductDetails', stripeController.getProductDetails);
app.get('/createProduct', stripeController.createProduct);
// Get Price Details From Stripe
app.get('/getPriceDetails', stripeController.getPriceDetails);

app.get('/paymentSuccess', (req, res) => {
  res.status(200).json({
    status: 'Payment Success',
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Success',
    message: 'Welcome to stripe Test',
  });
});

module.exports = app;
