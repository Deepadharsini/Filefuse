const Redis = require('ioredis');
const express = require("express");
const router = express.Router();
const redis = new Redis({
  host: 'localhost', // Redis host
  port: 6379, // Redis port
});

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
      password: hashedPassword,
      email,
    };

    // Store file metadata in Redis with expiration using setex (ioredis method)
    await redis.setex(`file:${id}`, parseInt(expiresIn) * 60, JSON.stringify(metadata));

    res.json({ fileId: id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});

module.exports = router;
