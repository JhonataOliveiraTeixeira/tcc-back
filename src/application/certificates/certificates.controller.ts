import { Controller, Post, UploadedFile, UseInterceptors, Body, UseGuards, Request, BadRequestException, Get, Param, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';  // ← Import para tipo do file
import type { Request as ExpressRequest } from 'express';  // ← Import para tipar req
import { AuthGuard } from '../auth/auth.guard';
import { CertificatesService } from './certificates.service';
import type { UserPayload } from '../auth/types';

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
    @Body({ transform: (data) => ({ ...data, hours: Number(data.hours) }) }) data: {
      title: string,
      hours: number
    },
    @Request() req: AuthRequest  // ← Tipado como AuthRequest
  ) {
    const owner = req.user;  // Agora tipado como UserPayload
    if (req.user.role !== 'STUDENT') throw new BadRequestException('Apenas estudantes podem submeter certificados');

    if (!file) throw new BadRequestException('Anexo obrigatório');
    if (!data.title || data.title.length < 3) throw new BadRequestException('Título inválido');
    console.log('owner', owner);

    return this.certificatesService.submitCertificate(
      data.title,
      data.hours,
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

  @Get('user/:id')
  async getCertificate(@Param('id') id: string) {
    return this.certificatesService.getCertificate(id);
  }

  @Put(':id')
  async adminUpdateCertificate(@Param('id') id: string, @Body() { status }: any) {
    return this.certificatesService.adminUpdateCertificate(id, status);
  }
}