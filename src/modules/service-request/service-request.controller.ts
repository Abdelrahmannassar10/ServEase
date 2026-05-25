import { Roles } from '@common/decorators';
import { RolesGuard } from '@common/guard';
import { Role } from '@common/types/enum';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ServiceRequestService } from './service-request.service';

@Controller('service-requests')
export class ServiceRequestController {
  constructor(
    private readonly serviceRequestService: ServiceRequestService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  @Post()
  create(@Body() dto: CreateServiceRequestDto, @Request() req: any) {
    console.log(req.user);
    
    return this.serviceRequestService.create(dto, req.user._id);
  }

@Get()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN)
findRequests(@Request() req: any) {
  return this.serviceRequestService.findRequests(req.user);
}


  @Patch('provider-accept')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PROVIDER)
  providerAccept(
  @Body() body: { id: string; price: number; endTime: string },
  @Request() req: any,
) {
  return this.serviceRequestService.providerAccept(
    body.id,
    body,
    req.user._id,
  );
}

  @Patch('provider-reject')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.PROVIDER)
providerReject(
  @Body('id') id: string,
  @Request() req: any,
) {
  return this.serviceRequestService.providerReject(id, req.user._id);
}

@Patch('customer-accept')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
customerAccept(
  @Body('id') id: string,
  @Request() req: any,
) {
  return this.serviceRequestService.customerAccept(id, req.user._id);
}

@Patch('customer-reject')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
customerReject(
  @Body('id') id: string,
  @Request() req: any,
) {
  return this.serviceRequestService.customerReject(id, req.user._id);
}

@Patch('customer-cancel')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
customerCancel(
  @Body('id') id: string,
  @Request() req: any,
) {
  return this.serviceRequestService.customerCancel(id, req.user._id);
}

@Patch('provider-cancel')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.PROVIDER)
providerCancel(
  @Body('id') id: string,
  @Request() req: any,
) {
  return this.serviceRequestService.providerCancel(id, req.user._id);
}

@Patch('complete')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
completeService(
  @Body() body: { id: string; completionCode: string },
  @Request() req: any,
) {
  return this.serviceRequestService.completeService(
    body.id,
    body,
    req.user._id,
  );
}
@Get('calendar')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.PROVIDER)
getProviderCalendar(@Request() req: any) {
  return this.serviceRequestService.getProviderCalendar(req.user._id);
}


@UseGuards(AuthGuard('jwt'),RolesGuard)
@Roles(Role.CUSTOMER,Role.PROVIDER)
@Get("get-requests")
async getRequestService(@Request() req :any){
  return this.serviceRequestService.findRequests(req.user);
}

@Get(':id')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN)
getRequestDetails(
  @Param('id') id: string,
  @Request() req: any,
) {
  return this.serviceRequestService.findOneDetails(
    id,
    req.user,
  );
}
}
