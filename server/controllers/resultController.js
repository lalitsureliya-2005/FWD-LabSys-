import TestResult from '../models/TestResult.js';
import Patient from '../models/Patient.js';
import Test from '../models/Test.js';
import generateTestReport from '../services/pdfService.js';
import sendTestReportEmail from '../services/emailService.js';

import User from '../models/User.js';

export const addResult = async (req, res) => {
  try {
    const { patient, test, value, status, doctor: providedDoctor } = req.body;
    let doctor = providedDoctor;
    if (!doctor && req.user) {
      doctor = req.user._id;
    }
    let pdfReportPath = undefined;

    // Check for existing result for this patient + test today to prevent duplicates
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find matching record
    let existingResult = await TestResult.findOne({
      patient,
      test,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    let result;
    if (existingResult) {
      console.log(`Duplicate found: Updating existing result ${existingResult._id}`);
      // Update existing record with new values
      existingResult.value = value;
      existingResult.status = status;
      if (doctor) existingResult.doctor = doctor;
      result = await existingResult.save();
    } else {
      // Create new record
      // Generate shortId
      const shortId = `TR-${Date.now().toString().slice(-6)}`;
      result = await TestResult.create({ patient, test, value, status, doctor, shortId });
    }

    // If status is Completed, generate PDF and send email (logic same as before)
    // We re-generate report even on update if status is 'Completed' to capture new values
    if (status === 'Completed') {
      // Fetch full patient, test, doctor, recommendations
      const patientObj = await Patient.findById(patient);
      const testObj = await Test.findById(test);
      const doctorObj = doctor ? await User.findById(doctor) : null;
      pdfReportPath = await generateTestReport({ patient: patientObj, test: testObj, result, doctor: doctorObj });
      result.pdfReportPath = pdfReportPath;
      await result.save();

      // Send email
      const html = `<p>Dear ${patientObj.name},</p><p>Your test report for <b>${testObj.name}</b> is attached.</p>`;
      await sendTestReportEmail({
        to: patientObj.email,
        subject: `Lab Test Report: ${testObj.name}`,
        html,
        pdfPath: pdfReportPath
      });
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("AddResult error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getResults = async (req, res) => {
  try {
    // Show all records to everyone (Shared Dashboard)
    const results = await TestResult.find().populate('patient test doctor');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    let result = await TestResult.findByIdAndUpdate(id, update, { new: true });
    if (!result) return res.status(404).json({ message: 'Result not found' });

    // If status changed to Completed and no PDF yet, generate PDF and send email
    if (update.status === 'Completed') {
      const patientObj = await Patient.findById(result.patient);
      const testObj = await Test.findById(result.test);
      const doctorObj = result.doctor ? await User.findById(result.doctor) : null;
      const pdfReportPath = await generateTestReport({ patient: patientObj, test: testObj, result, doctor: doctorObj });
      result.pdfReportPath = pdfReportPath;
      await result.save();

      // Send email
      const html = `<p>Dear ${patientObj.name},</p><p>Your test report for <b>${testObj.name}</b> is attached.</p>`;
      await sendTestReportEmail({
        to: patientObj.email,
        subject: `Lab Test Report: ${testObj.name}`,
        html,
        pdfPath: pdfReportPath
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
