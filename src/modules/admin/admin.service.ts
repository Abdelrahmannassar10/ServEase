import { ConflictException, Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import {
  AdminRepository,
  GeneralSettingRepository,
  ProviderRepository,
  ServiceRepository,
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
    private readonly serviceRepository: ServiceRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly serviceRequestRepository: ServiceRequestRepository,
    private readonly generalSettingRepository: GeneralSettingRepository,
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
    const pendingProviders = await this.providerRepository.find(
      {
        adminApproved: ProviderStatus.PendingApproval,
      },
      { populate: ['service'], lean: true },
    );

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

    let users = result[facetKey] ?? [];
    users = await this.populateServiceForUsers(users);

    return {
      users,
      totalUsers,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalUsers / limitNumber),
      limit: limitNumber,
    };
  }

  private async populateServiceForUsers(users: any[]) {
    const serviceIds = Array.from(
      new Set(
        users
          .filter((user) => user?.service)
          .map((user) => user.service.toString()),
      ),
    );

    if (!serviceIds.length) {
      return users;
    }

    const services = await this.serviceRepository.find(
      { _id: { $in: serviceIds } },
      { lean: true, select: '_id name icon_text' },
    );
    const serviceMap = new Map(
      services.map((service) => [service._id.toString(), service]),
    );

    return users.map((user) => ({
      ...user,
      service:
        user?.service && serviceMap.get(user.service.toString())
          ? serviceMap.get(user.service.toString())
          : user.service,
    }));
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
        select: 'firstName lastName userName service ',
      },
    );
  }

  async getRequestDetails(id: any) {
    return await this.serviceRequestRepository.find(
      { id },
      {
        populate: ['customerId', 'providerId'],
        lean: true,
        select:
          'firstName lastName userName dob age profileURL mobileNumber email specialization service dateNeeded startTime endTime status createdAt updatedAt',
      },
    );
  }

  async dashboardStats() {
    const [
      totalUsers,
      totalProviders,
      totalServiceRequests,
      pendingApprovals,
      generalSettings,
      recentUser,
      recentProvider,
      recentRequest,
    ] = await Promise.all([
      this.userRepository.count({}),
      this.providerRepository.count({}),
      this.serviceRequestRepository.count({}),
      this.providerRepository.count({
        adminApproved: ProviderStatus.PendingApproval,
      }),

      this.generalSettingRepository.findOne(
        {},
        {
          select: '-__v -_id -createdAt -updatedAt',
        },
      ),

      // Latest Customer
      this.userRepository.findOne(
        {},
        {
          sort: { createdAt: -1 },
          select: 'firstName lastName createdAt',
        },
      ),

      // Latest Provider
      this.providerRepository.findOne(
        {},
        {
          sort: { createdAt: -1 },
          select: 'firstName lastName createdAt',
        },
      ),

      // Latest Request
      this.serviceRequestRepository.findOne(
        {},
        {
          sort: { createdAt: -1 },
          populate: [
            { path: 'customerId', select: 'firstName lastName' },
            { path: 'providerId', select: 'firstName lastName' },
          ],
          select: 'customerId providerId createdAt',
        },
      ),
    ]);

    const recentActivity: Array<{
      type: string;
      message: string;
      createdAt: any;
      timeAgo?: string;
    }> = [];

    const makeTimeAgo = (d: any) => {
      if (!d) return '';
      const date = new Date(d);
      if (isNaN(date.getTime())) return '';
      const diff = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diff < 60) return 'just now';
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      return `${Math.floor(diff / 86400)} days ago`;
    };

    if (recentUser) {
      const userName = `${(recentUser as any).firstName || ''} ${(recentUser as any).lastName || ''}`.trim() || ((recentUser as any).userName as any) || 'Customer';
      recentActivity.push({
        type: 'Customer Registration',
        message: userName,
        createdAt: (recentUser as any).createdAt,
        timeAgo: makeTimeAgo((recentUser as any).createdAt),
      });
    }

    if (recentProvider) {
      const providerName = `${(recentProvider as any).firstName || ''} ${(recentProvider as any).lastName || ''}`.trim() || ((recentProvider as any).userName as any) || 'Provider';
      recentActivity.push({
        type: 'Provider Registration',
        message: providerName,
        createdAt: (recentProvider as any).createdAt,
        timeAgo: makeTimeAgo((recentProvider as any).createdAt),
      });
    }

    if (recentRequest) {
      const cust = (recentRequest as any).customerId;
      const prov = (recentRequest as any).providerId;
      const custName = cust ? (`${cust.firstName || ''} ${cust.lastName || ''}`.trim() || (cust.userName as any) || 'Customer') : 'Customer';
      const provName = prov ? (`${prov.firstName || ''} ${prov.lastName || ''}`.trim() || (prov.userName as any) || 'Provider') : 'Provider';
      recentActivity.push({
        type: 'New Request',
        message: `${custName} → ${provName}`,
        createdAt: (recentRequest as any).createdAt,
        timeAgo: makeTimeAgo((recentRequest as any).createdAt),
      });
    }

    recentActivity.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return {
      totalUsers,
      totalProviders,
      totalServiceRequests,
      pendingApprovals,
      revenue: generalSettings?.revenue || 0,
      recentActivity,
    };
  }

  async logout(token: string) {
    await this.tokenRepository.add(
      token,
      new Date(Date.now() + 1000 * 60 * 60),
    );
    return { message: 'Logged out successfully' };
  }
}
