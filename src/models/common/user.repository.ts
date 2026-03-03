import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HUserDocument, User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends AbstractRepository<HUserDocument> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<HUserDocument>) {
    super(userModel);
  }
}
