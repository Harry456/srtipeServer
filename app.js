const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripeSecretKey =
  "sk_test_51JZTWQSIUZLasS08u9zNVrRNGjlNZ3u9CiijMHpdMAzeEMIPPvs6AKqaKoGm1yL5IQ8gRxW4CMHh35hNCjrsP7e300LYhor1Mi";
const asyncHanlder = require("express-async-handler");

const app = express();

app.use(cors());

const createCharges = asyncHanlder(async (req, res, next) => {
  const { name } = req.query;
  console.log(name);

  const stripe = Stripe(stripeSecretKey);
  console.log(stripeSecretKey);
  const customer = await stripe.customers.create({
    name: name,
    address: {
      city: "Chennai",
      country: "India",
      line1: "123 , Abcd street",
      postal_code: "123456",
      state: "TamilNadu",
    },
    // currency: 'inr',
    email: `${name}@test.com`,
    description: "My Test Customer",
    metadata: {
      productId: "123abcd456efgh",
    },
  });
  console.log(customer);
  res.status(200).json({
    status: "Success",
    message: "Good to Go",
  });
});

const getCustomerFromStripe = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const customer = await stripe.customers.retrieve("cus_KE5AtPD46hCuWa");

  console.log(customer);

  res.status(200).json({
    status: "Success",
    data: customer,
  });
});

const createSubscription = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const subscription = await stripe.subscriptions.create({
    customer: "cus_KE20K5N0JJjH7S",
    // default_source: 'card_18NVYR2eZvKYlo2CQ2ieV9S5',
    items: [{ price: "price_1JZUhRSIUZLasS08U1banUmU" }],
  });
  res.status(201).json({
    status: "Success",
    data: subscription,
  });
});

// Create session
// const createSession = asyncHanlder(async (req, res, next) => {
//   const stripe = Stripe(stripeSecretKey);

//   const session = await stripe.checkout.sessions.create({
//     success_url: "http://localhost:4500/paymentSuccess",
//     cancel_url: "http://localhost:4500/",
//     payment_method_types: ["card"],
//     line_items: [{ price: "price_1JZUhSSIUZLasS08dEUajjQl", quantity: 1 }],
//     mode: "subscription",
//     customer: "cus_KE5AtPD46hCuWa",
//   });

//   console.log(session);

//   res.status(200).json({
//     status: "success",
//   });
// });
const createSession = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:4500/paymentSuccess",
    cancel_url: "http://localhost:4500/",
    payment_method_types: ["card"],
    line_items: [{ price: "price_1JZdjbSIUZLasS087dwqesuG", quantity: 1 }],
    mode: "subscription",
    customer: "cus_KE5AtPD46hCuWa",
  });

  console.log(session);

  res.status(200).json({
    status: "success",
  });
});

// Pass Name as query to create customer
app.get("/createCustomer", createCharges);
app.get("/getCustomer", getCustomerFromStripe);

// Create Subscription
app.get("/createSubscription", createSubscription);
app.get("/createSession", createSession);

app.get("/paymentSuccess", (req, res) => {
  res.status(200).json({
    status: "Payment Success",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Welcome to stripe Test",
  });
});

module.exports = app;
