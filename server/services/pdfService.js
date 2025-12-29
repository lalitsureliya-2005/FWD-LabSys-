import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Generates a PDF report for a test result
async function generateTestReport({ patient, test, result, doctor }) {
  const doc = new PDFDocument();
  const fileName = `report_${patient._id}_${Date.now()}.pdf`;
  const dirPath = path.join(path.resolve(), 'tmp');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, fileName);
  doc.pipe(fs.createWriteStream(filePath));

  // Header Section
  doc.rect(0, 0, 612, 100).fill('#1e40af'); // Blue header
  doc.font('Helvetica-Bold').fontSize(24).fill('white').text('MEDILAB', 50, 40);
  doc.fontSize(10).text('Advanced Laboratory Services', 50, 65);
  doc.text('123 Health Street, Medical City', 400, 40, { align: 'right' });
  doc.text('Contact: (555) 123-4567 | info@medilab.com', 400, 55, { align: 'right' });

  doc.moveDown(4);

  // Report Title
  doc.fill('black').fontSize(20).font('Helvetica-Bold').text('LABORATORY TEST REPORT', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica').text(`Report ID: ${result.shortId || result._id}`, { align: 'center' });
  doc.moveDown(2);

  const startY = doc.y;

  // Patient Info Box (Left)
  doc.rect(50, startY, 250, 100).strokeColor('#e5e7eb').stroke();
  doc.font('Helvetica-Bold').fontSize(12).text('PATIENT DETAILS', 60, startY + 10);
  doc.rect(50, startY + 28, 250, 1).fill('#e5e7eb');

  doc.font('Helvetica').fontSize(10).fill('#374151');
  doc.text(`Name:`, 60, startY + 40); doc.font('Helvetica-Bold').text(patient.name, 120, startY + 40);
  doc.font('Helvetica').text(`Age/Gender:`, 60, startY + 55); doc.font('Helvetica-Bold').text(`${patient.age} / ${patient.gender}`, 120, startY + 55);
  doc.font('Helvetica').text(`Email:`, 60, startY + 70); doc.text(patient.email, 120, startY + 70);
  doc.font('Helvetica').text(`Phone:`, 60, startY + 85); doc.text(patient.phone, 120, startY + 85);

  // Sample Info Box (Right)
  doc.rect(310, startY, 250, 100).strokeColor('#e5e7eb').stroke();
  doc.font('Helvetica-Bold').fontSize(12).fill('black').text('SAMPLE DETAILS', 320, startY + 10);
  doc.rect(310, startY + 28, 250, 1).fill('#e5e7eb');

  doc.font('Helvetica').fontSize(10).fill('#374151');
  doc.text(`Test Type:`, 320, startY + 40); doc.font('Helvetica-Bold').text(test.name, 390, startY + 40);
  doc.font('Helvetica').text(`Date:`, 320, startY + 55); doc.text(new Date().toLocaleDateString(), 390, startY + 55);
  doc.font('Helvetica').text(`Ref. Doc:`, 320, startY + 70); doc.text(doctor ? doctor.name : 'Self', 390, startY + 70);

  doc.moveDown(6);


  // Results Table Header
  const tableTop = doc.y + 20;
  doc.rect(50, tableTop, 510, 30).fill('#f3f4f6');
  doc.fill('black').font('Helvetica-Bold').fontSize(11);
  doc.text('TEST NAME', 60, tableTop + 10);
  doc.text('RESULT', 250, tableTop + 10);
  doc.text('REFERENCE RANGE', 400, tableTop + 10);

  // Results Body
  const rowTop = tableTop + 30;
  doc.moveDown();
  doc.rect(50, rowTop, 510, 0.5).fill('#e5e7eb');

  doc.font('Helvetica').fontSize(11).fill('black');

  // Parse Result Value if JSON
  let displayValue = result.value;
  try {
    const parsed = JSON.parse(result.value);
    let offset = 15;
    Object.entries(parsed).forEach(([key, val]) => {
      doc.font('Helvetica').text(key, 60, rowTop + offset);
      doc.font('Helvetica-Bold').text(String(val), 250, rowTop + offset);
      doc.font('Helvetica').text(test.normalRange || 'N/A', 400, rowTop + offset);
      offset += 25;
    });
    // Try to draw status below last item
    doc.font('Helvetica-Bold').fill(result.status === 'Completed' ? '#16a34a' : '#ea580c')
      .text(`Status: ${result.status}`, 60, rowTop + offset + 10);

  } catch (e) {
    // Not JSON, simple value
    doc.text(test.name, 60, rowTop + 15);
    doc.font('Helvetica-Bold').text(result.value, 250, rowTop + 15);
    doc.font('Helvetica').text(test.normalRange, 400, rowTop + 15);

    doc.font('Helvetica-Bold').fill(result.status === 'Completed' ? '#16a34a' : '#ea580c')
      .text(result.status, 60, rowTop + 40);
  }

  // Footer / Disclaimer
  const pageHeight = 792;
  doc.fontSize(8).fill('#6b7280');
  doc.text('Disclaimer: This is an electronically generated report. No signature required.', 50, pageHeight - 50, { align: 'center' });
  doc.text('Medilab Systems © 2025', 50, pageHeight - 35, { align: 'center' });

  doc.end();
  return filePath;
}

export default generateTestReport;
