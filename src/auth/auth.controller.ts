import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInRequestDto } from './dtos/sign-in-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInRequestDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  // para proteger la ruta de manera individual
  // el orden de los guards es importante por que AuthGuard debe correr antes que RolesGuard, para poner user en request y que RolesGuard pueda usarlo
  // @UseGuards(AuthGuard, RolesGuard) // no es necesario si el guard se aplica globalmente en app.module.ts
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
