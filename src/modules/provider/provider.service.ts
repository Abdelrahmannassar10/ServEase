import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderRepository } from '@models/index';
import * as bcrypt from 'bcrypt';
import { decrypt } from '@common/helper';

@Injectable()
export class ProviderService {
  constructor(private readonly providerRepository: ProviderRepository) {}

  update(id: string, updateProviderDto: UpdateProviderDto) {
    return this.providerRepository.updateById(id, updateProviderDto);
  }

  async getProfile(userid: string) {
    const provider = await this.providerRepository.findById(userid);
    if (!provider) {
      throw new NotFoundException('Provider not found');
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
      updatedAt,
      createdAt,
      adminApproved,
      ...providerData
    } = JSON.parse(JSON.stringify(provider));
    providerData.mobileNumber = await decrypt(provider.mobileNumber);
    return providerData;
  }

  async searchProfile(id: string) {
    const provider = await this.providerRepository.findById(id);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    const { mobileNumber, userName, profileURL, backgroundURL, ...providerData } = JSON.parse(
      JSON.stringify(provider),
    );
    const decryptedMobileNumber = await decrypt(mobileNumber);
    return { mobileNumber: decryptedMobileNumber, userName, profileURL, backgroundURL };
  }

  async updatePassword(
      userid: string,
      oldPassword: string,
      newPassword: string,
    ) {
      const provider = await this.providerRepository.findById(userid);
  
      if (!provider) {
        throw new NotFoundException('Provider not found');
      }
      if (!(await bcrypt.compare(oldPassword, provider.password))) {
        throw new UnauthorizedException('Old password is incorrect');
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      provider.password = hashedNewPassword;
      provider.changeCredentialTimestamp = new Date();
      await this.providerRepository.updateById(provider.id, provider);
      return { message: 'Password updated successfully' };
    }

    async softDeleteAccount(userid: string) {
    const provider = await this.providerRepository.findById(userid);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    await this.providerRepository.softDeleteById(userid);
    return { message: 'Account deleted successfully' };
  }
}
