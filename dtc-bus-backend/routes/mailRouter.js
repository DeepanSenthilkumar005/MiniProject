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
    message = `
      <p>Your OTP is <strong>${OTP}</strong>. Do not share this OTP with anyone for security reasons.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;
  }

  // ✅ CASE 2: Successful Login Notification
  else if (msg.role === "Login") {
    console.log("📌 Login Email Data:", msg);

    subject = `✅ Login Successful - Bus360`;
    message = `
      <p>Dear <strong>${msg.name}</strong>,</p>

      <p>You have <strong>successfully logged into your Bus360 account</strong>.</p>
      
      <p>If this wasn't you, please reset your password immediately.</p>

      <p>🚍 <strong>Safe Travels,</strong><br>
      <strong>The Bus360 Team</strong></p>
    `;
  }
  // ✅ CASE 4: Crew Assignment Notification
  else if (msg.role === "Assignment" && msg.schedule) {
    subject = `📢 New Schedule Assigned - Bus360`;
    message = `
      <p>Dear <strong>${msg.name}</strong>,</p>
  
      <p>You have been assigned to a new schedule in the Bus360 system.</p>
  
      <ul>
        <li><strong>Bus:</strong> ${msg.schedule.busName} (${
      msg.schedule.busNumber
    })</li>
        <li><strong>Route:</strong> ${msg.schedule.route}</li>
        <li><strong>Departure Time:</strong> ${new Date(
          msg.schedule.time
        ).toLocaleString()}</li>
      </ul>
  
      <p>Please be ready for the shift and report on time.</p>
  
      <p>🚍 <strong>Regards,</strong><br>
      <strong>Bus360 Team</strong></p>
    `;
  }

  // ✅ CASE 3: New Crew Member Added by Admin
  else if (msg.name && msg.role) {
    console.log("📌 New Crew Member Email Data:", msg);

    subject = `🎉 Welcome to Bus360, ${msg.name}!`;
    message = `
      <p>Dear <strong>${msg.name}</strong>,</p>

      <p>You have been <strong>added as a ${msg.role}</strong> in the <strong>Bus360 system</strong> by the admin.</p>

      <p>🛠 <strong>Your Login Credentials:</strong></p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Default Password:</strong> 1</li>
      </ul>

      <p>🔑 <strong>Please log in and change your password immediately.</strong></p>
      <a href="https://bus360.netlify.app/login">Login Here</a>

      <p>If you have any concerns, please contact the admin.</p>

      <p>🚍 <strong>Best Regards,</strong><br>
      <strong>The Bus360 Team</strong></p>
    `;
  }

  try {
    console.log(`📨 Sending Email to: ${email} | Subject: ${subject}`);

    // ✅ Send Email (Ensure the mailer supports HTML format)
    const result = await sendMail(email, subject, message, true); // Pass `true` to indicate HTML content

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
