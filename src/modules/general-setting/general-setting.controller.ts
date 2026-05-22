import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { GeneralSettingService } from './general-setting.service';
import { UpdateGeneralSettingDto } from './dto/update-general-setting.dto';
import { RolesGuard } from '@common/guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@common/decorators';
import { Role } from '@common/types/enum';

@Controller('general-setting')
export class GeneralSettingController {
  constructor(private readonly generalSettingService: GeneralSettingService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('')
  async update( @Body() updateGeneralSettingDto: UpdateGeneralSettingDto) {
    return await this.generalSettingService.updateSettings( updateGeneralSettingDto);
  }

  @Get()
  async get() {
    return this.generalSettingService.getGeneralSettings();
  }


}
