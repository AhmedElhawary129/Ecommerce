import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageAllowedExtensions } from "src/common/constants/constants";
import { Auth, UserDecorator } from "src/common/decorator";
import { UserRoles } from "src/common/types/types";
import { multerCloud } from "src/common/utils/multerCloud";
import { CreateBrandDto, UpdateBrandDto } from "./dto/brand.dto";
import type { UserDocument } from "src/DB/models";
import type { Express } from "express";
import { BrandService } from "./brand.service";
import { Types } from "mongoose";
import { QueryDto } from "../products/dto/product.dto";

@Controller("brands")
export class BrandController {
    constructor(private readonly _brandService: BrandService) {}

    //----------------------------------------------------------------------------------------------------------------

    // create brand
    @Post("create")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor("mainImage", multerCloud({
        allowedExtensions: ImageAllowedExtensions
    })))
    async createCategory(
        @Body() body: CreateBrandDto, 
        @UserDecorator() user: UserDocument,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this._brandService.createBrand(body, user, file);
    }

    //----------------------------------------------------------------------------------------------------------------

    // update brand
    @Patch("update/:id")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor("mainImage", multerCloud({
        allowedExtensions: ImageAllowedExtensions
    })))
    async updateCategory(
        @Body() body: UpdateBrandDto, 
        @Param("id") id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this._brandService.updateBrand(body, user, file, id);
    }

    //----------------------------------------------------------------------------------------------------------------

    // delete brand
    @Delete("delete/:id")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    async deleteCategory(
        @Param("id") id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
    ) {
        return this._brandService.deleteBrand(user, id);
    }

    //----------------------------------------------------------------------------------------------------------------

    // get all brands
    @Get()
    async getAllBrands(
        @Query() query: QueryDto
    ) {
        return this._brandService.getAllBrands(query);
    }
}
