import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@common/guard';
import { Roles } from '@common/decorators';
import { Role } from '@common/types/enum';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('add')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get('all')
  async getServices() {
    return await this.serviceService.getServices();
  }
}
