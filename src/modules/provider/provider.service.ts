import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderRepository, ServiceRepository, ServiceRequestRepository } from '@models/index';
import * as bcrypt from 'bcrypt';
import { encrypt, safeDecrypt } from '@common/helper';
import { ServiceStatus } from '@common/types/enum';

@Injectable()
export class ProviderService {
  constructor(
    private readonly providerRepository: ProviderRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly serviceRequestRepository: ServiceRequestRepository,
  ) {}

  private async populateProviderService(provider: any) {
    if (!provider || !provider.service) {
      return provider;
    }

    if (typeof provider.service === 'object' && provider.service.name) {
      return provider;
    }

    const service = await this.serviceRepository.findById(
      provider.service.toString(),
      { lean: true, select: '_id name icon_text' },
    );

    return {
      ...provider,
      service: service ?? provider.service,
    };
  }

  private async populateProvidersService(providers: any[]) {
    const ids = Array.from(
      new Set(
        providers
          .filter((p) => p?.service)
          .map((p) => p.service.toString()),
      ),
    );
    if (!ids.length) {
      return providers;
    }

    const services = await this.serviceRepository.find(
      { _id: { $in: ids } },
      { lean: true, select: '_id name icon_text' },
    );
    const serviceMap = new Map(
      services.map((service) => [service._id.toString(), service]),
    );

    return providers.map((provider) => ({
      ...provider,
      service:
        provider?.service && serviceMap.get(provider.service.toString())
          ? serviceMap.get(provider.service.toString())
          : provider.service,
    }));
  }

  async updateProfile(id: string, updateProviderDto: UpdateProviderDto) {
    const provider = await this.providerRepository.findById(id);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const updateData: any = {
      ...updateProviderDto,
    };

    if (updateProviderDto.mobileNumber) {
      updateData.mobileNumber = await encrypt(updateProviderDto.mobileNumber);
    } else {
      delete updateData.mobileNumber;
    }

    await this.providerRepository.updateById(id, updateData);
    const updatedProvider = await this.providerRepository.findById(id, {
      populate: ['service'],
      lean: true,
    });

    return this.populateProviderService(updatedProvider);
  }

  async getProfile(userid: string): Promise<any> {
  const provider = await this.providerRepository.findById(userid, {
    populate: ['service'],
    lean: true,
  });

  if (!provider) {
    throw new NotFoundException('Provider not found');
  }

  const completedRequests = await this.serviceRequestRepository.find(
  {
    provider: userid,
    status: ServiceStatus.COMPLETED,
  },
  {
    lean: true,
  },
);

  const totalEarnings = completedRequests.reduce(
    (sum, request) => sum + (request.price || 0),
    0,
  );

  const completedServices =
    completedRequests.length;

  const monthlyMap =
    new Map<string, number>();

  for (const request of completedRequests) {
      const date =
   (request as any).updatedAt ??
   (request as any).createdAt;


    const month =
      new Date(date).toLocaleString(
        'en-US',
        {
          month: 'short',
          year: 'numeric',
        },
      );

    monthlyMap.set(
      month,
      (monthlyMap.get(month) || 0) +
      (request.price || 0),
    );
  }

  const monthlyEarnings =
    Array.from(
      monthlyMap.entries(),
    ).map(([month, amount]) => ({
      month,
      amount,
    }));

  const recentTransactions =
    completedRequests
      .slice(0, 5)
      .map((request) => ({
        serviceRequestId:
          request._id,

        title:
          request.serviceNeeded ||
          'Completed Service',

        amount:
          request.price || 0,

        type: 'earning',

        date:
          (request as any).updatedAt ||
          (request as any).createdAt,
      }));

  const {
    password,
    isVerified,
    otpExpiry,
    otp,
    __v,
    userAgent,
    role,
    ...providerData
  } = provider;

  const mobileNumber =
    (await safeDecrypt(
      providerData.mobileNumber,
    )) ?? null;

  return {
    ...providerData,
    mobileNumber,

    totalEarnings,
    completedServices,

    monthlyEarnings,

    recentTransactions,
  };
}

  async searchProfile(id: string) {
    const provider = await this.providerRepository.findById(id, {
      populate: ['service'],
      lean: true,
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const { _id, mobileNumber, userName, profileURL, backgroundURL } = provider;

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
