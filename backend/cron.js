// cron.js
const { CronJob } = require('cron');
const https = require('https');
const keepAlive = require('./KeepAlive');
require('dotenv').config();

const backendUrl = process.env.BACKEND_URL;

// Cron Job 1: Ping Render server every 14 minutes
const renderPingJob = new CronJob(
  '*/14 * * * *',
  function () {
    console.log(`[Cron] Pinging backend to keep server active`);

    https.get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log('[Cron] Render backend is active');
      } else {
        console.error(`[Cron] Backend ping failed: ${res.statusCode}`);
      }
    }).on('error', (err) => {
      console.error('[Cron] Backend ping error:', err.message);
    });
  },
  null,
  true,
  'America/Los_Angeles'
);

// Cron Job 2: Ping Redis every 10 minutes
const redisKeepAliveJob = new CronJob(
  '*/10 * * * *',
  async function () {
    console.log(`[Cron] Running Redis keep-alive`);
    await keepAlive(); // Call the exported function
  },
  null,
  true,
  'America/Los_Angeles'
);

// Start both jobs
function start() {
  renderPingJob.start();
  redisKeepAliveJob.start();
}

module.exports = { start };
