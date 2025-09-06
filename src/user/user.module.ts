import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  // add <exports UserService> to other modules
  exports: [UserService],
})
export class UserModule {}
