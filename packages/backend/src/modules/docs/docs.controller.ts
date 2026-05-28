import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { DocsService } from './docs.service.js'
import { docsMulterOptions } from './multer.config.js'
import { Public } from '../../common/decorators/public.decorator.js'
import { ErrorCode } from '@wanzai/contracts'

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Get()
  async findAll(): Promise<{ code: number; data: unknown; message: string }> {
    const data = await this.docsService.findAll()
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @Get(':slug')
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<{ code: number; data: unknown; message: string }> {
    const data = await this.docsService.findBySlug(slug)
    if (!data) return { code: ErrorCode.NOT_FOUND, data: null, message: 'not found' }
    return { code: ErrorCode.SUCCESS, data, message: 'ok' }
  }

  @Public()
  @Post()
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
    const data = await this.docsService.create(body)
    return { code: ErrorCode.SUCCESS, data, message: 'created' }
  }

  @Public()
  @Put(':slug')
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
    return { code: ErrorCode.SUCCESS, data, message: 'updated' }
  }

  @Public()
  @Delete(':slug')
  async remove(
    @Param('slug') slug: string,
  ): Promise<{ code: number; data: null; message: string }> {
    await this.docsService.remove(slug)
    return { code: ErrorCode.SUCCESS, data: null, message: 'deleted' }
  }

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', docsMulterOptions))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ code: number; data: { url: string }; message: string }> {
    const url = `/uploads/docs/${file.filename}`
    return { code: ErrorCode.SUCCESS, data: { url }, message: 'uploaded' }
  }
}
