import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module.js'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Serve uploaded files
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' })

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  })

  app.setGlobalPrefix('api/v1')

  const port = process.env.PORT ?? 3002
  await app.listen(port)
  console.log(`NestJS backend running on http://localhost:${port}`)
}

bootstrap()
