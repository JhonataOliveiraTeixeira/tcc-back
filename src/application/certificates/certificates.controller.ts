import { Controller, Post, UploadedFile, UseInterceptors, Body, UseGuards, Request, BadRequestException, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';  // ← Import para tipo do file
import type { Request as ExpressRequest } from 'express';  // ← Import para tipar req
import { AuthGuard } from '../auth/auth.guard';
import { CertificatesService } from './certificates.service';
import type { UserPayload } from '../auth/types';
import { get } from 'node:http';

interface AuthRequest extends ExpressRequest {  // ← Tipo estendido para req.user
  user: UserPayload;
}

@Controller('certificates')
@UseGuards(AuthGuard) 
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) { }

  @Post('submit')
  @UseInterceptors(FileInterceptor('annex', {  // 'annex' = key no form-data
    limits: { fileSize: 10 * 1024 * 1024 },  // 10MB
    fileFilter: (req: ExpressRequest, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {  // ← Tipos no fileFilter
      if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.mimetype)) {
        return cb(new Error('MIME não permitido'), false);
      }
      cb(null, true);
    },
  }))
  async submit(
    @UploadedFile() file: Express.Multer.File,  // ← Tipo correto
    @Body('title') title: string,
    @Request() req: AuthRequest  // ← Tipado como AuthRequest
  ) {
    const owner = req.user;  // Agora tipado como UserPayload

    if (!file) throw new BadRequestException('Anexo obrigatório');
    if (!title || title.length < 3) throw new BadRequestException('Título inválido');
    console.log('owner', owner);

    return this.certificatesService.submitCertificate(
      title,
      file.buffer,  // Buffer para upload
      file.mimetype,
      owner.id  // ID do owner
    );
  }


  @Get()
  async getAll(@Request() req: AuthRequest) {
    return this.certificatesService.getAll(req.user);
  }

  @Get('/me')
  async listCertificatesByUserId(@Request() req: AuthRequest) {
    return this.certificatesService.listCertificatesByUserId(req.user);
  }
}