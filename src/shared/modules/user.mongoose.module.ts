import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Admin,
  AdminRepository,
  adminSchema,
  Customer,
  CustomerRepository,
  customerSchema,
  Provider,
  ProviderRepository,
  providerSchema,
  User,
  UserRepository,
  userSchema,
} from 'src/models';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
        discriminators: [
          { name: Admin.name, schema: adminSchema },
          { name: Customer.name, schema: customerSchema },
          { name: Provider.name, schema: providerSchema },
        ],
      },
    ]),
  ],
  providers: [
    CustomerRepository,
    ProviderRepository,
    AdminRepository,
    UserRepository,
  ],
  exports: [
    CustomerRepository,
    ProviderRepository,
    AdminRepository,
    UserRepository,
  ],
})
export class UserMongooseModule {}
