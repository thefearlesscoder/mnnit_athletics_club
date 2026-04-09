import mongoose from 'mongoose';

const loginRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  message: { type: String }, // optional message from the user
}, { timestamps: true });

export default mongoose.model('LoginRequest', loginRequestSchema);
