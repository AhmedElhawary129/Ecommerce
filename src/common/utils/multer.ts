import { BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { diskStorage } from "multer";
import { Express } from "express";
import * as path from "path"
import * as fs from "fs"

interface MulterOptions {
    uploadPath: string,
    allowedExtensions: string[]
}


export const multerConfig = ({uploadPath = "Generals", allowedExtensions}: MulterOptions) => {
    const storage = diskStorage({
        destination: (req, file, cb) => { 
            const destPath = path.resolve(`Uploads/${uploadPath}`)
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, {recursive: true})
            }
            cb(null, destPath); 
        },
        filename: (req, file, cb) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
    })
    const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
        if (!allowedExtensions.includes(file.mimetype)) {
            return cb(new BadRequestException("Invalid file type"), false);
        }
        cb(null, true);
    }
    return {storage, fileFilter}
}