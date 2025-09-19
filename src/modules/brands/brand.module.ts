import { Module } from "@nestjs/common";
import { BrandController } from "./brand.controller";
import { BrandService } from "./brand.service";
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
  imports: [BrandModel, CategoryModel, SubCategoryModel, ProductModel],
  controllers: [BrandController],
  providers: [
    BrandService,
    BrandRepository,
    FileUploadService,
    CategoryRepository,
    SubCategoryRepository,
    ProductRepository,
  ],
})
export class BrandModule {}
