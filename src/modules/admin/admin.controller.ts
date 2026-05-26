import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminFactoryService } from './factory';
import { RolesGuard } from '@common/guard';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@common/types/enum';
import { Roles } from '@common/decorators';
import { RejectProviderDto } from './dto/Reject-provider-dto';
import { GetUsersQueryDto } from './dto/get-users-query-dto';

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
  @Roles(Role.ADMIN)
  async getPendingProviders() {
    return await this.adminService.getPendingProviders();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post('active-provider/:providerId')
  async approveProvider(@Param('providerId') providerId: string) {
    return await this.adminService.approveProvider(providerId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post('reject-provider')
  async rejectProvider(@Body() rejectProviderDto: RejectProviderDto) {
    return await this.adminService.rejectProvider(rejectProviderDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('customers')
  async getAllCustomers(@Query() query: GetUsersQueryDto) {
    return await this.adminService.getAllCustomers(query);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('providers')
  async getAllProviders(@Query() query: GetUsersQueryDto) {
    return await this.adminService.getAllProviders(query);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('')
  async getAllAdmins() {
    return await this.adminService.getAllAdmins();
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post('delete/:Id')
  async deleteUser(@Param('Id') userId: string) {
    return await this.adminService.deleteUser(userId);
    
  }
}
