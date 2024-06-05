const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

// run script from project root directory (not from the base of Jonas' repo)
dotenv.config({ path: './config.env' });

const DATABASE = process.env.DB_STRING;
const USERNAME = process.env.MY_MONGO_ATLAS_USRNM;
const PASSWORD = process.env.MY_MONGO_ATLAS_PSSWRD;

const DB = DATABASE.replace('<USERNAME>', USERNAME).replace(
  '<PASSWORD>',
  PASSWORD,
);

// DEBUG :
console.log('connecting to db');

// CONNECT TO DATABASE and with async/await Avoiding MongooseError buffering timed out after 10000ms
(async function () {
  await mongoose
    .connect(DB, {
      // .connect(process.env.DB_STRING_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true, // fix MongooseError buffering timed out after 10000ms
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB Connection Successful'))
    .catch((err) =>
      console.error(
        `Double check Connection String, either local or remote? ${err}`,
      ),
    );
})();

// DEBUG :
console.log('connected to db');

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    // READ JSON FILES
    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'),
    );
    const users = JSON.parse(
      fs.readFileSync(`${__dirname}/users.json`, 'utf-8'),
    );
    const reviews = JSON.parse(
      fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
    );

    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
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
    // DEBUG :
    console.log('deleted tours from db');

    await User.deleteMany();
    // DEBUG :
    console.log('deleted users from db');

    await Review.deleteMany();
    // DEBUG :
    console.log('deleted reviews from db');
    console.log('🪫 Data successfully deleted!');
  } catch (err) {
    console.log(`Error ${err}`);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();

// setTimeout(() => {
//   console.log('Process Interrupted after 10_000 ms');
//   process.exit();
// }, 10_000);
