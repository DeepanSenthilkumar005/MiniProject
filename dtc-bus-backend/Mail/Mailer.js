const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: "Bus360",
      address: process.env.EMAIL,
    },
    to: to,
    subject: subject,
    html: html, // ✅ Supports HTML formatting
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    if (info.accepted.length > 0) {
      console.log("✅ Email Sent Successfully to:", info.accepted);
      return { success: true, message: "Email sent successfully", info };
    } else {
      console.log("❌ Email Failed to Send");
      return { success: false, message: "Email failed to send", info };
    }
  } catch (error) {
    console.error("❌ Error Sending Email:", error);
    return { success: false, message: "Error sending email", error };
  }
};

module.exports = sendMail;
