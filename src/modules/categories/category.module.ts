import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
  SubCategoryRepository,
} from "src/DB/repository";
import {
  BrandModel,
  CategoryModel,
  ProductModel,
  SubCategoryModel,
} from "src/DB/models";
import { FileUploadService } from "src/common/service/fileUpload.service";

@Module({
  imports: [CategoryModel, SubCategoryModel, BrandModel, ProductModel],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    FileUploadService,
    SubCategoryRepository,
    BrandRepository,
    ProductRepository,
  ],
})
export class CategoryModule {}
