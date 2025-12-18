import multer from 'multer';
import path from 'path';

// Configure storage to use memory storage (files stored in buffer)
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    // Allowed file extensions
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedDocTypes = /pdf|doc|docx|txt/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    // Check if file is an image
    const isImage = allowedImageTypes.test(extname.slice(1)) &&
        mimetype.startsWith('image/');

    // Check if file is a document
    const isDocument = allowedDocTypes.test(extname.slice(1)) &&
        (mimetype.startsWith('application/') || mimetype === 'text/plain');

    if (isImage || isDocument) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP) and documents (PDF, DOC, DOCX, TXT) are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB file size limit
    }
});

export default upload;
