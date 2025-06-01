// keepAlive.js
const redis = require('./redisClient');

async function keepAlive() {
  try {
    console.log("Sending keep-alive ping...");
    const pong = await redis.ping();
    console.log("Ping response:", pong);

    const setResult = await redis.set("keepalive", Date.now());
    console.log("Set keepalive key result:", setResult);
  } catch (err) {
    console.error("Error in keepAlive script:", err);
  } finally {
    redis.quit(); // Close connection after use
  }
}

keepAlive();
