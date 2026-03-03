import { CloudinaryService } from '@common/cloudinary';
import { UserRepository } from '@models/index';
export declare class CommonService {
    private readonly userRepository;
    private readonly cloudService;
    constructor(userRepository: UserRepository, cloudService: CloudinaryService);
    uploadPhoto(user: any, photo: Express.Multer.File): Promise<{
        message: string;
        profileURL: string;
    }>;
    uploadBackgroundPhoto(user: any, photo: Express.Multer.File): Promise<{
        message: string;
        backgroundURL: string;
    }>;
}
