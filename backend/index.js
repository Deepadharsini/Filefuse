require("dotenv").config();
const express = require("express");
const cors = require("cors");
const job = require('./cron');
const uploadRoutes = require("./routes/upload.js");
const downloadRoutes = require("./routes/download.js");

const app = express();
app.use(cors({origin: ["http://localhost:5173", "https://filefuse.vercel.app","https://filefuse.deepadharsini.me"],
  credentials: true
}));
app.use(express.json());
app.use("/api", uploadRoutes);
app.use("/api", downloadRoutes);

app.get("/", (req, res) => res.send("Filefuse is running.."));

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
