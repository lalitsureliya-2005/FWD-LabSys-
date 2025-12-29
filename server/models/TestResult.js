import mongoose from 'mongoose';
const testResultSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  shortId: { type: String, unique: true }, // e.g., TR-12345
  value: String,
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pdfReportPath: String
}, { timestamps: true });
const TestResult = mongoose.model('TestResult', testResultSchema);
export default TestResult;
