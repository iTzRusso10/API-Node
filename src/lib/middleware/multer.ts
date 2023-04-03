import multer from "multer";

export const multerOptions = {};
export const initMulterMiddlware = () => {
    return multer(multerOptions);
}