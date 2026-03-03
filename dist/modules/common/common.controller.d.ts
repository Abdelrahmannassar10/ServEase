import { CommonService } from './common.service';
export declare class CommonController {
    private readonly commonService;
    constructor(commonService: CommonService);
    uploadPhoto(req: any, photo?: Express.Multer.File): Promise<{
        message: string;
        profileURL: string;
    }>;
    uploadBackGroundPhoto(req: any, photo?: Express.Multer.File): Promise<{
        message: string;
        backgroundURL: string;
    }>;
}
