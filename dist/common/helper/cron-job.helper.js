"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const index_1 = require("../../models/index");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const console_1 = require("console");
let TasksService = TasksService_1 = class TasksService {
    userRepository;
    logger = new common_1.Logger(TasksService_1.name);
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async handleCron() {
        this.logger.debug('Called when the current second is 45');
        (0, console_1.log)('Called when the current second is 45');
        await this.userRepository.updateMany({ otpExpiry: { $lte: new Date() } }, { $unset: { otp: "", otpExpiry: "" } });
    }
    async softDeleteCron() {
        this.logger.debug('Called when the current second is 45');
        (0, console_1.log)('Called when the current second is 45');
        await this.userRepository.deleteMany({ isDeleted: true });
    }
};
exports.TasksService = TasksService;
__decorate([
    (0, schedule_1.Cron)('* * 6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "handleCron", null);
__decorate([
    (0, schedule_1.Cron)('* * 6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "softDeleteCron", null);
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [index_1.UserRepository])
], TasksService);
//# sourceMappingURL=cron-job.helper.js.map