const asyncHanlder = require('express-async-handler');
const Stripe = require('stripe');
const stripeSecretKey =
  'sk_test_51JZTWQSIUZLasS08u9zNVrRNGjlNZ3u9CiijMHpdMAzeEMIPPvs6AKqaKoGm1yL5IQ8gRxW4CMHh35hNCjrsP7e300LYhor1Mi';

exports.createCustomer = asyncHanlder(async (req, res, next) => {
  const { name } = req.query;
  console.log(name);
  if (!name) {
    return res.status(200).json({
      status: 'Warning',
      message: 'Enter Customer Name - query',
    });
  }

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

exports.getCustomerFromStripe = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const customer = await stripe.customers.retrieve('cus_KE5AtPD46hCuWa');

  console.log(customer);

  res.status(200).json({
    status: 'Success',
    data: customer,
  });
});

exports.createSubscription = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const subscription = await stripe.subscriptions.create({
    customer: 'cus_KE20K5N0JJjH7S',
    // default_source: 'card_18NVYR2eZvKYlo2CQ2ieV9S5',
    items: [{ price: 'price_1JZUhRSIUZLasS08U1banUmU' }],
  });
  res.status(201).json({
    status: 'Success',
    data: subscription,
  });
});

exports.createSession = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const checkOutSession = await stripe.checkout.sessions.create({
    success_url: 'http://localhost:4500/paymentSuccess',
    cancel_url: 'http://localhost:4500/',
    payment_method_types: ['card'],
    line_items: [{ price: 'price_1JZdjbSIUZLasS087dwqesuG', quantity: 1 }],
    mode: 'subscription',
    customer: 'cus_KELGSVcWGQq43H',
    metadata: {
      agencyName: 'TestName Agency',
      agencyEmail: 'agencyTest@test.com',
      agencyId: '1234567890',
    },
  });

  console.log(checkOutSession);

  res.status(200).json({
    status: 'success',
    data: checkOutSession,
  });
});

exports.createProduct = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const newProduct = await stripe.products.create({
    name: 'Digitial Marketing',
    metadata: {
      targetAudience: 'Marketing Users',
    },
  });

  const price = await stripe.prices.create({
    unit_amount: 1000,
    currency: 'inr',
    recurring: { interval: 'month' },
    product: newProduct.id,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      newProduct,
      price,
    },
  });
});

exports.getProductDetails = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const product = await stripe.products.retrieve('prod_KE5vEoqFrJG5dr');

  console.log(product);

  res.status(200).json({
    status: 'Success',
    data: product,
  });
});

exports.getPriceDetails = asyncHanlder(async (req, res, next) => {
  const stripe = Stripe(stripeSecretKey);

  const price = await stripe.prices.retrieve('price_1JZsHESIUZLasS08PYINeh0y');

  console.log(price);

  res.status(200).json({
    status: 'Success',
    data: price,
  });
});
