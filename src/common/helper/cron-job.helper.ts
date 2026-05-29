import { UserRepository } from '@models/index';
import { ServiceRequestService } from '@modules/service-request/service-request.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { log } from 'console';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly serviceRequestService: ServiceRequestService,
  ) {}



  @Cron('0 0 */6 * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 45');
    log('Called when the current second is 45');
    await this.userRepository.updateMany(
      { otpExpiry: { $lte: new Date() } },
      { $unset:{otp:"",otpExpiry:""}},
    );
  }

  @Cron('0 0 */6 * * *')
  async softDeleteCron() {
    this.logger.debug('Called when the current second is 45');
    log('Called when the current second is 45');
    
    await this.userRepository.deleteMany({ isDeleted: true });
  }
  
  @Cron('0 0 * * * *')
  async handleOutdatedConfirmedRequests() {
    this.logger.debug('Cron job for handling outdated confirmed requests is working');
    await this.serviceRequestService.handleOutdatedConfirmedRequests();
  }
}
