import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { FileUploadService } from "src/common/service/fileUpload.service";
import { BrandRepository, CategoryRepository, ProductRepository, SubCategoryRepository } from "src/DB/repository";
import { CreateBrandDto, UpdateBrandDto } from "./dto/brand.dto";
import type { BrandDocument, UserDocument } from "src/DB/models";
import { FilterQuery, Types } from "mongoose";
import slugify from "slugify";
import { QueryDto } from "../products/dto/product.dto";

@Injectable()
export class BrandService {

    constructor(
        private readonly _brandRepository: BrandRepository,
        private readonly _subCategoryRepository: SubCategoryRepository,
        private readonly _categoryRepository: CategoryRepository,
        private readonly _fileUploadService: FileUploadService,
        private readonly _productRepository: ProductRepository
    ) {}

    //----------------------------------------------------------------------------------------------------------------

    // create category
    async createBrand(
        body: CreateBrandDto,
        user: UserDocument,
        file: Express.Multer.File,
    ) {
        const { name, category, subCategory } = body;
        const categoryExist = await this._categoryRepository.findOne({
            filter: {
                _id: category,
            }
        });
        if (!categoryExist) {
            throw new NotFoundException("Category not found");
        }

        const subCategoryExist = await this._subCategoryRepository.findOne({
            filter: {
                _id: subCategory,
            }
        });
        if (!subCategoryExist) {
        throw new NotFoundException("Sub category not found");
        }

        let dummyData = {
            name,
            userId: user._id,
            category: Types.ObjectId.createFromHexString(category),
            subCategory: Types.ObjectId.createFromHexString(subCategory),
        };
        const customId = Math.random().toString(36).substring(2, 7);
        if (file) {
            const { secure_url, public_id } = await this._fileUploadService.uploadFile(file, {
                folder: `${process.env.CLOUDINARY_FOLDER}/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/brands/${customId}/mainImage`
            });
            dummyData["image"] = { secure_url, public_id };
            dummyData["customId"] = customId;
        }
        const brand = await this._brandRepository.create(dummyData);
        return {
            message: "Brand created successfully", brand
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // update brand
    async updateBrand(
        body: UpdateBrandDto,
        user: UserDocument,
        file: Express.Multer.File,
        id: Types.ObjectId,
    ) {
        const {name} = body || {};

        // check if brand exist
        const brand = await this._brandRepository.findOne({
            filter: {_id: id, userId: user._id}, 
            populate: [
                {path: "category"},
                {path: "subCategory"}
            ]
        });
        if (!brand) {
            throw new NotFoundException("Brand not found or not authorized to update");
        }
        
        if (!name && !file) {
            throw new BadRequestException("Please enter a field to update");
        }

        if (name) {
            if (brand.name.toLowerCase() == name.toLowerCase()) {
                throw new BadRequestException("The name is the same, please enter a different name");
            }
            brand.name = name
            brand.slug = slugify(name, {
                lower: true,
                trim: true,
                replacement: "-"
            })
        }

        if (file) {
            if (brand?.image?.public_id) {
                await this._fileUploadService.deleteFile(brand.image.public_id)
            }
            const {secure_url, public_id} = await this._fileUploadService.uploadFile(file, {
                folder: `${process.env.CLOUDINARY_FOLDER}/categories/${brand.category["customId"]}/subCategories/${brand.subCategory["customId"]}/brands/${brand.customId}/mainImage`
            })
            brand.image = {secure_url, public_id}
        }
        await brand.save();
        return {
            message: "Brand updated successfully", brand
        };
    }

  //----------------------------------------------------------------------------------------------------------------

    // delete brand
    async deleteBrand(user: UserDocument, id: Types.ObjectId) {
        const brand = await this._brandRepository.findOne({
            filter: {
                _id: id,
                userId: user._id,
            },
            populate: [
                {path: "category"},
                {path: "subCategory"}
            ]
        });
        if (!brand) {
            throw new NotFoundException("Brand not found or not authorized to delete",);
        }

        await this._brandRepository.findOneAndDelete({
            _id: id,
            userId: user._id,
        });

        if (brand?.image) {
            await this._fileUploadService.deleteFolder(
                `${process.env.CLOUDINARY_FOLDER}/categories/${brand.category["customId"]}/subCategories/${brand.subCategory["customId"]}/brands/${brand.customId}`,
            );
        }
        // delete brand products
        const products = await this._productRepository.find({
            filter: {
                brand: brand._id
            }
        })
        if (products) {
            await this._productRepository.deleteMany({
                brand: brand._id
            })
        }
        return {
            message: "Brand and its products are deleted successfully"
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // get all brands
    async getAllBrands(query: QueryDto) {
        const {name, select, sort, page} = query;

        let filterObj: FilterQuery<BrandDocument> = {};
        if (name) {
            filterObj = {
                $or: [
                    {name: {$regex: name, $options: "i"}},
                    {slug: {$regex: name, $options: "i"}}
                ]
            }
        }
        const brands = await this._brandRepository.find({
            filter: filterObj, 
            populate: [
                {path: "category", select: "name"},
                {path: "subCategory", select: "name"}
            ],
            sort,
            select,
            page
        });
        return {brands};
    }
}
