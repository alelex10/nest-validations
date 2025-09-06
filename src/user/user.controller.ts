import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/rol.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get("hello")
  helloUser() {
    return 'Hello User';
  }

  @Get("hello-admin")
  @Roles(Role.Admin) // permite acceso solo a usuarios con rol Admin
  helloAdmin() {
    return 'Hello Admin';
  }
}
