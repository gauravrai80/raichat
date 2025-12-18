import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Upload file to Cloudinary
 * POST /api/upload
 */
export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Determine file type (image or document)
        const isImage = req.file.mimetype.startsWith('image/');
        const resourceType = isImage ? 'image' : 'raw'; // 'raw' for non-image files

        // Convert buffer to stream for Cloudinary upload
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                folder: 'chat-app', // Organize files in a folder
                public_id: `${Date.now()}-${req.file.originalname.split('.')[0]}`,
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error uploading file to cloud storage',
                        error: error.message
                    });
                }

                // Return file information
                res.status(200).json({
                    success: true,
                    file: {
                        url: result.secure_url,
                        type: isImage ? 'image' : 'document',
                        filename: req.file.originalname,
                        size: req.file.size,
                        publicId: result.public_id
                    }
                });
            }
        );

        // Create readable stream from buffer and pipe to Cloudinary
        const bufferStream = Readable.from(req.file.buffer);
        bufferStream.pipe(uploadStream);

    } catch (error) {
        console.error('Upload file error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
};
