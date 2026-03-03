import { ConflictException, Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { AdminRepository } from '@models/index';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}
  async createAdmin(admin: Admin) {
    const existingAdmin = await this.adminRepository.findOne({
      email: admin.email,
    });

    if (existingAdmin) {
      throw new ConflictException('Admin already exists');
    }
    admin.password= await bcrypt.hash(admin.password, 10);
    try {
      await this.adminRepository.create(admin);
      return { message: 'Admin created successfully' };
    } catch (error) {
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
  getPendingProviders() {
    return this.adminRepository.find(
      { where: { isDeleted: false, role: 'PROVIDER', isApproved: false } },
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
  }
}
