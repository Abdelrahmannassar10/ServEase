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
}
