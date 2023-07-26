const nodemailer = require("nodemailer");

const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const message = event.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: "niconico83@icloud.com", // Replace with the address of the recipient
    subject: "New Scan Eat Client",
    text: message,
  };
  const mailOptions1 = {
    from: process.env.EMAIL_USERNAME,
    to: process.env.EMAIL_USERNAME, // Replace with the address of the recipient
    subject: "New Scan Eat Client",
    text: message,
  };
  await transporter.sendMail(mailOptions);
  await transporter.sendMail(mailOptions1);
};

// Utilisez netlify-lambda pour exporter la fonction serverless
module.exports.handler = serverless(exports.handler);
