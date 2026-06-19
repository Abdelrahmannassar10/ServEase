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
import { CreateBroadcastRequestDto } from './dto/create-broadcast-request.dto';
import { CustomerSelectOfferDto } from './dto/customer-select-offer.dto';
import { CompleteHourlyServiceDto } from './dto/complete-hourly-service.dto';
import { CancelBroadcastRequestDto } from './dto/cancel-broadcast-request.dto';
import { ProviderRespondBroadcastDto } from './dto/provider-respond-broadcast.dto';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { DirectProviderAcceptDto } from './dto/direct-provider-accept.dto';
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
    @Body() dto: DirectProviderAcceptDto,
    @Request() req: any,
  ) {
    return this.serviceRequestService.providerAccept(
      dto.id,
      dto,
      req.user._id,
    );
  }

  @Patch('complete-hourly')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  completeHourlyDirect(
    @Body() dto: CompleteHourlyServiceDto,
    @Request() req: any,
  ) {
    return this.serviceRequestService.completeHourlyService(dto, req.user._id);
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

@Post('broadcast')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
createBroadcast(
  @Body() dto: CreateBroadcastRequestDto,
  @Request() req: any,
) {
  return this.serviceRequestService.createBroadcastRequest(dto, req.user._id);
}

@Get('broadcast/available')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.PROVIDER)
getAvailableBroadcasts(@Request() req: any) {
  return this.serviceRequestService.getAvailableBroadcastRequests(req.user._id);
}

@Post('broadcast/respond')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.PROVIDER)
respondToBroadcast(
  @Body() dto: ProviderRespondBroadcastDto,
  @Request() req: any,
) {
  return this.serviceRequestService.providerRespondToBroadcast(dto, req.user._id);
}

@Get('broadcast/:id/offers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
getOffersSummary(@Param('id') id: string, @Request() req: any) {
  return this.serviceRequestService.getOffersSummary(id, req.user._id);
}

@Patch('broadcast/select-offer')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
selectOffer(
  @Body() dto: CustomerSelectOfferDto,
  @Request() req: any,
) {
  return this.serviceRequestService.customerSelectOffer(dto, req.user._id);
}

@Patch('broadcast/complete-hourly')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
completeHourly(
  @Body() dto: CompleteHourlyServiceDto,
  @Request() req: any,
) {
  return this.serviceRequestService.completeHourlyService(dto, req.user._id);
}

@Patch('broadcast/cancel')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER)
cancelBroadcast(
  @Body() dto: CancelBroadcastRequestDto,
  @Request() req: any,
) {
  return this.serviceRequestService.cancelBroadcastRequest(dto, req.user._id);
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
