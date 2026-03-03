import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, categorySchema } from '@models/category/category.schema';
import { CategoryRepository } from '@models/category/category.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: categorySchema }])],
  controllers: [CategoryController],
  providers: [CategoryService,CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
