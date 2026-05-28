import { ConflictException, Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import {
  AdminRepository,
  ProviderRepository,
  ServiceRequestRepository,
  TokenRepository,
  UserRepository,
} from '@models/index';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ProviderStatus, Role } from '@common/types/enum';
import { RejectProviderDto } from './dto/Reject-provider-dto';
import { safeDecrypt, sendMail } from '@common/helper';
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
    private readonly tokenRepository: TokenRepository,
    private readonly serviceRequestRepository: ServiceRequestRepository,
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
    const result = await this.getUsers(
      query,
      {
        role: Role.CUSTOMER,
      },
      'customers',
    );

    return {
      customers: result.users,
      totalCustomers: result.totalUsers,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      limit: result.limit,
    };
  }

  async getAllProviders(query: GetUsersQueryDto) {
    const result = await this.getUsers(
      query,
      {
        role: Role.PROVIDER,
      },
      'providers',
    );

    return {
      providers: result.users,
      totalProviders: result.totalUsers,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      limit: result.limit,
    };
  }

  async getPendingApprovalsDetails(query: GetUsersQueryDto) {
    const result = await this.getUsers(
      query,
      {
        role: Role.PROVIDER,
        adminApproved: ProviderStatus.PendingApproval,
      },
      'pendingProviders',
    );

    return {
      pendingProviders: result.users,
      totalPendingProviders: result.totalUsers,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      limit: result.limit,
    };
  }

  searchAdmin(query: GetUsersQueryDto) {
    return this.getUsers(
      query,
      {
        role: Role.ADMIN,
      },
      'admins',
    );
  }

  private async getUsers(
    query: GetUsersQueryDto,
    filters: Record<string, unknown>,
    facetKey: string,
  ) {
    const { state, city, category, search, page = 1, limit = 10 } = query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Math.min(Number(limit) || 10, 50);

    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const pipeline: PipelineStage[] = [];

    // Base filters
    const matchStage: Record<string, unknown> = {
      ...filters,
    };

    if (state) matchStage.state = state;

    if (city) matchStage.city = city;

    if (category) {
      matchStage.service = category;
    }

    pipeline.push({
      $match: matchStage,
    });

    // Create full name field
    pipeline.push({
      $addFields: {
        fullName: {
          $concat: ['$firstName', ' ', '$lastName'],
        },
      },
    });

    // Search
    if (search) {
      const safeSearch = escapeRegex(search);

      pipeline.push({
        $match: {
          $or: [
            {
              firstName: {
                $regex: safeSearch,
                $options: 'i',
              },
            },
            {
              lastName: {
                $regex: safeSearch,
                $options: 'i',
              },
            },
            {
              fullName: {
                $regex: safeSearch,
                $options: 'i',
              },
            },
            {
              email: {
                $regex: safeSearch,
                $options: 'i',
              },
            },
            {
              mobileNumber: {
                $regex: safeSearch,
                $options: 'i',
              },
            },
          ],
        },
      });
    }

    // Pagination + Count
    pipeline.push({
      $facet: {
        metadata: [
          {
            $count: 'total',
          },
        ],

        [facetKey]: [
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $skip: (pageNumber - 1) * limitNumber,
          },
          {
            $limit: limitNumber,
          },
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

    const [result = { metadata: [], [facetKey]: [] }] =
      await this.userRepository.aggregate(pipeline);

    const totalUsers = result.metadata[0]?.total ?? 0;

    const users = result[facetKey] ?? [];

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

  async userDetails(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { message: 'User not found' };
    }
    const { password, ...userDetails } = user.toObject();
    userDetails.mobileNumber = (await safeDecrypt(
      userDetails.mobileNumber,
    )) as unknown as string;
    return userDetails;
  }

  async deleteUser(userId: string) {
    await this.userRepository.deleteById(userId);

    return { message: 'User deleted successfully' };
  }

  async getAllRequests() {
    return await this.serviceRequestRepository.find(
      {},
      {
        populate: ['customerId', 'providerId'],
        lean: true,
        select:
          'firstName lastName userName dob age profileURL mobileNumber email specialization service dateNeeded startTime endTime status createdAt updatedAt',
      },
    );
  }

  async getRequestDetails(id:any){
    return await this.serviceRequestRepository.find(
      {id},
      {
        populate: ['customerId', 'providerId'],
        lean: true,
        select:
          'firstName lastName userName dob age profileURL mobileNumber email specialization service dateNeeded startTime endTime status createdAt updatedAt',
      },
    );
  }

  async logout(token: string) {
    await this.tokenRepository.add(
      token,
      new Date(Date.now() + 1000 * 60 * 60),
    );
    return { message: 'Logged out successfully' };
  }
}
