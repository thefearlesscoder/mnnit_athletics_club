import mongoose from 'mongoose';

const approvedEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('ApprovedEmail', approvedEmailSchema);
