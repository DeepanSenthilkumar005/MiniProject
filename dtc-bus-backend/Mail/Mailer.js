const nodemailer = require("nodemailer");

// Create Transporter (Using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",  // Your email
    pass: "your-email-password"    // Your app password (Not your email password)
  }
});

// Send Email Function
const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: "your-email@gmail.com",  // Sender Email
    to: to,                        // Recipient Email
    subject: subject,              // Email Subject
    text: text                     // Email Content
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent: " + info.response);
  } catch (error) {
    console.error("Error Sending Email:", error);
  }
};

module.exports = sendMail;
