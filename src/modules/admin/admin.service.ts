import { Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { AdminRepository } from '@models/index';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}
  async createAdmin(admin: Admin) {
    const adminExist = await this.adminRepository.findOne({
      email: admin.email,
    });
    if (adminExist) {
      throw new Error('Admin already exists');
    }
    await this.adminRepository.create(admin);
    return { message: 'Admin created successfully' };
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
