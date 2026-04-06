import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServiceController {
    private readonly serviceService;
    constructor(serviceService: ServiceService);
    create(createServiceDto: CreateServiceDto): Promise<{
        message: string;
        service: string;
    }>;
    getServices(): Promise<void>;
}
