const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const PORT = process.env.PORT | 3000;

console.log(process.env.PORT);

// console.log(app.get('env'));
// console.log(process.env);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
