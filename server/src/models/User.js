import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member', 'alumni'], default: 'member' },
  branch: { type: String },
  batch: { type: String }, // e.g., "2024"
  events: [{ type: String }],
  achievements: [{ type: String }],
  linkedIn: { type: String },
  instagram: { type: String },
  birthday: { type: Date },
  profilePhoto: { type: String }, // URL from Cloudinary
  isCaptain: { type: Boolean, default: false },
  
  // For password reset/initial access via 2hr link
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
