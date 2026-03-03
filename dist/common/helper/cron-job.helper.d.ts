import { UserRepository } from '@models/index';
export declare class TasksService {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: UserRepository);
    handleCron(): Promise<void>;
    softDeleteCron(): Promise<void>;
}
