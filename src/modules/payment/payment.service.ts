import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderRepository } from '@models/index';
import { ProviderStatus } from '@common/types/enum';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly providerRepository: ProviderRepository,
  ) {}

  private get baseUrl(): string {
    return (
      this.configService.get<string>('PAYMOB.BASE_URL') ||
      'https://accept.paymob.com/api'
    );
  }

  private get currency(): string {
    return this.configService.get<string>('PAYMOB.CURRENCY') || 'EGP';
  }

  private get apiKey(): string {
    return this.configService.get<string>('PAYMOB.API_KEY')!;
  }

  private get integrationId(): number {
    return Number(this.configService.get<string>('PAYMOB.INTEGRATION_ID'));
  }

  private get iframeId(): string {
    return this.configService.get<string>('PAYMOB.IFRAME_ID')!;
  }

  private get hmacSecret(): string {
    return this.configService.get<string>('PAYMOB.HMAC') || '';
  }

  private get frontendBillingUrl(): string {
    return 'https://serv-ease-lilac.vercel.app/provider/billing';
  }

  private async getAuthToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: this.apiKey }),
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
        currency: this.currency,
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
  ): Promise<string> {
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
        currency: this.currency,
        integration_id: this.integrationId,
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

    const order = await this.createOrder(authToken, amountCents, providerId);

    const paymentToken = await this.createPaymentKey(
      authToken,
      order.id,
      amountCents,
      provider,
    );

    return {
      amount: provider.debt,
      status: provider.adminApproved,
      orderId: order.id,
      paymentUrl: `${this.baseUrl}/acceptance/iframes/${this.iframeId}?payment_token=${paymentToken}`,
    };
  }

  private async confirmProviderDebtPayment(providerId: string) {
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

  private verifyPaymobHmac(obj: any, hmac: string): boolean {
    if (!this.hmacSecret || !hmac || !obj) {
      return false;
    }

    const values = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order?.id,
      obj.owner,
      obj.pending,
      obj.source_data?.pan,
      obj.source_data?.sub_type,
      obj.source_data?.type,
      obj.success,
    ];

    const concatenated = values.map((value) => String(value ?? '')).join('');

    const calculatedHmac = crypto
      .createHmac('sha512', this.hmacSecret)
      .update(concatenated)
      .digest('hex');

    return calculatedHmac.toLowerCase() === hmac.toLowerCase();
  }

  async handlePaymobWebhook(body: any, hmac: string) {
    const obj = body.obj;

    if (!obj) {
      throw new BadRequestException('Invalid webhook body');
    }

    const isValidHmac = this.verifyPaymobHmac(obj, hmac);

    if (!isValidHmac) {
      throw new BadRequestException('Invalid Paymob HMAC');
    }

    if (obj.success !== true) {
      return { message: 'Payment not successful' };
    }

    const merchantOrderId = obj.order?.merchant_order_id;

    if (!merchantOrderId) {
      throw new BadRequestException('Missing merchant order id');
    }

    const providerId = merchantOrderId
      .replace('provider-debt-', '')
      .split('-')[0];

    if (!providerId) {
      throw new BadRequestException('Missing provider id');
    }

    return this.confirmProviderDebtPayment(providerId);
  }

  async handlePaymobRedirect(query: any) {
  const isValidHmac = this.verifyPaymobHmac(query, query.hmac);

  if (!isValidHmac) {
    return {
      url: 'https://serv-ease-lilac.vercel.app/payment-failed',
    };
  }

  const success = query.success === 'true' || query.success === true;

  if (!success) {
    return {
      url: 'https://serv-ease-lilac.vercel.app/payment-failed',
    };
  }

  const merchantOrderId = query.merchant_order_id;

  if (!merchantOrderId) {
    return {
      url: 'https://serv-ease-lilac.vercel.app/payment-failed',
    };
  }

  const providerId = merchantOrderId
    .replace('provider-debt-', '')
    .split('-')[0];

  if (!providerId) {
    return {
      url: 'https://serv-ease-lilac.vercel.app/payment-failed',
    };
  }

  return {
    url: 'https://serv-ease-lilac.vercel.app/payment-success',
  };
}
}