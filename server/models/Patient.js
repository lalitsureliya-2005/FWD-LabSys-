import mongoose from 'mongoose';
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  email: { type: String, required: true },
  phone: String
}, { timestamps: true });
const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
