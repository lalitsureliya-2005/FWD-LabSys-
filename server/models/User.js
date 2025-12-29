import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true }, // Optional email
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Doctor', 'LabStaff', 'user'], default: 'LabStaff', required: true },
  name: { type: String, required: true }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;
