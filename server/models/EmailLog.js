import mongoose from 'mongoose';
const emailLogSchema = new mongoose.Schema({
  to: String,
  subject: String,
  status: { type: String, enum: ['Sent', 'Failed', 'Queued'] },
  timestamp: { type: Date, default: Date.now },
  error: String
});
export default mongoose.model('EmailLog', emailLogSchema);
