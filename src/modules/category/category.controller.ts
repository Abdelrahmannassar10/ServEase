import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RolesGuard } from '@common/guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@common/decorators';
import { Role } from '@common/types/enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("add")
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async getCategories(){
    return await this.categoryService.getCategories();
  }
}
