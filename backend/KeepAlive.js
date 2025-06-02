// keepAlive.js
const redis = require('./redisClient');

async function keepAlive() {
  try {
    console.log("Sending Redis keep-alive ping...");
    const pong = await redis.ping();
    console.log("Ping response:", pong);

    const setResult = await redis.set("keepalive", Date.now());
    console.log("Set keepalive key result:", setResult);
  } catch (err) {
    console.error("Error in Redis keepAlive:", err);
  } finally {
    redis.quit(); // Close Redis connection
  }
}

module.exports = keepAlive;
