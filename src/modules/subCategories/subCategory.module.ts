import { Module } from "@nestjs/common";
import { SubCategoryController } from "./subCategory.controller";
import { SubCategoryService } from "./subCategory.service";
import {
  BrandModel,
  CategoryModel,
  ProductModel,
  SubCategoryModel,
} from "src/DB/models";
import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
  SubCategoryRepository,
} from "src/DB/repository";
import { FileUploadService } from "src/common/service/fileUpload.service";

@Module({
  imports: [SubCategoryModel, CategoryModel, BrandModel, ProductModel],
  controllers: [SubCategoryController],
  providers: [
    SubCategoryService,
    CategoryRepository,
    SubCategoryRepository,
    FileUploadService,
    BrandRepository,
    ProductRepository,
  ],
})
export class SubCategoryModule {}
