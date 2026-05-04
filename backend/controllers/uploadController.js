import { v2 as cloudinary } from 'cloudinary';
import { successResponse, errorResponse } from '../utils/responses.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'No file uploaded');
    }

    // File was already uploaded to Cloudinary by multer middleware
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    return successResponse(
      res,
      200,
      {
        imageUrl,
        publicId,
      },
      'Image uploaded successfully'
    );
  } catch (error) {
    console.error('Upload Error:', error);
    return errorResponse(res, 500, 'Error uploading image');
  }
};
