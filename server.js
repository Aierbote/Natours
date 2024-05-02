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
  })
  .then(() => console.log('DB Connection Successful'))
  .catch((err) =>
    console.error(
      `Double check Connection String, either local or remote? ${err}`,
    ),
  );

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const app = require('./app');

const PORT = process.env.PORT || 3000;

// console.log(app.get('env'));
// console.log(process.env);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
