import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import type { Request } from 'express'
import { DocsService } from './docs.service.js'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { RolesGuard } from '../../common/guards/roles.guard.js'
import { Roles } from '../../common/decorators/roles.decorator.js'
import { UserRole } from '@prisma/client'

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'docs')

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Get()
  async findAll(): Promise<{ code: number; data: unknown; message: string }> {
    const data = await this.docsService.findAll()
    return { code: 0, data, message: 'ok' }
  }

  @Get(':slug')
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<{ code: number; data: unknown; message: string }> {
    const data = await this.docsService.findBySlug(slug)
    if (!data) return { code: 404, data: null, message: 'not found' }
    return { code: 0, data, message: 'ok' }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body()
    body: {
      slug: string
      title: string
      titleEn?: string
      content: string
      contentEn?: string
      coverImage?: string
      category?: string
      order?: number
    },
  ): Promise<{ code: number; data: unknown; message: string }> {
    if (!body.slug?.trim()) throw new BadRequestException('slug is required')
    const data = await this.docsService.create(body)
    return { code: 0, data, message: 'created' }
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('slug') slug: string,
    @Body()
    body: {
      title?: string
      titleEn?: string
      content?: string
      contentEn?: string
      coverImage?: string
      category?: string
      order?: number
    },
  ): Promise<{ code: number; data: unknown; message: string }> {
    const data = await this.docsService.update(slug, body)
    return { code: 0, data, message: 'updated' }
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('slug') slug: string,
  ): Promise<{ code: number; data: null; message: string }> {
    await this.docsService.remove(slug)
    return { code: 0, data: null, message: 'deleted' }
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (
          _req: Request,
          _file: Express.Multer.File,
          cb: (error: Error | null, destination: string) => void,
        ) => {
          if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true })
          cb(null, UPLOAD_DIR)
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
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ code: number; data: { url: string }; message: string }> {
    const url = `/uploads/docs/${file.filename}`
    return { code: 0, data: { url }, message: 'uploaded' }
  }
}
