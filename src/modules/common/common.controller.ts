import {
  Controller,
  Post,
  BadRequestException,
  UploadedFile,
  Req,
  UseInterceptors,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@common/types/enum';
import { Roles } from '@common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@common/guard';
import * as multer from 'multer';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}
  @Post('upload-photo')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER, Role.PROVIDER)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: multer.memoryStorage(),
    }),
  )
  uploadPhoto(
    @Req() req: any,
    @UploadedFile()
    photo?: Express.Multer.File,
  ) {
    if (!photo) {
      throw new BadRequestException('Missing required file');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(photo.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    if (photo.size > 2 * 1024 * 1024) {
      throw new BadRequestException('File too large. Max 2MB');
    }
    return this.commonService.uploadPhoto(req.user, photo);
  }

  @Get('general-counts')
  async getGeneralCounts() {
    return await this.commonService.getGeneralCounts();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('users-growth')
  getUsersGrowth() {
    return this.commonService.getUsersGrowth();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('requests-status-statistics')
  getRequestsStatusStatistics() {
    return this.commonService.getRequestsStatusStatistics();
  }
}
