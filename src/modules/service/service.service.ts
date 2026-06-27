import { ConflictException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceRepository } from '@models/service/service.repository';
import { ProviderRepository } from '@models/index';
import { ConfigService } from '@nestjs/config';
import { sendMail } from '@common/helper';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly configService: ConfigService,
  ) {}
  async create(createServiceDto: CreateServiceDto) {
    const serviceExist = await this.serviceRepository.findOne({
      name: createServiceDto.name,
    });
    if (serviceExist) {
      throw new ConflictException('Service already exists');
    }
    const service = await this.serviceRepository.create(createServiceDto);
    return { message: 'Service created successfully', service: service.name };
  }
  async getServices() {
    return await this.serviceRepository.find({});
  }

  async deleteService(serviceId: string) {
    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw new ConflictException('Service not found');
    }

    const providers = await this.providerRepository.find(
      { service: serviceId },
      { lean: true },
    );

    const templates = this.configService.get('EMAIL_TEMPLATES');
    await Promise.all(
      providers.map(async (provider: any) => {
        if (!provider?.email) return;

        try {
          await sendMail({
            to: provider.email,
            subject: templates.serviceDeleted.subject,
            html: templates.serviceDeleted.body(
              provider.firstName || provider.userName || 'there',
              service.name,
            ),
          });
        } catch (error) {
          console.error(
            `Failed to send service deletion email to ${provider.email}:`,
            error,
          );
        }
      }),
    );

    await this.serviceRepository.deleteById(serviceId);
    return { message: 'Service deleted successfully' };
  }
}
