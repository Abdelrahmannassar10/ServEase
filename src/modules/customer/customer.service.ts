import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { CustomerRepository } from '@models/index';
import { decrypt } from '@common/helper';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '@common/cloudinary';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly cloudService: CloudinaryService,
  ) {}
  updateProfile(updateProfile: Customer, id: string) {
    const updatedCustomer = this.customerRepository.updateById(
      id,
      updateProfile,
    );
    if (!updatedCustomer) {
      throw new NotFoundException('Customer not found');
    }
    return updatedCustomer;
  }

  async getProfile(userid: string) {
    const customer = await this.customerRepository.findById(userid);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const {
      password,
      isVerified,
      id,
      otpExpiry,
      otp,
      __v,
      userAgent,
      role,
      _id,
      isDeleted,
      updatedAt,
      dob,
      createdAt,
      ...customerData
    } = JSON.parse(JSON.stringify(customer));
    return customerData;
  }

  async getAnotherProfile(userid: string) {
    const customer = await this.customerRepository.findById(userid);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const { mobileNumber, userName, profileURL, backgroundURL, ...customerData } = JSON.parse(
      JSON.stringify(customer),
    );
    const decryptedMobileNumber = await decrypt(mobileNumber);
    return { mobileNumber: decryptedMobileNumber, userName, profileURL, backgroundURL };
  }

  async updatePassword(
    userid: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const customer = await this.customerRepository.findById(userid);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    if (!(await bcrypt.compare(oldPassword, customer.password))) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedNewPassword;
    customer.changeCredentialTimestamp = new Date();
    await this.customerRepository.updateById(customer.id, customer);
    return { message: 'Password updated successfully' };
  }

  async softDeleteAccount(userid: string) {
    const customer = await this.customerRepository.findById(userid);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    await this.customerRepository.softDeleteById(userid);
    return { message: 'Account deleted successfully' };
  }
}
