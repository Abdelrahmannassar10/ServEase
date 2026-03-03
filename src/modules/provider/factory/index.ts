import { UpdateProviderDto } from "../dto/update-provider.dto";

export class ProviderFactoryService {
    updateProvider(updateProviderDto: UpdateProviderDto,user: any) {
           const existingProvider = {...user};
           existingProvider.firstName = updateProviderDto.firstName??existingProvider.firstName;
           existingProvider.lastName = updateProviderDto.lastName??existingProvider.lastName;
           existingProvider.mobileNumber = updateProviderDto.mobileNumber??existingProvider.mobileNumber;
           existingProvider.dob = updateProviderDto.dob??existingProvider.dob;
           existingProvider.city = updateProviderDto.city??existingProvider.city;
           existingProvider.state = updateProviderDto.state??existingProvider.state;
           existingProvider.writtenCv = updateProviderDto.writtenCv??existingProvider.writtenCv;
           existingProvider.nationalNumber = updateProviderDto.nationalNumber??existingProvider.nationalNumber;
           existingProvider.service = updateProviderDto.service??existingProvider.service;
           existingProvider.specialization = updateProviderDto.specialization??existingProvider.specialization;
           return existingProvider;
    }
}