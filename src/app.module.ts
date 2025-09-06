import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController],
  // El Orden de los guards importa ya que primero se ejecuta el AuthGuard y luego el RolesGuard
  // AuthGuard guarda el usuario en el request y luego el RolesGuard lo usa para verificar los roles
  providers: [
    AppService,
    // para proteger todas las rutas de la application
    // si quiero rutas de modulos particulares declaro el guard en ese modulo, aca se protege todos los modulos
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
