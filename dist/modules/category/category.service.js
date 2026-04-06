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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const category_repository_1 = require("../../models/category/category.repository");
let CategoryService = class CategoryService {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(createCategoryDto) {
        const category = await this.categoryRepository.create(createCategoryDto);
        return {
            message: 'Category created successfully',
            category: category.name,
        };
    }
    async getCategories() {
        const categories = await this.categoryRepository.findAll({}, {}, {
            populate: {
                path: "services",
                select: { name: 1 }
            },
        });
        return categories.map((category) => ({
            category: {
                id: category._id,
                name: category.name,
            },
            services: category.services,
        }));
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository])
], CategoryService);
//# sourceMappingURL=category.service.js.map