import { GeneralSettingRepository } from '@models/index';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UpdateGeneralSettingDto } from './dto/update-general-setting.dto';

type GeneralSettingsResponse = {
  webCommission: number;
  providerDebt: number;
  providerCancelFee: number;
  providerCancelCount: number;
  revenue: number;
};

@Injectable()
export class GeneralSettingService implements OnModuleInit {
  constructor(
    private readonly generalSettingRepository: GeneralSettingRepository,
  ) {}

  async onModuleInit() {
    const settings = await this.generalSettingRepository.findOne({});

    if (!settings) {
      await this.generalSettingRepository.create({
        webCommission: 10,
        providerDebt: 0,
        providerCancelFee: 0,
        providerCancelCount: 0,
        revenue: 0,
      });
    }
  }

  async updateSettings(updateGeneralSettingDto: UpdateGeneralSettingDto) {
    const settings = await this.generalSettingRepository.upsertSettings(
      updateGeneralSettingDto,
    );

    return this.serializeSettings(settings);
  }

  async getGeneralSettings() {
    const settings = await this.generalSettingRepository.findOne(
      {},
      {
        select: 'webCommission providerDebt providerCancelFee providerCancelCount revenue',
      },
    );

    return this.serializeSettings(settings);
  }

  private serializeSettings(
    settings: Partial<GeneralSettingsResponse> | null,
  ): GeneralSettingsResponse {
    return {
      webCommission: settings?.webCommission ?? 10,
      providerDebt: settings?.providerDebt ?? 0,
      providerCancelFee: settings?.providerCancelFee ?? 0,
      providerCancelCount: settings?.providerCancelCount ?? 0,
      revenue: settings?.revenue ?? 0,
    };
  }
}
