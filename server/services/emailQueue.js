const redis = require('../config/redis');
const sendTestReportEmail = require('./emailService');

// Background worker to process email queue
async function processEmailQueue() {
  while (true) {
    const data = await redis.rpop('emailQueue');
    if (!data) {
      await new Promise(res => setTimeout(res, 5000)); // Wait before next poll
      continue;
    }
    try {
      const job = JSON.parse(data);
      await sendTestReportEmail(job);
    } catch (err) {
      // Optionally log or push back to queue for retry
    }
  }
}

if (require.main === module) {
  processEmailQueue();
}

module.exports = processEmailQueue;
