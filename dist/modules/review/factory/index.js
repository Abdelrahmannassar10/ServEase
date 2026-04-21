"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewFactoryService = void 0;
const enum_1 = require("../../../common/types/enum");
const review_entity_1 = require("../entities/review.entity");
class ReviewFactoryService {
    globalReview(globalReviewDto, userId) {
        const review = new review_entity_1.Review();
        review.userId = userId;
        review.rate = globalReviewDto.rate;
        review.content = globalReviewDto.content;
        review.status = enum_1.ReviewType.GLOBAL;
        return review;
    }
}
exports.ReviewFactoryService = ReviewFactoryService;
//# sourceMappingURL=index.js.map