import multer from 'multer'
import path from 'node:path'


const multerStorage = () => multer.memoryStorage()

export const multerMiddleware = () => multer({
  storage: multerStorage(),
  fileFilter: (_req, file, callback) => {
    const fileType = /mp4|mov|avi|wmv|mpg/
    const mimetype = fileType.test(file.mimetype)
    const extname = fileType.test(path.extname(file.originalname))

    if (mimetype && extname) {
      callback(null, true)
    } else {
      callback(new Error('the file must be an image'))
    }
  }
}).single('url')