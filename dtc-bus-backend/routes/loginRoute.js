const express = require("express");
const loginModel = require("../models/Login");
const router = express.Router();
const bcrypt = require('bcryptjs');

// router.get("/auth/:mail/:password", async (req, res) => {
//   try {
//     const mailId = await loginModel.findOne({ mail: req.params.mail });
//     const password = req.params.password;
//     if (!mailId) {
//       res.status(201).json("Register your Mail");
//     } else if (password === mailId.password) {
//       res.status(200).json({msg:"✅ Valid Password",role:mailId.role,name:mailId.name,id:mailId._id});
//     } else {
//       res.status(200).json("Invalid Password");
//     }
//   } catch {
//     console.log("Error in the Mail");
//   }
// });
router.get("/auth/:mail/:password", async (req, res) => {
  try {
    const mailId = await loginModel.findOne({ mail: req.params.mail });
    const password = req.params.password;
    const passwordValidator = bcrypt.compareSync(password,mailId.password);
    if (!mailId) {
      res.status(201).json("Register your Mail");
    } else if (passwordValidator) {
      res.status(200).json({msg:"✅ Valid Password",role:mailId.role,name:mailId.name,id:mailId._id});
    } else {
      res.status(200).json("Invalid Password");
    }
  } catch {
    console.log("Error in the Mail");
  }
});

// router.post("/auth", async (req, res) => {
//   try {
//     const add = new loginModel(req.body);
//     await add.save();
//     res.status(200).json("✅ Succesfull Added");
//   } catch (error) {
//     if (error.code === 11000) {
//       res.status(400).json({ message: "Email already registered" });
//     } else {
//       console.log("Error in Adding the File " + error);
//     }
//   }
// });

router.post("/auth", async (req, res) => {
  try {
    const { name, mail, password, role } = req.body;
    // console.log(mail,name,password,role);
    
    const hashPassword = await bcrypt.hash(password,10);
    const add = new loginModel({
      name:name,
      mail:mail,
      password:hashPassword,
      role:role
    });
    await add.save();
    res.status(200).json("✅ Succesfull Added");
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already registered" });
    } else {
      console.log("Error in Adding the User " + error);
    }
  }
});

// Forget Password
router.post("/search", async (req, res) => {
  try {
    const { mail } = req.body;
    console.log(mail + " in the /search");

    const result = await loginModel.findOne({ mail });
    if (!result) {
      console.log("not found");
      res.status(201).json({ success: false, message: "Mail Id not Found" });
    } else {
      console.log("found");
      res
        .status(200)
        .json({
          success: true,
          message: "✅ Mail Id Found",
          mail: mail,
          id: result._id,
        });
    }
  } catch (e) {
    console.log("Error in the Find the Mail in the Forget Password is " + e);
  }
});

// Change Password
router.put("/pass", async (req, res) => {
  try {
    const { mail, password } = req.body;
    const hashPassword = await bcrypt.hash(password,10);
    await loginModel.findOneAndUpdate({ mail }, { password: hashPassword });

    console.log("✅ Password Changed Successfully");
    res
      .status(200)
      .json({ success: true, message: "✅ Password changed successfully" });
  } catch (error) {
    console.error("❌ Error in Change Password:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating password" });
  }
});

module.exports = router;
