import { UserRepository } from '@models/index';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { log } from 'console';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  @Cron('* * 6 * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 45');
    log('Called when the current second is 45');
    await this.userRepository.updateMany(
      { otpExpiry: { $lte: new Date() } },
      { $unset:{otp:"",otpExpiry:""}},
    );
  }

  @Cron('* * 6 * * *')
  async softDeleteCron() {
    this.logger.debug('Called when the current second is 45');
    log('Called when the current second is 45');
    
    await this.userRepository.deleteMany({ isDeleted: true });
  }
}
