import nodemailer from 'nodemailer';
import EmailLog from '../models/EmailLog.js';
import redis from '../config/redis.js';

// Lazy initialization to ensure env vars are loaded
let transporter = null;

const createTransporter = () => {
  console.log('DEBUG: Initializing Email Transporter');
  console.log('DEBUG: SMTP_HOST:', process.env.SMTP_HOST);
  console.log('DEBUG: SMTP_USER:', process.env.SMTP_USER);

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn('WARNING: SMTP credentials missing in env during transporter creation.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465, // Force number
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

async function sendTestReportEmail({ to, subject, html, pdfPath }) {
  // Check for credentials first to avoid timeout
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('--- EMAIL MOCK ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('PDF:', pdfPath);
    console.log('------------------');
    await EmailLog.create({ to, subject, status: 'Sent', timestamp: new Date(), error: 'Mock Mode (No Credentials)' });
    return { messageId: 'mock-id' };
  }

  try {
    if (!transporter) {
      transporter = createTransporter();
    }

    if (!transporter) {
      throw new Error("Transporter could not be initialized (missing config)");
    }

    console.log(`DEBUG: Attempting to send email to ${to}...`);
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'lab@example.com',
      to,
      subject,
      html,
      attachments: [
        {
          filename: 'TestReport.pdf',
          path: pdfPath,
        },
      ],
    });
    console.log('DEBUG: Email sent successfully:', info.messageId);
    await EmailLog.create({ to, subject, status: 'Sent', timestamp: new Date() });
    return info;
  } catch (err) {
    console.error('Email send failed:', err);
    await EmailLog.create({ to, subject, status: 'Failed', error: err.message, timestamp: new Date() });
    // Push to Redis queue for retry
    if (redis.status === 'ready') {
      await redis.lpush('emailQueue', JSON.stringify({ to, subject, html, pdfPath }));
    }
    throw err;
  }
}

export default sendTestReportEmail;
