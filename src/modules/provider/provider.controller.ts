import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ProviderService } from './provider.service';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderFactoryService } from './factory';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@common/guard';
import { Role } from '@common/types/enum';
import { Roles } from '@common/decorators';

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: ProviderService,
    private readonly providerFactoryService: ProviderFactoryService,
  ) {}

  @Post('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PROVIDER)
  updateProfile(@Body() updateProviderDto: UpdateProviderDto, @Req() req: any) {
    const provider = this.providerFactoryService.updateProvider(
      updateProviderDto,
      req.user,
    );
    return this.providerService.update(req.user._id, provider);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PROVIDER)
  @Get('')
  async getMyProfile(@Req() req: any) {
    return await this.providerService.getProfile(req.user._id);
  }

  @Get(':id')
  async getAnotherProfile(@Param('id') id: string) {
    return await this.providerService.searchProfile(id);
  }

  @Post("update-password")
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PROVIDER)
  async updatePassword(
    @Req() req: any,
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
    return await this.providerService.updatePassword(
      req.user._id,
      oldPassword,
      newPassword,
    );
  }

  @Delete('soft-delete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PROVIDER)
  async softDeleteAccount(@Req() req: any) {
    return await this.providerService.softDeleteAccount(req.user._id);
  }
}
