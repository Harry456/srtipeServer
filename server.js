const app = require('./app');

const port = process.env.PORT || 4500;
const server = app.listen(port, () =>
  console.log(`App Listening on Port ${port}`)
);
