import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import UploadImage from '../models/UploadImage.js';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer storage to memory buffers
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper promise to upload a memory buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folderName, originalName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: 'image',
        public_id: originalName.split('.')[0] + '_' + Date.now() // Ensure unique ID
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Controller to upload multiple images to Cloudinary and record in MongoDB
 */
export const uploadImages = async (req, res) => {
  try {
    const { event, year } = req.body;

    if (!event || !year) {
      return res.status(400).json({ message: 'Event and year are required.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please select or drag at least one image file to upload.' });
    }

    // Dynamic folder name created in Cloudinary: event_year (e.g. AAM_2026, Inter_NIT_2026)
    const sanitizedEventName = event.trim().replace(/\s+/g, '_');
    const folderName = `${sanitizedEventName}_${year}`;

    const uploadPromises = req.files.map(async (file) => {
      // 1. Upload the memory file buffer to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(file.buffer, folderName, file.originalname);

      // 2. Save image details (URL & public_id) in MongoDB under the UploadImage collection
      const newImage = new UploadImage({
        year,
        event,
        image: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id
      });

      return await newImage.save();
    });

    const savedImages = await Promise.all(uploadPromises);

    res.status(201).json({
      message: 'Images uploaded successfully!',
      images: savedImages
    });
  } catch (error) {
    console.error('Image Upload Controller Error:', error);
    res.status(500).json({ message: error.message || 'Server error occurred during image upload.' });
  }
};
