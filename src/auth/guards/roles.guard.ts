import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/rol.enum'; // Define los roles posibles (ej. Admin, User, Editor)
import { ROLES_KEY } from '../decorators/roles.decorator'; // Clave para leer los roles requeridos

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // Inyecta Reflector para leer metadatos de los decoradores @Roles()

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtiene los roles requeridos para la ruta/método actual
    // si no hay roles requeridos, la ruta es accesible para todos los usuarios autenticados
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Lee roles del método (ej. @Roles(Role.Admin) en un controlador.delete())
      context.getClass(), // Lee roles de la clase (ej. @Roles(Role.User) en un UserController)
    ]);

    // 2. Si la ruta no requiere roles específicos, permite el acceso.
    if (!requiredRoles) {
      return true;
    }

    // 3. Obtiene la información del usuario del objeto de solicitud
    // ¡Aquí está la CLAVE de la relación! `user` fue puesto allí por el AuthGuard.
    // user tiene la forma { userId: string, username: string, roles: Role[] }
    const { user } = context.switchToHttp().getRequest();

    // 4. Verifica si el usuario está autenticado (aunque AuthGuard ya lo hizo, es una buena práctica defensiva)
    if (!user) {
      // Si no hay información de usuario, significa que AuthGuard no corrió o falló, o la ruta es pública
      // y no se esperaría RolesGuard sin autenticación previa.
      throw new ForbiddenException('Usuario no autenticado'); // Retorna 403 Forbidden
    }

    // 5. Comprueba si el usuario tiene AL MENOS UNO de los roles requeridos
    // `user.roles` debe ser un array de roles adjunto por el AuthGuard.
    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    // `some()` verifica si al menos un elemento en `requiredRoles` está incluido en `user.roles`.

    if (!hasRole) {
      console.log({ user, requiredRoles, hasRole });

      // Si el usuario no tiene ninguno de los roles requeridos, lanza una excepción 403 Forbidden
      throw new ForbiddenException(
        `Se requiere uno de los siguientes roles: ${requiredRoles.join(', ')}`,
      );
    }
    return true; // Si el usuario tiene el rol requerido, permite el acceso
  }
}
