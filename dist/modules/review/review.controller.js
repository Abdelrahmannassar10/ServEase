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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const review_service_1 = require("./review.service");
const enum_1 = require("../../common/types/enum");
const decorators_1 = require("../../common/decorators");
const factory_1 = require("./factory");
const passport_1 = require("@nestjs/passport");
const guard_1 = require("../../common/guard");
const create_review_dto_1 = require("./dto/create-review.dto");
let ReviewController = class ReviewController {
    reviewService;
    reviewFactoryService;
    constructor(reviewService, reviewFactoryService) {
        this.reviewService = reviewService;
        this.reviewFactoryService = reviewFactoryService;
    }
    async globalReview(globalReviewDto, req) {
        const review = this.reviewFactoryService.globalReview(globalReviewDto, req.user._id);
        const result = await this.reviewService.globalReview(review);
        return result;
    }
    async getGlobalReviews() {
        const result = await this.reviewService.getGlobalReviews();
        return result;
    }
};
exports.ReviewController = ReviewController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER, enum_1.Role.PROVIDER),
    (0, common_1.Post)("global-review"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_review_dto_1.globalReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "globalReview", null);
__decorate([
    (0, common_1.Get)("/global-reviews"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getGlobalReviews", null);
exports.ReviewController = ReviewController = __decorate([
    (0, common_1.Controller)('review'),
    __metadata("design:paramtypes", [review_service_1.ReviewService, factory_1.ReviewFactoryService])
], ReviewController);
//# sourceMappingURL=review.controller.js.map