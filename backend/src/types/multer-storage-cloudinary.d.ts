declare module 'multer-storage-cloudinary' {
    import { StorageEngine } from 'multer';
    import { v2 as cloudinary } from 'cloudinary';

    interface Options {
        cloudinary: typeof cloudinary;
        params?: any; // Allow loose typing for params to avoid conflicts
    }

    export class CloudinaryStorage implements StorageEngine {
        constructor(options: Options);
        _handleFile(req: any, file: any, cb: (error?: any, info?: any) => void): void;
        _removeFile(req: any, file: any, cb: (error: Error) => void): void;
    }
}
