import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import sendTestReportEmail from './server/services/emailService.js';
import mongoose from 'mongoose';

// Mock Mongoose models to prevent errors if emailService imports them
// (Actually emailService imports EmailLog, so we need to connect to DB or mock it??
// emailService imports '../models/EmailLog.js'. If we run this script from root, 
// that import might fail if it expects a database connection for EmailLog.create.
// Let's quickly connect to DB to be safe, or wrap the call.)

console.log("--- STARTING EMAIL DIAGNOSTIC SCRIPT ---");
console.log("1. Checking Environment Variables...");
console.log("SMTP_HOST:", process.env.SMTP_HOST || "(Missing)");
console.log("SMTP_USER:", process.env.SMTP_USER || "(Missing)");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "(Present)" : "(Missing)");

async function run() {
    // 1. Create a Dummy PDF
    console.log("\n2. Generating Dummy PDF...");
    const doc = new PDFDocument();
    const pdfPath = path.join(process.cwd(), 'test_diagnostic.pdf');
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);
    doc.text("This is a diagnostic test PDF.");
    doc.end();

    await new Promise((resolve) => stream.on('finish', resolve));
    console.log(`PDF created at: ${pdfPath}`);

    // 2. Connect DB (needed for EmailLog logging in the service)
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI missing");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected (for logging).");
    } catch (e) {
        console.warn("DB Connection failed. EmailService might crash if it tries to save logs:", e.message);
    }

    // 3. Send Email
    console.log("\n3. Attempting to Send Email...");
    const testRecipient = process.env.SMTP_USER; // Send to self
    if (!testRecipient) {
        console.error("Cannot test: SMTP_USER is missing.");
        return;
    }

    try {
        console.log(`Sending to: ${testRecipient}`);
        const result = await sendTestReportEmail({
            to: testRecipient,
            subject: "Diagnostic Test Email",
            html: "<p>This is a test email from the diagnostic script.</p>",
            pdfPath: pdfPath
        });
        console.log("\nSUCCESS! Email successfully sent.");
        console.log("Response:", result);
    } catch (error) {
        console.error("\nFAILURE: Email failed to send.");
        console.error("Error Details:", error);
    } finally {
        try {
            fs.unlinkSync(pdfPath); // Cleanup
            console.log("\nCleaned up test PDF.");
        } catch (e) { }
        process.exit(0);
    }
}

run();
