import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@common/decorators';
import { RolesGuard } from '@common/guard';
import { Role } from '@common/types/enum';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}
  @Get('paymob-redirect')
  @Redirect()
  paymobRedirect(@Query() query: any) {
    return this.paymentService.handlePaymobRedirect(query);
  }

  @Post('provider-debt')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PROVIDER)
  createProviderDebtPayment(@Request() req: any) {
    return this.paymentService.createProviderDebtPayment(
      req.user._id,
    );
  }

  @Post('provider-debt/confirm')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PROVIDER)
  confirmProviderDebtPayment(@Request() req: any) {
    return this.paymentService.confirmProviderDebtPayment(
      req.user._id,
    );
  }

  @Post('paymob-webhook')
  paymobWebhook(
    @Body() body: any,
    @Query('hmac') hmac: string,
  ) {
    return this.paymentService.handlePaymobWebhook(body, hmac);
  }
}