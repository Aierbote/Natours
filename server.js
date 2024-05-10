const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DATABASE = process.env.DB_STRING;
const USERNAME = process.env.MY_MONGO_ATLAS_USRNM;
const PASSWORD = process.env.MY_MONGO_ATLAS_PSSWRD;

const DB = DATABASE.replace('<USERNAME>', USERNAME).replace(
  '<PASSWORD>',
  PASSWORD,
);

mongoose
  .connect(DB, {
    // .connect(process.env.DB_STRING_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successful'));
// // COMMENTED OUT in favour of Handling UnhandledPromiseRejection
// .catch((err) =>
//   console.error(
//     `Double check Connection String, either local or remote? ${err}`,
//   ),
// );

const app = require('./app');

const PORT = process.env.PORT || 3000;

// console.log(app.get('env'));
// console.log(process.env);

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Last Safety Net, to catch 'em all, of the unexpected (Expect The Unexpected, "Nobody expects the Spanish Inquisition! Nobody!" )
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('🤷‍♂️ UNHANDLED REJECTION! Shutting down...');

  // To give the server the time to finish pending requests
  server.close(() => {
    process.exit(1);
  });
});
