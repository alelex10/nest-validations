import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    // para proteger todas las rutas de la application
    // si quiero rutas de modulos particulares declaro el guard en ese modulo, aca se protege todos los modulos
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
