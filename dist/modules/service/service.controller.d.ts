import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServiceController {
    private readonly serviceService;
    constructor(serviceService: ServiceService);
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
