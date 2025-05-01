const express = require("express");
const router = express.Router();
const redis = require("../redisClient");
const { generateDownloadURL } = require("../utils/s3");
const bcrypt = require("bcryptjs");

router.get("/download/:id", async (req, res) => {
  const fileId = req.params.id;
  const userPassword = req.query.password || ""; // Password from query string
  try {
    // Get metadata from Redis
    const data = await redis.get(`file:${fileId}`);
    if (!data) return res.status(410).send("Link expired or file not found");

    const { key, filename, password, email, expiresIn } = JSON.parse(data);

    // Check password if applicable
    if (password && !(await bcrypt.compare(userPassword, password))) {
      return res.status(403).send("Incorrect password");
    }

    // Convert expiration to seconds
    const expirationTime = parseInt(expiresIn) * 60;

    // Generate a signed URL with dynamic expiration time
    const url = await generateDownloadURL(key, expirationTime);

    res.json({ downloadURL: url, filename });
  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
});

module.exports = router;
