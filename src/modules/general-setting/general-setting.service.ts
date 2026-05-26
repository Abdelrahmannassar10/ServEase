import { GeneralSettingRepository } from '@models/index';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UpdateGeneralSettingDto } from './dto/update-general-setting.dto';

@Injectable()
export class GeneralSettingService implements OnModuleInit {
  constructor(
    private readonly generalSettingRepository: GeneralSettingRepository,
  ) {}
  async onModuleInit() {
    const settings = await this.generalSettingRepository.find({});

    if (!settings) {
      await this.generalSettingRepository.create({
        webCommission: 10,
        providerDebt: 0,
        providerCancelFee: 0,
        providerCancelCount: 0,
      });
    }
  }

  async updateSettings(updateGeneralSettingDto: UpdateGeneralSettingDto) {
    await this.generalSettingRepository.updateMany(
      {},
      updateGeneralSettingDto,
    );
  }

  async getGeneralSettings() {
    const list = await this.generalSettingRepository.find(
      {},
      {
        select: 'webCommission providerDebt providerCancelFee providerCancelCount',
      },
    );

    const data = list[0] ?? {
      webCommission: 10,
      providerDebt: 0,
      providerCancelFee: 0,
      providerCancelCount: 0,
    };

    return {
      webCommission: data.webCommission,
      providerDebt: data.providerDebt,
      providerCancelFee: data.providerCancelFee,
      providerCancelCount: data.providerCancelCount,
    };
  }
}
