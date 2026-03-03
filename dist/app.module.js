"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const dev_config_1 = __importDefault(require("./config/env/dev.config"));
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./modules/auth/auth.module");
const schedule_1 = require("@nestjs/schedule");
const cron_job_helper_1 = require("./common/helper/cron-job.helper");
const modules_1 = require("./shared/modules");
const customer_module_1 = require("./modules/customer/customer.module");
const provider_module_1 = require("./modules/provider/provider.module");
const common_module_1 = require("./modules/common/common.module");
const category_module_1 = require("./modules/category/category.module");
const service_module_1 = require("./modules/service/service.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [dev_config_1.default],
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get('db').url,
                }),
            }),
            auth_module_1.AuthModule,
            schedule_1.ScheduleModule.forRoot(),
            modules_1.UserMongooseModule,
            customer_module_1.CustomerModule,
            provider_module_1.ProviderModule,
            common_module_1.CommonModule,
            admin_module_1.AdminModule,
            service_module_1.ServiceModule,
            category_module_1.CategoryModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, cron_job_helper_1.TasksService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map