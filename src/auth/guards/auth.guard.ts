
import {
  CanActivate,          // Interfaz que los guardas deben implementar
  ExecutionContext,     // Proporciona información sobre el contexto de ejecución actual (solicitud, respuesta, etc.)
  Injectable,           // Decorador para hacer que la clase sea inyectable
  UnauthorizedException,// Excepción HTTP para respuestas 401 Unauthorized
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Servicio para manejar JSON Web Tokens
import { jwtConstants } from '../constants'; // Constantes que contienen la clave secreta del JWT
import { Request } from 'express';          // Tipo para el objeto de solicitud de Express
import { Reflector } from '@nestjs/core';   // Utilidad para leer metadatos de decoradores
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'; // Clave para identificar rutas públicas (sin autenticación)


@Injectable() // Marca esta clase como un proveedor inyectable
export class AuthGuard implements CanActivate { // Implementa CanActivate para ser un guarda
  constructor(private jwtService: JwtService, private reflector: Reflector) {}
  // Inyecta JwtService para verificar tokens y Reflector para leer metadatos

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Método principal del guarda, decide si la solicitud puede continuar
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Obtiene el metadato del manejador de la ruta (método del controlador)
      context.getClass(),   // Obtiene el metadato de la clase del controlador
    ]);

    console.log({ isPublic });
    if (isPublic) {
      // Si la ruta está marcada como pública, permite el acceso inmediatamente
      return true;
    }

    const request = context.switchToHttp().getRequest(); // Obtiene el objeto de solicitud HTTP
    const token = this.extractTokenFromHeader(request); // Intenta extraer el token del encabezado
    if (!token) {
      // Si no hay token, lanza una excepción de no autorizado
      throw new UnauthorizedException();
    }
    try {
      // Verifica el token usando el servicio JWT y la clave secreta
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // Adjunta la carga útil (payload) del token (información del usuario) al objeto de solicitud
      request['user'] = payload;
    } catch {
      // Si el token es inválido o ha expirado, lanza una excepción de no autorizado
      throw new UnauthorizedException();
    }
    return true; // Si el token es válido, permite que la solicitud continúe
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Método auxiliar para extraer el token 'Bearer' del encabezado de autorización
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // Divide "Bearer <token>" en ['Bearer', '<token>']
    return type === 'Bearer' ? token : undefined; // Devuelve el token si es de tipo 'Bearer'
  }
}