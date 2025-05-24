require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cronJob = require('./cron'); // ✅ This imports and starts the job
const uploadRoutes = require("./routes/upload.js");
const downloadRoutes = require("./routes/download.js");

const app = express();

// ✅ Allow frontend domains
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://filefuse.vercel.app",
    "https://filefuse.deepadharsini.me"
  ],
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use("/api", uploadRoutes);
app.use("/api", downloadRoutes);

// ✅ Root route
app.get("/", (req, res) => res.send("Filefuse is running.."));

// ✅ Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

// ✅ Start the cron job
cronJob.start(); // <- This line actually starts your keep-alive job!
