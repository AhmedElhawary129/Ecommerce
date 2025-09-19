import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageAllowedExtensions } from "src/common/constants/constants";
import { Auth, UserDecorator } from "src/common/decorator";
import { UserRoles } from "src/common/types/types";
import { multerCloud } from "src/common/utils/multerCloud";
import { CreateSubCategoryDto, UpdateSubCategoryDto } from "./dto/subCategory.dto";
import type { UserDocument } from "src/DB/models";
import type { Express } from "express";
import { SubCategoryService } from "./subCategory.service";
import { Types } from "mongoose";
import { QueryDto } from "../products/dto/product.dto";

@Controller("subCategories")
export class SubCategoryController {
    constructor(private readonly _subCategoryService: SubCategoryService) {}

    //----------------------------------------------------------------------------------------------------------------

    // create subCategory
    @Post("create")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor("mainImage", multerCloud({
        allowedExtensions: ImageAllowedExtensions
    })))
    async createCategory(
        @Body() body: CreateSubCategoryDto, 
        @UserDecorator() user: UserDocument,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this._subCategoryService.createSubCategory(body, user, file);
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
        @Body() body: UpdateSubCategoryDto, 
        @Param("id") id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this._subCategoryService.updateSubCategory(body, user, file, id);
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
        return this._subCategoryService.deleteSubCategory(user, id);
    }

    //----------------------------------------------------------------------------------------------------------------

    // get all sub categories
    @Get()
    async getAllBrands(
        @Query() query: QueryDto
    ) {
        return this._subCategoryService.getAllSubCategories(query);
    }
}
