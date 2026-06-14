const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 resolution for Node.js 17+ as Render does not support outbound IPv6
dns.setDefaultResultOrder("ipv4first");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.verify();
  console.log("SMTP connected successfully");

  const mailOptions = {
    from: `"News Portal" <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;