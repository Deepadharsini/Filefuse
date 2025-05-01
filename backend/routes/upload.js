const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Redis = require('ioredis');
const { uploadFile } = require("../utils/s3"); // Ensure this is the correct import

const router = express.Router();

// Redis setup
const redis = new Redis({
  host: 'localhost', // Redis host
  port: 6379, // Redis port
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route for file upload
router.post("/upload", upload.single("file"), async (req, res) => {
  const { expiresIn, password, email } = req.body;
  const file = req.file;
  const id = uuidv4(); // Unique file ID

  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    console.log("upload called");
    // Upload file to S3
    const s3Response = await uploadFile(file.buffer, file.originalname, file.mimetype);

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Prepare metadata
    const metadata = {
      key: s3Response.Key,
      filename: file.originalname,
      expiresIn:expiresIn,
      password: hashedPassword,
      email,
    };

    // Store file metadata in Redis with expiration using setex (ioredis method)
    // Store file metadata in Redis with expiration
await redis.setex(`file:${id}`, parseInt(expiresIn), JSON.stringify({ ...metadata, expiresIn }));

    res.json({ fileId: id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});

module.exports = router;
