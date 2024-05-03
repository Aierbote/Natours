const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

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
  .then(() => console.log('DB Connection Successful'))
  .catch((err) =>
    console.error(
      `Double check Connection String, either local or remote? ${err}`,
    ),
  );

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('🔋 Data successfully loaded!');
  } catch (err) {
    console.log(`Error: ${err}`);
  } finally {
    process.exit();
  }
};

// DELETE ALL OLD DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('🪫 Data successfully deleted!');
  } catch (err) {
    console.log(`Error ${err}`);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();

setTimeout(() => {
  console.log('Process Interrupted after 10_000 ms');
  process.exit();
}, 10_000);
