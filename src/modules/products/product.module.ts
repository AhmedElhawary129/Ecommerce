import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
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
  imports: [ProductModel, CategoryModel, SubCategoryModel, BrandModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    FileUploadService,
    CategoryRepository,
    SubCategoryRepository,
    BrandRepository,
  ],
})
export class ProductModule {}
