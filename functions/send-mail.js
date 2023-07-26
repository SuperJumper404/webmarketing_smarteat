const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const message = event.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ns.ayness@gmail.com",
      pass: "zfxtkpxqikgofgxz",
    },
  });

  const mailOptions = {
    from: "ns.ayness@gmail.com",
    to: "niconico83@icloud.com", // Replace with the address of the recipient
    subject: "New Scan Eat Client",
    text: message,
  };
  const mailOptions1 = {
    from: "ns.ayness@gmail.com",
    to: "ns.ayness@gmail.com", // Replace with the address of the recipient
    subject: "New Scan Eat Client",
    text: message,
  };
  await transporter.sendMail(mailOptions);
  await transporter.sendMail(mailOptions1);
};

// Utilisez netlify-lambda pour exporter la fonction serverless
module.exports.handler = serverless(exports.handler);
