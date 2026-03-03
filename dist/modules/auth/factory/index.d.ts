import { CustomerRegisterDto, ProviderRegisterDto } from '../dto';
import { Customer, Provider } from '../entities/auth.entity';
export declare class AuthFactoryService {
    createCustomer(customerDTO: CustomerRegisterDto): Promise<Customer>;
    createProvider(providerDTO: ProviderRegisterDto): Promise<Provider>;
}
