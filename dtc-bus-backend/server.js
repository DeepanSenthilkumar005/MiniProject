const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const busRoutes = require("./routes/busRoutes");
const crewRoutes = require("./routes/crewRoutes");

dotenv.config();
const app = express();

app.use(express.json()); // Allows JSON requests
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  app.use("/api/crew", crewRoutes);
  
  // Define Routes
app.use("/api/buses", busRoutes); // ✅ Make sure this line exists

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
