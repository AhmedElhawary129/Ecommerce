import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ProductDocument, UserDocument } from "src/DB/models";
import { BrandRepository, CategoryRepository, ProductRepository, SubCategoryRepository } from "src/DB/repository";
import { CreateProductDto, QueryDto, UpdateProductDto } from "./dto/product.dto";
import { FileUploadService } from "src/common/service/fileUpload.service";
import { FilterQuery, Types } from "mongoose";
import slugify from "slugify";
import type { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class ProductService {
    constructor(
        private readonly _productRepository: ProductRepository,
        private readonly _fileUploadService: FileUploadService,
        private readonly _categoryRepository: CategoryRepository,
        private readonly _subCategoryRepository: SubCategoryRepository,
        private readonly _brandRepository: BrandRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    //----------------------------------------------------------------------------------------------------------------

    // create product
    async createProduct(body: CreateProductDto, user: UserDocument, files: { mainImage: Express.Multer.File[], subImages: Express.Multer.File[] }) {
        const {name, description, category, subCategory, brand, price, discount, stock, quantity} = body;

        // check if category exist
        const categoryExist = await this._categoryRepository.findOne({filter: {_id: category}});
        if (!categoryExist) {
            throw new NotFoundException("Category not found");
        }        

        // check if subcategory exist
        const subCategoryExist = await this._subCategoryRepository.findOne({filter: {_id: subCategory}});
        if (!subCategoryExist) {
            throw new NotFoundException("Subcategory not found");
        }

        // check if brand exist
        const brandExist = await this._brandRepository.findOne({filter: {_id: brand}});
        if (!brandExist) {
            throw new NotFoundException("Brand not found");
        }

        if (!files.mainImage) {
            throw new BadRequestException("Main image is required");
        }
        const customId = Math.random().toString(36).substring(2, 7);
        const {secure_url, public_id} = await this._fileUploadService.uploadFile(files.mainImage[0], {
            folder: `${process.env.CLOUDINARY_FOLDER}/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/brands/${brandExist.customId}/products/${customId}/mainImage`
        })

        let subImages: {secure_url: string, public_id: string}[] = [];
        if (files.subImages) {
            const arrayOfImages = await this._fileUploadService.uploadFiles(files.subImages, {
                folder: `${process.env.CLOUDINARY_FOLDER}/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/brands/${brandExist.customId}/products/${customId}/subImages`
            })
            subImages.push(...arrayOfImages)
        }

        const subPrice = price - (price * ((discount || 0) / 100));

        // creaet product 
        const product = await this._productRepository.create({
            name,
            description,
            category: Types.ObjectId.createFromHexString(category),
            subCategory: Types.ObjectId.createFromHexString(subCategory),
            brand: Types.ObjectId.createFromHexString(brand),
            price,
            discount,
            subPrice,
            stock,
            quantity,
            mainImage: {secure_url, public_id},
            subImages,
            customId,
            userId: user._id
        })
        return {
            message: "Product created successfully", product
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // update product
    async updateProduct(
        body: UpdateProductDto, 
        user: UserDocument, 
        files: { mainImage: Express.Multer.File[], subImages: Express.Multer.File[]}, 
        productId: Types.ObjectId
    ) {
        const {name, description, price, discount, stock, quantity} = body || {};

        // check if product exist
        const product = await this._productRepository.findOne({
            filter: {_id: productId, userId: user._id}, 
            populate: [
                {path: "category"},
                {path: "subCategory"},
                {path: "brand"}
            ]
        });
        if (!product) {
            throw new NotFoundException("Product not found or not authorized to update");
        }

        if (!name && !description && !price && !discount && !stock && !quantity && (!files || (!files.subImages && !files.mainImage))) {
            throw new BadRequestException("Please enter a field to update");
            
        }

        if (name) {
            if (product.name.toLowerCase() == name.toLowerCase()) {
                throw new BadRequestException("The name is the same, please enter a different name");
            }
            product.name = name
            product.slug = slugify(name, {
                lower: true,
                trim: true,
                replacement: '-'
            })
        }

        if (description) {
            product.description = description
        }

        if (files.mainImage) {
            if (product?.mainImage?.public_id) {
                await this._fileUploadService.deleteFile(product.mainImage.public_id)
            }
            const {secure_url, public_id} = await this._fileUploadService.uploadFile(files.mainImage[0], {
                folder: `${process.env.CLOUDINARY_FOLDER}/categories/${product.category["customId"]}/subCategories/${product.subCategory["customId"]}/brands/${product.brand["customId"]}/products/${product.customId}/mainImage`
            })
            product.mainImage = {secure_url, public_id}
        }


        let subImages: {secure_url: string, public_id: string}[] = [];
        if (files.subImages) {
            if (product?.subImages?.length) {
                await this._fileUploadService.deleteFolder(
                    `${process.env.CLOUDINARY_FOLDER}/categories/${product.category["customId"]}/subCategories/${product.subCategory["customId"]}/brands/${product.brand["customId"]}/products/${product.customId}/subImages`
                )
            }
            const arrayOfImages = await this._fileUploadService.uploadFiles(files.subImages, {
                folder: `${process.env.CLOUDINARY_FOLDER}/categories/${product.category["customId"]}/subCategories/${product.subCategory["customId"]}/brands/${product.brand["customId"]}/products/${product.customId}/subImages`
            })
            subImages.push(...arrayOfImages)
            product.subImages = subImages
        }

        if (price && discount) {
            product.subPrice = price - (price * ((discount || 0) / 100));
            product.price = price
            product.discount = discount
        } else if (price) {
            product.subPrice = price - (price * ((product.discount || 0) / 100));
            product.price = price
        } else if (discount) {
            product.subPrice = product.price - (product.price * ((discount || 0) / 100));
            product.discount = discount
        }

        if (quantity) {
            product.quantity = quantity
        }

        if (stock) {
            if (stock > product.quantity) {
                throw new BadRequestException("The stock mustn't be greater than the quantity");
            }
            product.stock = stock
        }

        await product.save();
        return {
            message: "Product updated successfully", product
        };
    }

    //----------------------------------------------------------------------------------------------------------------
    
    // delete product
    async deleteProduct(user: UserDocument, id: Types.ObjectId) {
        const product = await this._productRepository.findOne({
            filter: {
                _id: id,
                userId: user._id,
            },
            populate: [
                {path: "category"},
                {path: "subCategory"},
                {path: "brand"}
            ]
        });
        if (!product) {
            throw new NotFoundException("Product not found or not authorized to delete");
        }

        await this._productRepository.findOneAndDelete({
            _id: id,
            userId: user._id,
        });

        if (product?.mainImage || product?.subImages) {
            await this._fileUploadService.deleteFolder(
                `${process.env.CLOUDINARY_FOLDER}/categories/${product.category["customId"]}/subCategories/${product.subCategory["customId"]}/brands/${product.brand["customId"]}/products/${product.customId}`,
            );
        }
        return {
            message: "Product deleted successfully"
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // get all products
    async getAllProducts(query: QueryDto) {
        const {name, select, sort, page} = query;

        let filterObj: FilterQuery<ProductDocument> = {};
        if (name) {
            filterObj = {
                $or: [
                    {name: {$regex: name, $options: "i"}},
                    {slug: {$regex: name, $options: "i"}}
                ]
            }
        }
        const products = await this._productRepository.find({
            filter: filterObj, 
            populate: [
                {path: "category", select: "name"},
                {path: "subCategory", select: "name"},
                {path: "brand", select: "name"},
            ],
            sort,
            select,
            page
        });
        return {products};
    }
}
