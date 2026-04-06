import { Injectable } from '@nestjs/common';
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
    const service = await this.serviceRepository.create(createServiceDto);
    await this.categoryRepository.updateById(
      createServiceDto.categoryId as unknown as string,
      { $push: { services: service._id } },
    );
    return { message: 'Service created successfully', service: service.name };
  }
  async getServices() {
     const service =  await this.serviceRepository.findAll(
      {},
      {select:{name:true}},
      
    );
    return 
  }
}
