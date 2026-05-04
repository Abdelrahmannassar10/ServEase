import { ConflictException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceRepository } from '@models/service/service.repository';
import { CategoryRepository } from '@models/category/category.repository';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}
  async create(createServiceDto: CreateServiceDto) {
    const categoryExist = await this.categoryRepository.findById(
      createServiceDto.categoryId as unknown as string,
    );
    if (!categoryExist) {
      throw new ConflictException('Category not found');
    }
    const serviceExist = await this.serviceRepository.findOne({
      name: createServiceDto.name,
    });
    if (serviceExist) {
      throw new ConflictException('Service already exists');
    }
    const service = await this.serviceRepository.create(createServiceDto);
    await this.categoryRepository.updateById(
      createServiceDto.categoryId as unknown as string,
      { $push: { services: service._id } },
    );
    return { message: 'Service created successfully', service: service.name };
  }
  async getServices() {
     const service =  await this.serviceRepository.findAll(
      {} ,{_id :1 ,name:1 ,categoryId:1},{}
    ).populate('categoryId', 'name');
    return service;
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
