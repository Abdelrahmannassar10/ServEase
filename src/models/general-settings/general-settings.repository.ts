import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { GeneralSetting, GeneralSettingDocument } from './general-settings.schema';

@Injectable()
export class GeneralSettingRepository extends AbstractRepository<GeneralSettingDocument> {
  constructor(@InjectModel(GeneralSetting.name) private readonly generalSettingModel: Model<GeneralSettingDocument>) {
    super(generalSettingModel);
  }
}
