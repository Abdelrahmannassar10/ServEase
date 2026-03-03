import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceRepository } from '@models/service/service.repository';
import { CategoryRepository } from '@models/category/category.repository';
export declare class ServiceService {
    private readonly serviceRepository;
    private readonly categoryRepository;
    constructor(serviceRepository: ServiceRepository, categoryRepository: CategoryRepository);
    create(createServiceDto: CreateServiceDto): Promise<{
        message: string;
        service: string;
    }>;
}
