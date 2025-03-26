const express = require("express");
const sendMail = require("../Mail/Mailer");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("📩 Email Request Received in MailRouter");

  const { email, msg } = req.body;

  let subject = "";
  let message = "";
  let OTP = null;

  // ✅ CASE 1: Password Reset - Send OTP
  if (msg === "Password Changed") {
    subject = "🔐 OTP from Bus360";
    OTP = Math.floor(1000 + Math.random() * 9000);
    message = `Your OTP is **${OTP}**. Do not share this OTP with anyone for security reasons.  
If you did not request this, please ignore this email.`;
  }

  // ✅ CASE 2: Successful Login Notification
  else if (msg.role === "Login") {
    console.log("📌 Login Email Data:", msg);

    subject = `✅ Login Successful - Bus360`;
    message = `Dear ${msg.name},  

You have **successfully logged into your Bus360 account**.  
If this wasn't you, please reset your password immediately.  

🚍 **Safe Travels,**  
**The Bus360 Team**`;
  }

  // ✅ CASE 3: New Crew Member Added by Admin
  else if (msg.name && msg.role) {
    console.log("📌 New Crew Member Email Data:", msg);

    subject = `🎉 Welcome to Bus360, ${msg.name}!`;
    message = `Dear ${msg.name},  

You have been **added as a ${msg.role}** in the **Bus360 system** by the admin.  

🛠 **Your Login Credentials:**  
- **Email:** ${email}  
- **Default Password:** 1  

🔑 **Please log in and change your password immediately.**  

If you have any concerns, please contact the admin.  

🚍 **Best Regards,**  
**The Bus360 Team**`;
  }

  try {
    console.log(`📨 Sending Email to: ${email} | Subject: ${subject}`);

    // ✅ Send Email
    const result = await sendMail(email, subject, message);

    if (result.success) {
      console.log("✅ Email Sent Successfully");
      res.status(200).json({
        success: true,
        message: "✅ Email sent successfully",
        OTP,
      });
    } else {
      console.error("❌ Failed to Send Email");
      res.status(500).json({ success: false, message: "Failed to send email" });
    }
  } catch (error) {
    console.error("❌ Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending email",
      error,
    });
  }
});

module.exports = router;
