import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary (if env vars are present)
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

// Ensure uploads directory exists for local storage
const uploadsDir = path.join(__dirname, '../../uploads');
if (process.env.STORAGE_PROVIDER !== 'cloudinary' && !fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. Local Disk Storage Configuration
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Cloudinary Storage Configuration
const cloudStorage = process.env.STORAGE_PROVIDER === 'cloudinary'
    ? new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req: any, file: any) => {
            return {
                folder: 'ticketing-system',
                public_id: path.parse(file.originalname).name + '-' + Date.now(),
                // resource_type: 'auto', // auto-detect image/video/raw
            };
        },
    })
    : null; // Fallback if not needed, though we use a switch below

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png|gif)|application\/(pdf|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/plain/.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only images (JPEG, PNG, GIF), PDF, DOCX, and TXT files are allowed'));
    }
};

// Select storage engine based on environment variable
const storageEngine = (process.env.STORAGE_PROVIDER === 'cloudinary' && cloudStorage)
    ? cloudStorage
    : diskStorage;

// Create multer upload instance
export const upload = multer({
    storage: storageEngine,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter,
});

// Helper to delete file (Handles both local and we can add Cloudinary delete later if needed)
export const deleteFile = (filename: string): void => {
    if (process.env.STORAGE_PROVIDER === 'cloudinary') {
        // Determine if filename is a URL or public_id logic. 
        // For now, Cloudinary deletion is usually separate or handled via Admin API.
        // This simple helper was for fs.unlink. We'll leave it as no-op for Cloudinary
        // or specific logic if the 'filename' stored was a local path.
        return;
    }

    // Local deletion
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
