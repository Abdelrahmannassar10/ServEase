import { ConflictException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceRepository } from '@models/service/service.repository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}
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
    await this.serviceRepository.deleteById(serviceId);
    return { message: 'Service deleted successfully' };
  }
}
