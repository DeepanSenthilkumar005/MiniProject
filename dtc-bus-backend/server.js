const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const busRoutes = require("./routes/busRoutes");
const crewRoutes = require("./routes/crewRoutes");
const routeRoutes = require("./routes/routes"); // ✅ Correct import

dotenv.config();
const app = express();

app.use(express.json()); // Allows JSON requests
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(`❌ MongoDB Connection Error: ${err.message}`));

// Define Routes
app.use("/api/crew", crewRoutes);
app.use("/api/routes", routeRoutes);  // ✅ Correct usage
app.use("/api/buses", busRoutes);     // ✅ Correct usage

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
