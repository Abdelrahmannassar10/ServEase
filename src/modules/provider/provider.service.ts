import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderRepository } from '@models/index';
import * as bcrypt from 'bcrypt';
import { safeDecrypt } from '@common/helper';

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
    providerData.mobileNumber =
      (await safeDecrypt(providerData.mobileNumber)) ?? null;
    return providerData;
  }

  async searchProfile(id: string) {
    const provider = await this.providerRepository.findById(id);

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const { _id,mobileNumber, userName, profileURL, backgroundURL } = JSON.parse(
      JSON.stringify(provider),
    );

    return {
      id: _id,
      mobileNumber: (await safeDecrypt(mobileNumber)) ?? null,
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
