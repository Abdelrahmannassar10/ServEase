import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HTokenDocument, BlacklistToken } from './token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenRepository extends AbstractRepository<HTokenDocument> {
  constructor(
    @InjectModel(BlacklistToken.name)
    private readonly tokenModel: Model<HTokenDocument>,
  ) {
    super(tokenModel);
  }
  async isBlacklisted(token: string): Promise<boolean> {
    const found = await this.tokenModel.findOne({ token });
    return !!found;
  }
  async add(token: string, expiresAt: Date) {
    return this.tokenModel.create({ token, expiresAt });
  }
}
