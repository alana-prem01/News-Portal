const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 2525,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL, // Your Brevo login email
        pass: process.env.SMTP_PASSWORD, // Your Brevo SMTP key
      },
    });

    const mailOptions = {
      from: `"News Portal" <${process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const data = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", data.messageId);
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    throw error;
  }
};

module.exports = sendEmail;