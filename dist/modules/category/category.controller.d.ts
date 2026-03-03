import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        message: string;
        category: string;
    }>;
}
