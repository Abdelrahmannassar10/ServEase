"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderModule = void 0;
const common_1 = require("@nestjs/common");
const provider_service_1 = require("./provider.service");
const provider_controller_1 = require("./provider.controller");
const modules_1 = require("../../shared/modules");
const factory_1 = require("./factory");
let ProviderModule = class ProviderModule {
};
exports.ProviderModule = ProviderModule;
exports.ProviderModule = ProviderModule = __decorate([
    (0, common_1.Module)({
        imports: [modules_1.UserMongooseModule],
        controllers: [provider_controller_1.ProviderController],
        providers: [provider_service_1.ProviderService, factory_1.ProviderFactoryService],
    })
], ProviderModule);
//# sourceMappingURL=provider.module.js.map