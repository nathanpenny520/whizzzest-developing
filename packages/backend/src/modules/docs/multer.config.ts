import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import type { Request } from 'express'

export const DOCS_UPLOAD_DIR = join(process.cwd(), 'uploads', 'docs')

export const docsMulterOptions = {
  storage: diskStorage({
    destination: (
      _req: Request,
      _file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      if (!existsSync(DOCS_UPLOAD_DIR)) mkdirSync(DOCS_UPLOAD_DIR, { recursive: true })
      cb(null, DOCS_UPLOAD_DIR)
    },
    filename: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, unique + extname(file.originalname))
    },
  }),
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype.match(/^image\//)) {
      cb(new Error('Only image files are allowed'), false)
    } else {
      cb(null, true)
    }
  },
}
