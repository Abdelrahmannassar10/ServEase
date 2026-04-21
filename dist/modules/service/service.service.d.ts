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
    getServices(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models/service/service.schema").Service, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/service/service.schema").Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../models/service/service.schema").Service, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/service/service.schema").Service & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
