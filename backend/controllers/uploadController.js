import { v2 as cloudinary } from 'cloudinary';
import { successResponse, errorResponse } from '../utils/responses.js';

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, 400, 'No file uploaded');
        }

        // File was already uploaded to Cloudinary by multer middleware
        const imageUrl = req.file.path || req.file.secure_url || req.file.url;
        const publicId = req.file.filename || req.file.public_id || req.file.publicId;

        if (!imageUrl || !publicId) {
            return errorResponse(res, 500, 'Upload succeeded but image metadata is missing');
        }

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
