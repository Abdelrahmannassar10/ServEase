import { ConflictException, Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import {
  AdminRepository,
  ProviderRepository,
  UserRepository,
} from '@models/index';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ProviderStatus, Role } from '@common/types/enum';
import { profile } from 'console';
import { RejectProviderDto } from './dto/Reject-provider-dto';
import { sendMail } from '@common/helper';
import { ConfigService } from '@nestjs/config';
import { GetUsersQueryDto } from './dto/get-users-query-dto';
import { PipelineStage } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}
  async createAdmin(admin: Admin) {
    const existingAdmin = await this.adminRepository.findOne({
      email: admin.email,
    });

    if (existingAdmin) {
      throw new ConflictException('Admin already exists');
    }
    admin.password = await bcrypt.hash(admin.password, 10);
    try {
      await this.adminRepository.create(admin);
      return { message: 'Admin created successfully' };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Admin email already exists');
      }
      throw error;
    }
  }

  async login(user: any) {
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async getPendingProviders() {
    const pendingProviders = await this.providerRepository.find({
      adminApproved: ProviderStatus.PendingApproval,
    });

    return pendingProviders.map((p) => ({
      id: p._id,
      userName: p.userName,
      specialization: p.specialization,
      service: p.service,
      nationalNumber: p.nationalNumber,
      writtenCv: p.writtenCv,
      state: p.state,
      city: p.city,
      email: p.email,
      mobileNumber: p.mobileNumber,
      age: p.age,
      profileURL: p.profileURL,
      backgroundURL: p.backgroundURL,
      cvUrl: p.cvUrl,
    }));
  }

  async approveProvider(providerId: string) {
    const provider = await this.providerRepository.findOne({ _id: providerId });
    if (!provider) {
      return { message: 'Provider not found' };
    }
    provider.adminApproved = ProviderStatus.Active;
    await this.providerRepository.updateById(providerId, provider);
    return { message: 'Provider approved successfully' };
  }

  async rejectProvider(rejectProviderDto: RejectProviderDto) {
    const provider = await this.providerRepository.findOne({
      _id: rejectProviderDto.providerId,
    });
    if (!provider) {
      return { message: 'Provider not found' };
    }
    if (provider.adminApproved == ProviderStatus.PendingApproval) {
      provider.adminApproved = ProviderStatus.Rejected;
      const templates = this.configService.get('EMAIL_TEMPLATES');
      sendMail({
        to: provider.email,
        subject: templates.rejectEmail.subject,
        html: templates.rejectEmail.body(`${rejectProviderDto.cause}`),
      });
      await this.providerRepository.updateById(
        rejectProviderDto.providerId,
        provider,
      );
      return { message: 'Provider rejected successfully' };
    } else {
      return {
        message:
          'Provider cannot be rejected as it is not in pending approval status',
      };
    }
  }

  async getAllCustomers(query: GetUsersQueryDto) {
    const result = await this.getUsersByRole(query, Role.CUSTOMER, 'customers');

    return {
      customers: result.users,
      totalCustomers: result.totalUsers,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      limit: result.limit,
    };
  }

  async getAllProviders(query: GetUsersQueryDto) {
    const result = await this.getUsersByRole(query, Role.PROVIDER, 'providers');

    return {
      providers: result.users,
      totalProviders: result.totalUsers,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      limit: result.limit,
    };
  }

  private async getUsersByRole(
    query: GetUsersQueryDto,
    role: Role.CUSTOMER | Role.PROVIDER,
    facetKey: 'customers' | 'providers',
  ) {
    const { state, city, category, search, page = 1, limit = 10 } = query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Math.min(Number(limit) || 10, 50);

    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const pipeline: PipelineStage[] = [];

    // Base filter
    const matchStage: Record<string, unknown> = {
      role,
    };

    if (state) matchStage.state = state;
    if (city) matchStage.city = city;
    if (role === Role.PROVIDER && category) matchStage.service = category;

    pipeline.push({ $match: matchStage });

    // fullName must be added before the search $match that uses it
    pipeline.push({
      $addFields: {
        fullName: { $concat: ['$firstName', ' ', '$lastName'] },
      },
    });

    // Search filter
    if (search) {
      const safeSearch = escapeRegex(search);
      pipeline.push({
        $match: {
          $or: [
            { firstName: { $regex: safeSearch, $options: 'i' } },
            { lastName: { $regex: safeSearch, $options: 'i' } },
            { fullName: { $regex: safeSearch, $options: 'i' } },
            { email: { $regex: safeSearch, $options: 'i' } },
            { mobileNumber: { $regex: safeSearch, $options: 'i' } },
          ],
        },
      });
    }

    // Single aggregation: count + paginated data in one round-trip
    pipeline.push({
      $facet: {
        metadata: [{ $count: 'total' }],
        [facetKey]: [
          { $sort: { createdAt: -1 } },
          { $skip: (pageNumber - 1) * limitNumber },
          { $limit: limitNumber },
          {
            $project: {
              password: 0,
              refreshToken: 0,
              __v: 0,
            },
          },
        ],
      },
    });

    const [result] = await this.userRepository.aggregate(pipeline);

    const totalUsers: number = result.metadata[0]?.total ?? 0;
    const users = result[facetKey];

    return {
      users,
      totalUsers,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalUsers / limitNumber),
      limit: limitNumber,
    };
  }

  async getAllAdmins() {
    const admins = await this.adminRepository.find({});
    return admins;
  }

  async deleteUser(userId: string) {
    await this.userRepository.deleteById(userId);

    return { message: 'User deleted successfully' };
  }
}
