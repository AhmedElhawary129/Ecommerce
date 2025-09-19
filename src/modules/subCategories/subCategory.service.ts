import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { FileUploadService } from "src/common/service/fileUpload.service";
import { BrandRepository, CategoryRepository, ProductRepository, SubCategoryRepository } from "src/DB/repository";
import { CreateSubCategoryDto, UpdateSubCategoryDto } from "./dto/subCategory.dto";
import type { SubCategoryDocument, UserDocument } from "src/DB/models";
import type { Express } from "express";
import { FilterQuery, Types } from "mongoose";
import slugify from "slugify";
import { QueryDto } from "../products/dto/product.dto";

@Injectable()
export class SubCategoryService {

    constructor(
        private readonly _subCategoryRepository: SubCategoryRepository,
        private readonly _fileUploadService: FileUploadService,
        private readonly _categoryRepository: CategoryRepository,
        private readonly _brandRepository: BrandRepository,
        private readonly _productRepository: ProductRepository
    ) {}

    //----------------------------------------------------------------------------------------------------------------

    // create sub category
    async createSubCategory(
        body: CreateSubCategoryDto,
        user: UserDocument,
        file: Express.Multer.File,
    ) {
        const { name, category } = body;

        // check if category exist
        const categoryExist = await this._categoryRepository.findOne({filter: {_id: category}});
        if (!categoryExist) {
            throw new NotFoundException("Category not found");
        }   

        let dummyData = {
            name,
            userId: user._id,
            category: Types.ObjectId.createFromHexString(category)
        };
        const customId = Math.random().toString(36).substring(2, 7);
        if (file) {
            const { secure_url, public_id } =
            await this._fileUploadService.uploadFile(file, {
                folder: `${process.env.CLOUDINARY_FOLDER}/categories/${categoryExist.customId}/subCategories/${customId}/mainImage`,
            });
            dummyData["image"] = { secure_url, public_id };
            dummyData["customId"] = customId;
        }
        const subCategory = await this._subCategoryRepository.create(dummyData);
        return {
            message: "Sub category created successfully", subCategory
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // update sub category
    async updateSubCategory(
        body: UpdateSubCategoryDto,
        user: UserDocument,
        file: Express.Multer.File,
        id: Types.ObjectId,
    ) {
        const {name} = body || {};

        // check if sub category exist
        const subCategory = await this._subCategoryRepository.findOne({
            filter: {_id: id, userId: user._id}, 
            populate: [
                {path: "category"}
            ]
        });
        if (!subCategory) {
            throw new NotFoundException("Sub category not found or not authorized to update");
        }
        
        if (!name && !file) {
            throw new BadRequestException("Please enter a field to update");
        }

        if (name) {
            if (subCategory.name.toLowerCase() == name.toLowerCase()) {
                throw new BadRequestException("The name is the same, please enter a different name");
            }
            subCategory.name = name
            subCategory.slug = slugify(name, {
                lower: true,
                trim: true,
                replacement: "-"
            })
        }

        if (file) {
            if (subCategory?.image?.public_id) {
                await this._fileUploadService.deleteFile(subCategory.image.public_id)
            }
            const {secure_url, public_id} = await this._fileUploadService.uploadFile(file, {
                folder: `${process.env.CLOUDINARY_FOLDER}/categories/${subCategory.category["customId"]}/subCategories/${subCategory.customId}/mainImage`
            })
            subCategory.image = {secure_url, public_id}
        }
        await subCategory.save();
        return {
            message: "Sub Category updated successfully", subCategory
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // delete sub category
    async deleteSubCategory(user: UserDocument, id: Types.ObjectId) {
        const subCategory = await this._subCategoryRepository.findOne({
            filter: {
                _id: id,
                userId: user._id,
            },
            populate: [
                {path: "category"}
            ]
        });
        if (!subCategory) {
            throw new NotFoundException("Category not found or not authorized to delete",);
        }

        await this._subCategoryRepository.findOneAndDelete({
            _id: id,
            userId: user._id,
        });

        if (subCategory?.image) {
            await this._fileUploadService.deleteFolder(
                `${process.env.CLOUDINARY_FOLDER}/categories/${subCategory.category["customId"]}/subCategories/${subCategory.customId}`,
            );
        }

        // delete sub category brands
        const brands = await this._brandRepository.find({
            filter: {
            subCategory: subCategory._id
        }
        })
        if (brands) {
        await this._brandRepository.deleteMany({
            subCategory: subCategory._id
        })
        }

        // delete sub category products
        const products = await this._productRepository.find({
            filter: {
                subCategory: subCategory._id
            }
        })
        if (products) {
            await this._productRepository.deleteMany({
                subCategory: subCategory._id
            })
        }
        return {
            message: "Sub category, its brands and its products are deleted successfully"
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // get all sub categories
    async getAllSubCategories(query: QueryDto) {
        const {name, select, sort, page} = query;

        let filterObj: FilterQuery<SubCategoryDocument> = {};
        if (name) {
            filterObj = {
                $or: [
                    {name: {$regex: name, $options: "i"}},
                    {slug: {$regex: name, $options: "i"}}
                ]
            }
        }
        const subCategories = await this._subCategoryRepository.find({
            filter: filterObj, 
            populate: [
                {path: "category", select: "name"}
            ],
            sort,
            select,
            page
        });
        return {subCategories};
    }
}
