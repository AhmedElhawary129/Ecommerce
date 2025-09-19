import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { CategoryDocument, UserDocument } from "src/DB/models";
import { BrandRepository, CategoryRepository, ProductRepository, SubCategoryRepository } from "src/DB/repository/index";
import { Express } from "express";
import { FileUploadService } from "src/common/service/fileUpload.service";
import { FilterQuery, Types } from "mongoose";
import slugify from "slugify";
import { QueryDto } from "../products/dto/product.dto";

@Injectable()
export class CategoryService {
  constructor(
    private readonly _categoryRepository: CategoryRepository,
    private readonly _fileUploadService: FileUploadService,
    private readonly _subCategoryRepository: SubCategoryRepository,
    private readonly _brandRepository: BrandRepository,
    private readonly _productRepository: ProductRepository
  ) {}

  //----------------------------------------------------------------------------------------------------------------

  // create category
  async createCategory(
    body: CreateCategoryDto,
    user: UserDocument,
    file: Express.Multer.File,
  ) {
    const { name } = body;
    const categoryExist = await this._categoryRepository.findOne({
      filter: {
        name: name.toLowerCase()
      }
    });
    if (categoryExist) {
      throw new BadRequestException("Category already exists");
    }

    let dummyData = {
      name,
      userId: user._id,
    };
    const customId = Math.random().toString(36).substring(2, 7);
    if (file) {
      const { secure_url, public_id } =
        await this._fileUploadService.uploadFile(file, {
          folder: `${process.env.CLOUDINARY_FOLDER}/categories/${customId}/mainImage`,
        });
      dummyData["image"] = { secure_url, public_id };
      dummyData["customId"] = customId;
    }
    const category = await this._categoryRepository.create(dummyData);
    return {
      message: "Category created successfully", category
    };
  }

  //----------------------------------------------------------------------------------------------------------------

  // update category
  async updateCategory(
    body: UpdateCategoryDto,
    user: UserDocument,
    file: Express.Multer.File,
    id: Types.ObjectId,
  ) {
    const { name } = body || {};

    const category = await this._categoryRepository.findOne({
      filter: {
        _id: id,
        userId: user._id,
      }
    });
    if (!category) {
      throw new NotFoundException("Category not found or not authorized");
    }

    if (!name && !file) {
      throw new BadRequestException("Please enter a field to update");
      
    }

    if (name) {
      if (
        await this._categoryRepository.findOne({
          filter: {name: name.toLocaleLowerCase()}
        })
      ) {
        throw new BadRequestException("Category already exists");
      }
      category.name = name;
      category.slug = slugify(name, {
        lower: true,
        trim: true,
        replacement: "-",
      });
    }

    if (file) {
      if (category?.image?.public_id) {
        await this._fileUploadService.deleteFile(category.image.public_id);
      }
      const { secure_url, public_id } =
        await this._fileUploadService.uploadFile(file, {
          folder: `${process.env.CLOUDINARY_FOLDER}/categories/${category.customId}/mainImage`,
        });
      category.image = { secure_url, public_id };
    }
    await category.save();
    return {
      message: "Category updated successfully", category
    };
  }

  //----------------------------------------------------------------------------------------------------------------

  // delete category
  async deleteCategory(user: UserDocument, id: Types.ObjectId) {
    const category = await this._categoryRepository.findOne({
      filter: {
        _id: id,
        userId: user._id,
      }
    });
    if (!category) {
      throw new NotFoundException(
        "Category not found or not authorized to delete",
      );
    }

    await this._categoryRepository.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (category?.image) {
      await this._fileUploadService.deleteFolder(
        `${process.env.CLOUDINARY_FOLDER}/categories/${category.customId}`,
      );
    }

    // delete category subcategories
    const subcategories = await this._categoryRepository.find({
      filter: {
        category: category._id,
      }
    })
    if (subcategories) {
      await this._subCategoryRepository.deleteMany({
        category: category._id
      })
    }

    // delete category brands
    const brands = await this._brandRepository.find({
      filter: {
        category: category._id
      }
    })
    if (brands) {
      await this._brandRepository.deleteMany({
        category: category._id
      })
    }

    // delete category products
    const products = await this._productRepository.find({
      filter: {
        category: category._id
      }
    })
    if (products) {
      await this._productRepository.deleteMany({
        category: category._id
      })
    }

    return {
      message: "Category, its subcategories, its brands and its products are deleted successfully"
    };
  }

  //----------------------------------------------------------------------------------------------------------------

  // get all categories
  async getAllCategories(query: QueryDto) {
        const {name, select, sort, page} = query;

        let filterObj: FilterQuery<CategoryDocument> = {};
        if (name) {
            filterObj = {
                $or: [
                    {name: {$regex: name, $options: "i"}},
                    {slug: {$regex: name, $options: "i"}}
                ]
            }
        }
        const categories = await this._categoryRepository.find({
            filter: filterObj, 
            sort,
            select,
            page
        });
        return {categories};
  }
}
