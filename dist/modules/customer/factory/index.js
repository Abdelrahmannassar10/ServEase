"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerFactoryService = void 0;
const helper_1 = require("../../../common/helper");
class CustomerFactoryService {
    async updateProfile(updateCustomerDto, existCustomer) {
        const updatedCustomer = { ...existCustomer };
        updatedCustomer.firstName =
            updateCustomerDto.firstName ?? existCustomer.firstName;
        updatedCustomer.lastName =
            updateCustomerDto.lastName ?? existCustomer.lastName;
        updatedCustomer.mobileNumber = updateCustomerDto.mobileNumber
            ? await (0, helper_1.encrypt)(updateCustomerDto.mobileNumber)
            : existCustomer.mobileNumber;
        updatedCustomer.dob = updateCustomerDto.dob ?? existCustomer.dob;
        updatedCustomer.city = updateCustomerDto.city ?? existCustomer.city;
        updatedCustomer.state = updateCustomerDto.state ?? existCustomer.state;
        return updatedCustomer;
    }
}
exports.CustomerFactoryService = CustomerFactoryService;
//# sourceMappingURL=index.js.map