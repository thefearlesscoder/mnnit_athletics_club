import mongoose from "mongoose";

export const UploadImageSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    image: { type: String, required: true },
    publicId: { type: String, required: true }
}, { timestamps: true });

const UploadImage = mongoose.model('UploadImage', UploadImageSchema);
export default UploadImage;