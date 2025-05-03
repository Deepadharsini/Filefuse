const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis(process.env.REDIS_HOST, {
  tls: {}, // TLS configuration for Upstash
});

console.log("Connecting to Redis with the following URL:", process.env.REDIS_HOST);

redis.on('connect', () => {
  console.log("Successfully connected to Redis");
});

redis.on('error', (err) => {
  console.error("Redis connection error:", err);
});

redis.on('close', () => {
  console.log("Redis connection closed");
});

redis.on('reconnecting', (delay) => {
  console.log(`Reconnecting to Redis after ${delay} ms`);
});

redis.on('ready', () => {
  console.log("Redis is ready to use");
});

module.exports = redis;
