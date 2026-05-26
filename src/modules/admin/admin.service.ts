import { ConflictException, Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { AdminRepository, ProviderRepository } from '@models/index';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ProviderStatus, Role } from '@common/types/enum';
import { profile } from 'console';
import { RejectProviderDto } from './dto/Reject-provider-dto';
import { sendMail } from '@common/helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    const allProviders = await this.providerRepository.find({});
    console.log('ALL PROVIDERS:', allProviders);
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
}
