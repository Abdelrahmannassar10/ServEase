"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = exports.Customer = void 0;
class Customer {
    _id;
    firstName;
    lastName;
    email;
    mobileNumber;
    password;
    otp;
    otpExpiry;
    isVerified;
    dob;
    city;
    state;
}
exports.Customer = Customer;
class Provider {
    _id;
    firstName;
    lastName;
    email;
    mobileNumber;
    password;
    otp;
    otpExpiry;
    isVerified;
    dob;
    city;
    state;
    writtenCv;
    adminApproved;
    nationalNumber;
    service;
    specialization;
}
exports.Provider = Provider;
//# sourceMappingURL=auth.entity.js.map