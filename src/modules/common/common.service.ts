import { CloudinaryService } from '@common/cloudinary';
import { Role, ServiceStatus } from '@common/types/enum';
import {
  ReviewRepository,
  ServiceRequestRepository,
  UserRepository,
} from '@models/index';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudService: CloudinaryService,
    private readonly serviceRequestRepository: ServiceRequestRepository,
    private readonly reviewRepository: ReviewRepository,
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

  async getGeneralCounts() {
    const providerCount = await this.userRepository.count({ role: Role.PROVIDER });
    const requesterCount = await this.serviceRequestRepository.count({
      status: ServiceStatus.COMPLETED,
    });
    const averageRateResult = await this.reviewRepository.aggregate([
      {
        $group: {
          _id: null,
          averageRate: { $avg: '$rate' },
        },
      },
    ]);

    const userSatisfaction =
      averageRateResult.length > 0
        ? Number(averageRateResult[0].averageRate.toFixed(1))
        : 0;
    return {
      providerCount,
      requesterCount,
      userSatisfaction,
    };
  }

  async getUsersGrowth() {
    const months = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const growth = await this.userRepository.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          users: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    return growth.map((item) => ({
      label: `${months[item._id.month]} ${item._id.year}`,
      users: item.users,
    }));
  }

  async getRequestsStatusStatistics() {
  const statistics = await this.serviceRequestRepository.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const defaultStatuses = {
    WAITING: 0,
    PENDING: 0,
    CONFIRMED: 0,
    REFUSED: 0,
    COMPLETED: 0,
    IN_PROGRESS: 0,
    OUTDATED: 0,
  };

  statistics.forEach((item) => {
    defaultStatuses[item._id] = item.count;
  });

  return Object.entries(defaultStatuses).map(([status, count]) => ({
    status,
    count,
  }));
}

}
