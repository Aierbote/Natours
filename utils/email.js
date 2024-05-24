const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Create Define the email
  const mailOptions = {
    from: 'Alberto Cangialosi (Jonas Schmedtmann) <mia@personale.it>',
    to: options.email, // from the function signature
    subject: options.subject,
    text: options.message,
    // html: // NOTE : saving it for later, when we will do a pretty version
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
