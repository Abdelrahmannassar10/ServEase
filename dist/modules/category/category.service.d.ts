import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from '@models/category/category.repository';
export declare class CategoryService {
    private readonly categoryRepository;
    constructor(categoryRepository: CategoryRepository);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        message: string;
        category: string;
    }>;
}
