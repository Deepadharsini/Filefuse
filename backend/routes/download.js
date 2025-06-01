const express = require("express");
const redis = require("../redisClient");
const { generateDownloadURL } = require("../utils/s3");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.get("/download/:id", async (req, res) => {
  const fileId = req.params.id;
  const userPassword = req.query.password || ""; // Password from query string

  console.log(`[DOWNLOAD] Request received for fileId: ${fileId}`);
  console.log(`[DOWNLOAD] Password provided: ${userPassword ? 'Yes' : 'No'}`);

  try {
    // Fetch file metadata from Redis
    const data = await redis.get(`file:${fileId}`);
    if (!data) {
      console.warn(`[DOWNLOAD] File metadata not found or expired for fileId: ${fileId}`);
      return res.status(410).send("Link expired or file not found");
    }

    const metadata = JSON.parse(data);
    const { key, filename, password, email, expiresIn } = metadata;

    // console.log(`[DOWNLOAD] Metadata found:`);
    // console.log(`  - S3 Key: ${key}`);
    // console.log(`  - Filename: ${filename}`);
    // console.log(`  - Password Protected: ${!!password}`);
    // console.log(`  - Email: ${email}`);
    // console.log(`  - Expiration: ${expiresIn} minutes`);

    // Password verification if applicable
    if (password) {
      console.log(`[DOWNLOAD] Verifying password...`);
      const passwordMatch = await bcrypt.compare(userPassword, password);
      if (!passwordMatch) {
        console.warn(`[DOWNLOAD] Incorrect password provided for fileId: ${fileId}`);
        return res.status(403).send("Incorrect password");
      } else {
        console.log(`[DOWNLOAD] Password verified successfully.`);
      }
    } else {
      console.log(`[DOWNLOAD] No password required.`);
    }

    // Convert expiration to seconds for signed URL
    const expirationTime = parseInt(expiresIn) * 60;
    console.log(`[DOWNLOAD] Generating signed URL with expiration ${expirationTime}s...`);

    const url = await generateDownloadURL(key, expirationTime);

    console.log(`[DOWNLOAD] Signed URL generated: ${url}`);

    // Respond with URL and filename
    res.json({ downloadURL: url, filename });
  } catch (err) {
    console.error(`[DOWNLOAD] Unexpected error for fileId: ${fileId}`, err);
    res.status(500).send("Download failed");
  }
});

module.exports = router;
