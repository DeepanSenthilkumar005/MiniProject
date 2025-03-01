const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Schedule = require("./models/Schedule");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const schedules = [
  { route: "A1", busNumber: "TN 01 AB 1234", crew: "John Doe, Mike Smith", time: "08:00 AM" },
  { route: "B2", busNumber: "TN 02 XY 5678", crew: "Alice Brown, Robert Green", time: "09:15 AM" },
  { route: "C3", busNumber: "TN 03 MN 9012", crew: "Emily White, James Black", time: "10:30 AM" },
  { route: "D4", busNumber: "TN 04 GH 3456", crew: "Sophia Davis, Daniel Lee", time: "12:00 PM" }
];

const seedDB = async () => {
  await Schedule.deleteMany(); // Clear existing data
  await Schedule.insertMany(schedules);
  console.log("✅ Sample Schedules Inserted");
  mongoose.connection.close();
};

// seedDB();
