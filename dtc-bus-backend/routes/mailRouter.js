const express = require("express");
const sendMail = require("../Mail/Mailer");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("email in the MailRouter ");
    const { email } = req.body;
    
    const subject = "OTP from Bus Scheduling";
    const OTP = Math.floor(1000 + Math.random() * 9000);
    const message = `Your OTP is ${OTP}. Do not share this with anyone.`;
    
    try {
      const result = await sendMail(email, subject, message);
  
      if (result.success) {
        res.status(200).json({ success: true, message: "✅ Email sent successfully", OTP: OTP });
      } else {
        res.status(500).json({ success: false, message: "Failed to send email" });
      }
    } catch (error) {
      console.error("❌ Email Error:", error);
      res.status(500).json({ success: false, message: "Error sending email", error });
    }
  });
  
  

module.exports = router;
