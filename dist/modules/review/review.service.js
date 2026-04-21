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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const reviews_repository_1 = require("../../models/reviews/reviews.repository");
const enum_1 = require("../../common/types/enum");
let ReviewService = class ReviewService {
    reviewRepository;
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async globalReview(review) {
        const result = await this.reviewRepository.create(review);
        return result;
    }
    async getGlobalReviews() {
        return await this.reviewRepository.find({ status: enum_1.ReviewType.GLOBAL }).populate('userId', 'firstName lastName userName dob age profileUrl');
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reviews_repository_1.ReviewRepository])
], ReviewService);
//# sourceMappingURL=review.service.js.map