const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Stop = require("./models/Stop");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const stops = [
  { name: "Stop A", latitude: 28.6139, longitude: 77.2090 },
  { name: "Stop B", latitude: 28.6353, longitude: 77.2250 },
  { name: "Stop C", latitude: 28.6448, longitude: 77.2130 },
  { name: "Stop D", latitude: 28.6500, longitude: 77.2300 }
];

const seedStops = async () => {
  await Stop.deleteMany();
  await Stop.insertMany(stops);
  console.log("✅ Stops Inserted");
  mongoose.connection.close();
};

seedStops();
