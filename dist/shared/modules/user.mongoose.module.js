"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMongooseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const models_1 = require("../../models");
let UserMongooseModule = class UserMongooseModule {
};
exports.UserMongooseModule = UserMongooseModule;
exports.UserMongooseModule = UserMongooseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: models_1.User.name,
                    schema: models_1.userSchema,
                    discriminators: [
                        { name: models_1.Admin.name, schema: models_1.adminSchema },
                        { name: models_1.Customer.name, schema: models_1.customerSchema },
                        { name: models_1.Provider.name, schema: models_1.providerSchema },
                    ],
                },
            ]),
        ],
        providers: [
            models_1.CustomerRepository,
            models_1.ProviderRepository,
            models_1.AdminRepository,
            models_1.UserRepository,
        ],
        exports: [
            models_1.CustomerRepository,
            models_1.ProviderRepository,
            models_1.AdminRepository,
            models_1.UserRepository,
        ],
    })
], UserMongooseModule);
//# sourceMappingURL=user.mongoose.module.js.map