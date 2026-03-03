"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = exports.Role = exports.Gender = exports.PaymentMethod = exports.PaymentStatus = exports.ServiceStatus = exports.ServiceCategory = exports.UserAgent = void 0;
var UserAgent;
(function (UserAgent) {
    UserAgent["SYSTEM"] = "SYSTEM";
    UserAgent["GOOGLE"] = "GOOGLE";
})(UserAgent || (exports.UserAgent = UserAgent = {}));
var ServiceCategory;
(function (ServiceCategory) {
    ServiceCategory["PLUMBING"] = "PLUMBING";
    ServiceCategory["ELECTRICAL"] = "ELECTRICAL";
    ServiceCategory["CARPENTRY"] = "CARPENTRY";
    ServiceCategory["CLEANING"] = "CLEANING";
    ServiceCategory["PAINTING"] = "PAINTING";
    ServiceCategory["OTHER"] = "OTHER";
})(ServiceCategory || (exports.ServiceCategory = ServiceCategory = {}));
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["PENDING"] = "PENDING";
    ServiceStatus["ACCEPTED"] = "ACCEPTED";
    ServiceStatus["REJECTED"] = "REJECTED";
    ServiceStatus["COMPLETED"] = "COMPLETED";
})(ServiceStatus || (exports.ServiceStatus = ServiceStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethod["DEBIT_CARD"] = "DEBIT_CARD";
    PaymentMethod["PAYPAL"] = "PAYPAL";
    PaymentMethod["CASH"] = "CASH";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
})(Gender || (exports.Gender = Gender = {}));
var Role;
(function (Role) {
    Role["CUSTOMER"] = "Customer";
    Role["PROVIDER"] = "Provider";
    Role["ADMIN"] = "Admin";
})(Role || (exports.Role = Role = {}));
var City;
(function (City) {
    City["CAIRO"] = "Cairo";
    City["GIZA"] = "Giza";
    City["ALEXANDRIA"] = "Alexandria";
    City["DAKAHLIA"] = "Dakahlia";
    City["RED_SEA"] = "Red Sea";
    City["BEHEIRA"] = "Beheira";
    City["FAYOUM"] = "Fayoum";
    City["GHARBIA"] = "Gharbia";
    City["ISMAILIA"] = "Ismailia";
    City["MENOFIA"] = "Menofia";
    City["MINYA"] = "Minya";
    City["QALYUBIA"] = "Qalyubia";
    City["NEW_VALLEY"] = "New Valley";
    City["SUEZ"] = "Suez";
    City["ASWAN"] = "Aswan";
    City["ASSIUT"] = "Assiut";
    City["BENI_SUEF"] = "Beni Suef";
    City["PORT_SAID"] = "Port Said";
    City["DAMIETTA"] = "Damietta";
    City["SHARQIA"] = "Sharqia";
    City["SOUTH_SINAI"] = "South Sinai";
    City["KAFR_EL_SHEIKH"] = "Kafr El Sheikh";
    City["MATROUH"] = "Matrouh";
    City["LUXOR"] = "Luxor";
    City["QENA"] = "Qena";
    City["NORTH_SINAI"] = "North Sinai";
    City["SOHAG"] = "Sohag";
})(City || (exports.City = City = {}));
//# sourceMappingURL=index.js.map