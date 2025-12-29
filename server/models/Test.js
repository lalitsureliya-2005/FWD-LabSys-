import mongoose from 'mongoose';
const testSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  normalRange: String,
  cost: Number
}, { timestamps: true });
const Test = mongoose.model('Test', testSchema);
export default Test;
