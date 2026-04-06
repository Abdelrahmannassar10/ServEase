import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from '@models/category/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(createCategoryDto);
    return {
      message: 'Category created successfully',
      category: category.name,
    };
  }
  async getCategories() {
     const categories=  await this.categoryRepository.findAll(
      {},
      {},
      {
        populate: {
          path:"services",
          select: {name: 1}
        },
        
      },
    );
    return categories.map((category) => ({
    category: {
      id: category._id,
      name: category.name,
    },
    services: category.services,
  }));
  }
}
