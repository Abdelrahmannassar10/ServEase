import { encrypt } from '@common/helper';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

export class CustomerFactoryService {
  async updateProfile(
    updateCustomerDto: UpdateCustomerDto,
    existCustomer: any,
  ) {
    const updatedCustomer = { ...existCustomer };
    updatedCustomer.firstName =
      updateCustomerDto.firstName ?? existCustomer.firstName;
    updatedCustomer.lastName =
      updateCustomerDto.lastName ?? existCustomer.lastName;
    updatedCustomer.mobileNumber = updateCustomerDto.mobileNumber
      ? await encrypt(updateCustomerDto.mobileNumber)
      : existCustomer.mobileNumber;
    updatedCustomer.dob = updateCustomerDto.dob ?? existCustomer.dob;
    updatedCustomer.city = updateCustomerDto.city ?? existCustomer.city;
    updatedCustomer.state = updateCustomerDto.state ?? existCustomer.state;
    return updatedCustomer;
  }
}
