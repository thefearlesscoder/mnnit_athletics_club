import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model('Highlight', highlightSchema);
