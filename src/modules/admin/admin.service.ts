import { ConflictException, Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { AdminRepository, ProviderRepository } from '@models/index';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@common/types/enum';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly jwtService: JwtService,
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
    const pendingProviders = await this.providerRepository.find(
      {
        where: { isDeleted: false, role: Role.PROVIDER, adminApproved: false },
      },
      {
        select: {
          _id: true,
          firstName: true,
          lastName: true,
          email: true,
          userName: true,
          mobileNumber: true,
          state: true,
          city: true,
          age: true,
          profileURL: true,
          backgroundURL: true,
          service: true,
          specialization: true,
          nationalNumber: true,
          writtenCv: true,
        },
      },
    );
    console.log('PENDING PROVIDERS:', pendingProviders);
    return pendingProviders;
  }
}
