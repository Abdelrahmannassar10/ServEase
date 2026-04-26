"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModule = void 0;
const common_1 = require("@nestjs/common");
const review_service_1 = require("./review.service");
const review_controller_1 = require("./review.controller");
const mongoose_1 = require("@nestjs/mongoose");
const review_schema_1 = require("../../models/reviews/review.schema");
const reviews_repository_1 = require("../../models/reviews/reviews.repository");
const factory_1 = require("./factory");
const modules_1 = require("../../shared/modules");
let ReviewModule = class ReviewModule {
};
exports.ReviewModule = ReviewModule;
exports.ReviewModule = ReviewModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: review_schema_1.Review.name, schema: review_schema_1.reviewSchema }
            ]), modules_1.UserMongooseModule],
        controllers: [review_controller_1.ReviewController],
        providers: [review_service_1.ReviewService, reviews_repository_1.ReviewRepository, factory_1.ReviewFactoryService],
    })
], ReviewModule);
//# sourceMappingURL=review.module.js.map