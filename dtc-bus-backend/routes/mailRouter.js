const express = require('express');
const sendMail = require("../Mail/Mailer");
const router = express.Router();

app.post("/send-email", async (req, res) => {
    const { email } = req.body;
    const subject = "OTP from Bus Scheduling"
    const OTP = Math.floor(Math.random*9999);
    const message = `Your OTP is ${OTP} and Don not share this to anyone, this will Expire in 2 minutes`
    try {
      await sendMail(email, subject, message);
      res.status(200).json({ success: true, message: "Email sent successfully",OTP:OTP });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to send email" });
    }
  });

  module.exports = router;