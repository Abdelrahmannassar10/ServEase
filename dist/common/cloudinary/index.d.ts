import { ConfigService } from '@nestjs/config';
import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    private readonly configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File, folder: string, name: string): Promise<UploadApiResponse>;
    uploadPdf(file: Express.Multer.File, folder: string, name?: string): Promise<{
        secure_url: string;
    }>;
    deleteImage(publicId: string): Promise<{
        result: string;
    }>;
    deletePdf(publicId: string): Promise<{
        result: string;
    }>;
}
