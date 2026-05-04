import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from '@models/category/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const categoryExist = await this.categoryRepository.findOne({
      name: createCategoryDto.name,
    });
    if (categoryExist) {
      throw new ConflictException('Category already exists');
    }

    const category = await this.categoryRepository.create(createCategoryDto);
    return {
      message: 'Category created successfully',
      category: category.name,
    };
  }
  async getCategories() {
    const categories = await this.categoryRepository.findAll(
      {},
      {},
      {
        populate: {
          path: 'services',
          select: { name: 1 },
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

  async deleteCategory(categoryId: string) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new ConflictException('Category not found');
    }
    await this.categoryRepository.deleteById(categoryId);
    return { message: 'Category deleted successfully' };
  }
}
