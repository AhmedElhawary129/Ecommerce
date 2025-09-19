import { Injectable } from "@nestjs/common";
import { cloudinaryConfig } from "../cloudinary/cloudinary";
import { UploadApiOptions } from "cloudinary";
import { Express } from "express";


@Injectable()
export class FileUploadService {
    constructor() {}
    private _cloudinary = cloudinaryConfig()

    async uploadFile(file: Express.Multer.File, opthoins: UploadApiOptions) {
        return await this._cloudinary.uploader.upload(file.path, opthoins)
    }

    //----------------------------------------------------------------------------------------------------------------

    async uploadFiles(files: Express.Multer.File[], opthoins: UploadApiOptions) {
        let attachments: {secure_url: string, public_id: string}[] = []
        for (const file of files) {
            const {secure_url, public_id} = await this.uploadFile(file, opthoins)
            attachments.push({secure_url, public_id})
        }
        return attachments
    }

    //----------------------------------------------------------------------------------------------------------------

    async deleteFile(public_id: string) {
        return await this._cloudinary.uploader.destroy(public_id)
    }

    //----------------------------------------------------------------------------------------------------------------

    async deleteFolder(filePath: string) {
        await this._cloudinary.api.delete_resources_by_prefix(filePath)
        await this._cloudinary.api.delete_folder(filePath)
    }
}