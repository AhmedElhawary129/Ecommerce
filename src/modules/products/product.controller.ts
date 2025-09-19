import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateProductDto, QueryDto, UpdateProductDto } from "./dto/product.dto";
import { ProductService } from "./product.service";
import { Auth, UserDecorator } from "src/common/decorator";
import { UserRoles } from "src/common/types/types";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { multerCloud } from "src/common/utils/multerCloud";
import { ImageAllowedExtensions } from "src/common/constants/constants";
import type { UserDocument } from "src/DB/models";
import type { Express } from "express";
import { Types } from "mongoose";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller("products")
export class ProductController {
    constructor(private readonly _productService: ProductService) {}

    //----------------------------------------------------------------------------------------------------------------

    // create product
    @Post("create")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileFieldsInterceptor([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ], multerCloud({
        allowedExtensions: ImageAllowedExtensions
    })))
    async createProduct(
        @Body() body: CreateProductDto,
        @UserDecorator() user: UserDocument,
        @UploadedFiles() files: {mainImage: Express.Multer.File[], subImages: Express.Multer.File[]}
    ) {
        return this._productService.createProduct(body, user, files);
    }

    //----------------------------------------------------------------------------------------------------------------

    // update product
    @Patch("update/:productId")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileFieldsInterceptor([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ], multerCloud({
        allowedExtensions: ImageAllowedExtensions
    })))
    async update(
        @Body() body: UpdateProductDto,
        @Param("productId") productId: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFiles() files: {mainImage: Express.Multer.File[], subImages: Express.Multer.File[]}
    ) {
        return this._productService.updateProduct(body, user, files, productId);
    }

    //----------------------------------------------------------------------------------------------------------------

    // delete product
    @Delete("delete/:id")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    async deleteCategory(
        @Param("id") id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
    ) {
        return this._productService.deleteProduct(user, id);
    }

    //----------------------------------------------------------------------------------------------------------------

    // get all products
    @Get()
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(CacheInterceptor)
    async getAllProducts(
        @Query() query: QueryDto
    ) {
        return this._productService.getAllProducts(query);
    }
}
