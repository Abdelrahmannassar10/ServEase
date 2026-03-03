import {
  Controller,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Get,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomerFactoryService } from './factory';
import { RolesGuard } from '@common/guard';
import { Roles } from '@common/decorators';
import { Role } from '@common/types/enum';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerFactoryService: CustomerFactoryService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  @Post('update-profile')
  async updateProfile(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Request() req: any,
  ) {
    const customer = await this.customerFactoryService.updateProfile(
      updateCustomerDto,
      req.user,
    );
    const updatedCustomer = await this.customerService.updateProfile(
      customer,
      req.user._id,
    );
    return updatedCustomer;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  @Get('')
  async getMyProfile(@Request() req: any) {
    return await this.customerService.getProfile(req.user._id);
  }

  @Get(':id')
  async getAnotherProfile(@Param('id') id: string) {
    return await this.customerService.getAnotherProfile(id);
  }

  @Post('update-password')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  async updatePassword(
    @Request() req: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const { oldPassword, newPassword } = body;
    if (!oldPassword || !newPassword) {
      throw new UnauthorizedException(
        'Old password and new password are required',
      );
    }
    if (oldPassword === newPassword) {
      throw new UnauthorizedException(
        'New password must be different from old password',
      );
    }
    return await this.customerService.updatePassword(
      req.user._id,
      oldPassword,
      newPassword,
    );
  }
  

  @Post('delete-account')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  async softDeleteAccount(@Request() req: any) {
    return await this.customerService.softDeleteAccount(req.user._id);
  }
}
