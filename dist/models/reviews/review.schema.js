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
exports.reviewSchema = exports.Review = void 0;
const enum_1 = require("../../common/types/enum");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Review = class Review {
    id;
    userId;
    customerId;
    ProviderId;
    rate;
    content;
    status;
};
exports.Review = Review;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", default: undefined }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Review.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Customer", default: undefined }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Review.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Provider", default: undefined }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Review.prototype, "ProviderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, maxLength: 5, minlength: 1, required: true }),
    __metadata("design:type", Number)
], Review.prototype, "rate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Review.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: enum_1.ReviewType, required: true }),
    __metadata("design:type", String)
], Review.prototype, "status", void 0);
exports.Review = Review = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Review);
exports.reviewSchema = mongoose_1.SchemaFactory.createForClass(Review);
//# sourceMappingURL=review.schema.js.map