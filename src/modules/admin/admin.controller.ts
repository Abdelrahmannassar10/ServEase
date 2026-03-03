import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminFactoryService } from './factory';
import { RolesGuard } from '@common/guard';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@common/types/enum';
import { Roles } from '@common/decorators';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminFactoryService: AdminFactoryService,
  ) {}

  @Post('create')
  create(@Body() createAdminDto: CreateAdminDto) {
    const admin = this.adminFactoryService.CreateAdmin(createAdminDto);
    return this.adminService.createAdmin(admin);
  }

  @Post('login')
  @UseGuards(AuthGuard('admin-local'))
  adminLogin(@Req() req) {
    return this.adminService.login(req.user);
  }

  @Get('pending-providers')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  getPendingProviders() {
    return this.adminService.getPendingProviders();
  }
}
