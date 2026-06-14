import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderRepository } from '@models/index';
import { ProviderStatus } from '@common/types/enum';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly providerRepository: ProviderRepository,
  ) {}

  private get baseUrl() {
    return this.configService.get<string>('PAYMOB_BASE_URL');
  }

  private async getAuthToken() {
    const response = await fetch(`${this.baseUrl}/auth/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: this.configService.get<string>('PAYMOB_API_KEY'),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(data);
    }

    return data.token;
  }

  private async createOrder(
    authToken: string,
    amountCents: number,
    providerId: string,
  ) {
    const response = await fetch(`${this.baseUrl}/ecommerce/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amountCents,
        currency: this.configService.get<string>('PAYMOB_CURRENCY') || 'EGP',
        merchant_order_id: `provider-debt-${providerId}-${Date.now()}`,
        items: [],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(data);
    }

    return data;
  }

  private async createPaymentKey(
    authToken: string,
    orderId: number,
    amountCents: number,
    provider: any,
  ) {
    const response = await fetch(`${this.baseUrl}/acceptance/payment_keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          first_name: provider.firstName || 'Provider',
          last_name: provider.lastName || 'User',
          email: provider.email || 'provider@test.com',
          phone_number: provider.mobileNumber || '01000000000',
          apartment: 'NA',
          floor: 'NA',
          street: 'NA',
          building: 'NA',
          shipping_method: 'NA',
          postal_code: 'NA',
          city: provider.city || 'NA',
          country: 'EG',
          state: provider.state || 'NA',
        },
        currency: this.configService.get<string>('PAYMOB_CURRENCY') || 'EGP',
        integration_id: Number(
          this.configService.get<string>('PAYMOB_INTEGRATION_ID'),
        ),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(data);
    }

    return data.token;
  }

  async createProviderDebtPayment(providerId: string) {
    const provider = await this.providerRepository.findById(providerId);

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    if (!provider.debt || provider.debt <= 0) {
      throw new BadRequestException('You do not have debt to pay');
    }

    const authToken = await this.getAuthToken();
    const amountCents = Math.round(provider.debt * 100);

    const order = await this.createOrder(
      authToken,
      amountCents,
      providerId,
    );

    const paymentToken = await this.createPaymentKey(
      authToken,
      order.id,
      amountCents,
      provider,
    );

    const iframeId = this.configService.get<string>('PAYMOB_IFRAME_ID');

    return {
      amount: provider.debt,
      orderId: order.id,
      paymentUrl: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`,
    };
  }

  async confirmProviderDebtPayment(providerId: string) {
    const provider = await this.providerRepository.findById(providerId);

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    provider.debt = 0;
    provider.providerCancelFees = 0;
    provider.adminApproved = ProviderStatus.Active;

    await this.providerRepository.updateById(providerId, provider);

    return {
      message: 'Debt paid successfully',
      debt: provider.debt,
      providerCancelFees: provider.providerCancelFees,
      adminApproved: provider.adminApproved,
    };
  }
}