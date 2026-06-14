const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      // IMPORTANT: Replace this with your verified domain email once you add a domain to Resend
      from: "News Portal <onboarding@resend.dev>",
      to: [options.email],
      subject: options.subject,
      text: options.message,
    });
    
    console.log("Email sent successfully", data);
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    throw error;
  }
};

module.exports = sendEmail;