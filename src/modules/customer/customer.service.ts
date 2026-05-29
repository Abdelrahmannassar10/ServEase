import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomerRepository, ProviderRepository } from '@models/index';
import { encrypt, safeDecrypt } from '@common/helper';
import * as bcrypt from 'bcrypt';
import { getAnotherProfileDTO } from './dto/getAnotherProfileDTO';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ProviderStatus } from '@common/types';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}
  async updateProfile(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const updateData: any = {
      ...updateCustomerDto,
    };

    if (updateCustomerDto.mobileNumber) {
      updateData.mobileNumber = await encrypt(updateCustomerDto.mobileNumber);
    } else {
      delete updateData.mobileNumber;
    }

    return this.customerRepository.updateById(id, updateData);
  }

  async getProvider(service: string) {
    const providers = await this.providerRepository.find({
      service,
      isDeleted: false,
      adminApproved: ProviderStatus.Active,
    },{populate: ['service']});
    return providers.map((provider) => {
      const { password, ...providerData } = JSON.parse(
        JSON.stringify(provider),
      );
      return providerData;
    });
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
      deletedAt,
      changeCredentialTimestamp,
      createdAt,
      ...customerData
    } = JSON.parse(JSON.stringify(customer));
    customerData.mobileNumber =
      (await safeDecrypt(customerData.mobileNumber)) ?? null;
    return customerData;
  }

  async getAnotherProfile(getAnotherProfile: getAnotherProfileDTO) {
    const customer = await this.customerRepository.findById(
      getAnotherProfile.id,
    );
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const {
      mobileNumber,
      userName,
      profileURL,
      backgroundURL,
      ...customerData
    } = JSON.parse(JSON.stringify(customer));
    const decryptedMobileNumber = (await safeDecrypt(mobileNumber)) ?? null;
    return {
      mobileNumber: decryptedMobileNumber,
      userName,
      profileURL,
      backgroundURL,
    };
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
