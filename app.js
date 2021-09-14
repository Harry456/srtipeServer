const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const stripeSecretKey =
  'sk_test_51JZTWQSIUZLasS08u9zNVrRNGjlNZ3u9CiijMHpdMAzeEMIPPvs6AKqaKoGm1yL5IQ8gRxW4CMHh35hNCjrsP7e300LYhor1Mi';
const asyncHanlder = require('express-async-handler');

const app = express();

app.use(cors());

// app.get('/', (req, res) => {
//   res.status(200).json({
//     status: 'Success',
//     message: 'Welcome to stripe Test',
//   });
// });

const createCharges = asyncHanlder(async (req, res, next) => {
  const { name } = req.query;
  console.log(name);

  const stripe = Stripe(stripeSecretKey);
  console.log(stripeSecretKey);
  const customer = await stripe.customers.create({
    name: name,
    address: {
      city: 'Chennai',
      country: 'India',
      line1: '123 , Abcd street',
      postal_code: '123456',
      state: 'TamilNadu',
    },
    // currency: 'inr',
    email: `${name}@test.com`,
    description: 'My Test Customer',
    metadata: {
      productId: '123abcd456efgh',
    },
  });
  console.log(customer);
  res.status(200).json({
    status: 'Success',
    message: 'Good to Go',
  });
});

const getCustomerFromStripe = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const customer = await stripe.customers.retrieve('cus_KDyBaDM9BFq1C0');

  console.log(customer);

  res.status(200).json({
    status: 'Success',
    data: customer,
  });
});

const createSubscription = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const subscription = await stripe.subscriptions.create({
    customer: 'cus_KDyBaDM9BFq1C0',
    // default_source: 'card_18NVYR2eZvKYlo2CQ2ieV9S5',
    items: [{ price: 'price_1JZUhRSIUZLasS08U1banUmU' }],
  });
  res.status(201).json({
    status: 'Success',
    data: subscription,
  });
});

// Pass Name as query to create customer
app.get('/createCustomer', createCharges);
app.get('/getCustomer', getCustomerFromStripe);

// Create Subscription
app.get('/createSubscription', createSubscription);

module.exports = app;
