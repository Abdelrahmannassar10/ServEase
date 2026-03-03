import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Admin, HAdminDocument } from './admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminRepository extends AbstractRepository<HAdminDocument> {
  constructor(@InjectModel(Admin.name) private readonly adminModel: Model<HAdminDocument>) {
    super(adminModel);
  }
}
