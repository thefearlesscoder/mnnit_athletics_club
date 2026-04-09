import mongoose from 'mongoose';

export const recordSchema = new mongoose.Schema({
  event: { type: String, required: true }, // e.g. "100m Sprint"
  year: { type: Number, required: true },
  athleteName: { type: String, required: true },
  recordValue: { type: String, required: true }, // e.g., "10.5s"
}, { timestamps: true });

export const Record = mongoose.model('Record', recordSchema);

export const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  displayUntil: { type: Date, required: true },
}, { timestamps: true });

export const Notice = mongoose.model('Notice', noticeSchema);
