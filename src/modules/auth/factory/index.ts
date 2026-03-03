import { encrypt, generateOTP } from '@common/helper';
import { CustomerRegisterDto, ProviderRegisterDto } from '../dto';
import { Customer, Provider } from '../entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
export class AuthFactoryService {
  async createCustomer(customerDTO: CustomerRegisterDto) {
    const customer = new Customer();
    customer.firstName = customerDTO.firstName;
    customer.lastName = customerDTO.lastName;
    customer.email = customerDTO.email;
    if (customerDTO.mobileNumber) {
      customer.mobileNumber = await encrypt(customerDTO.mobileNumber);
    } else {
      throw new BadRequestException('Mobile number is required for customers');
    }
    customer.password = await bcrypt.hash(customerDTO.password, 10);
    customer.otp = generateOTP();
    customer.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    customer.isVerified = false;
    customer.dob = customerDTO.dob;
    customer.city = customerDTO.city;
    customer.state = customerDTO.state;
    return customer;
  }
  async createProvider(providerDTO: ProviderRegisterDto) {
    const provider = new Provider();
    provider.firstName = providerDTO.firstName;
    provider.lastName = providerDTO.lastName;
    provider.email = providerDTO.email;
    provider.mobileNumber = await encrypt(providerDTO.mobileNumber);
    provider.password = await bcrypt.hash(providerDTO.password, 10);
    provider.otp = generateOTP();
    provider.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    provider.isVerified = false;
    provider.dob = providerDTO.dob;
    provider.city = providerDTO.city;
    provider.state = providerDTO.state;
    provider.writtenCv = providerDTO.writtenCv;
    provider.nationalNumber = providerDTO.nationalNumber;
    provider.adminApproved = false;
    provider.service = providerDTO.service;
    provider.specialization = providerDTO.specialization;
    return provider;
  }
}
