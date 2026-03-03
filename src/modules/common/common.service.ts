import { CloudinaryService } from '@common/cloudinary';
import { UserRepository } from '@models/index';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudService: CloudinaryService,
  ) {}

  async uploadPhoto(user: any, photo: Express.Multer.File) {
    const userExist = await this.userRepository.findById(user._id);
    if (!userExist) {
      throw new NotFoundException(`${user.role} not found`);
    }

    const upload = await this.cloudService.uploadImage(
      photo,
      `ServEase/${userExist.role}/${userExist.email}/profile`,
      `profile_${userExist._id}`,
    );

    userExist.profileURL = upload.secure_url;
    await this.userRepository.updateById(userExist.id, userExist);
    return {
      message: 'Profile photo added successfully',
      profileURL: upload.secure_url,
    };
  }

  async uploadBackgroundPhoto(user: any, photo: Express.Multer.File) {
    const userExist = await this.userRepository.findById(user._id);
    if (!userExist) {
      throw new NotFoundException(`${user.role} not found`);
    }
    const upload = await this.cloudService.uploadImage(
      photo,
      `ServEase/${userExist.role}/${userExist.email}/background`,
      `background_${userExist._id}`,
    );
 
    userExist.backgroundURL = upload.secure_url;
    await this.userRepository.updateById(userExist.id, userExist);
    return {
      message: 'Background photo added successfully',
      backgroundURL: upload.secure_url,
    };
  }
}
