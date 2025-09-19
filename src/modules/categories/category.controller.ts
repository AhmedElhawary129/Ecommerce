import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Auth, UserDecorator } from "src/common/decorator/index";
import { UserRoles } from "src/common/types/types";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import type { UserDocument } from "src/DB/models";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import { ImageAllowedExtensions } from "src/common/constants/constants";
import { multerCloud } from "src/common/utils/multerCloud";
import { Types } from "mongoose";
import { QueryDto } from "../products/dto/product.dto";

@Controller("categories")
export class CategoryController {
    constructor(private readonly _categoryService: CategoryService) {}

    //----------------------------------------------------------------------------------------------------------------

    // create category
    @Post("create")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor("mainImage", multerCloud({
        allowedExtensions: ImageAllowedExtensions
    })))
    async createCategory(
        @Body() body: CreateCategoryDto, 
        @UserDecorator() user: UserDocument,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this._categoryService.createCategory(body, user, file);
    }

    //----------------------------------------------------------------------------------------------------------------

    // update category
    @Patch("update/:id")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor("mainImage", multerCloud({
        allowedExtensions: ImageAllowedExtensions
    })))
    async updateCategory(
        @Body() body: UpdateCategoryDto, 
        @Param("id") id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this._categoryService.updateCategory(body, user, file, id);
    }

    //----------------------------------------------------------------------------------------------------------------

    // delete category
    @Delete("delete/:id")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    async deleteCategory(
        @Param("id") id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
    ) {
        return this._categoryService.deleteCategory(user, id);
    }


    //----------------------------------------------------------------------------------------------------------------

    // get all categories
    @Get()
    async getAllBrands(
        @Query() query: QueryDto
    ) {
        return this._categoryService.getAllCategories(query);
    }
}

