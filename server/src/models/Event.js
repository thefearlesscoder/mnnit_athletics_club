import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Annual Athletic Meet 2024"
  year: { type: Number, required: true },
  isAAM: { type: Boolean, default: false },
  
  // AAM Specific details
  date: { type: String },
  chiefGuest: { type: String },
  participationCount: { type: Number }, 
  bestAthleteMale: { type: String },
  bestAthleteFemale: { type: String },
  sponsors: [{ name: String, logoUrl: String }],
  
  // Gallery images related to the event
  images: [{ 
    url: { type: String, required: true }, // Cloudinary URL
    caption: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
