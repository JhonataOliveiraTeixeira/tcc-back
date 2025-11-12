import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './application/user/user.module';
import { PrismaModule } from './infra/db/prisma/prisma.module';
import { AuthModule } from './application/auth/auth.module';
import { CertificatesModule } from './application/certificates/certificates.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './application/auth/roles.guard';
import { AuthGuard } from './application/auth/auth.guard';

@Module({
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    
    {
      provide: APP_GUARD,
      useClass: RolesGuard,  // Depois: autoriza roles
    },  
  ],
  imports: [UserModule, PrismaModule, AuthModule, CertificatesModule],
})
export class AppModule {}
