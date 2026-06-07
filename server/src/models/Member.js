import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String },
  batch: { type: String }, // e.g., "2024"
  events: [{ type: String }],
  achievements: [{ type: String }],
  linkedIn: { type: String },
  instagram: { type: String },
  dateOfBirth: { type: Date },
  profilePhoto: { type: String }, // URL from Cloudinary
  isCaptain: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

export default mongoose.model('Member', userSchema);
