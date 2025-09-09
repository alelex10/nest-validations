import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from 'src/auth/enums/rol.enum';
import * as bcrypt from 'bcrypt';

// This should be a real class/interface representing a user entity
type UsersProvider = () => Promise<User[]>;
@Injectable()
export class UserService {
  // simulate database
  private readonly users: UsersProvider = async () => [
    {
      userId: 1,
      username: 'john',
      password: await bcrypt.hash('123123', 10),
      roles: [Role.User],
    },
    {
      userId: 2,
      username: 'maria',
      password: await bcrypt.hash('secret', 10),
      roles: [Role.Admin],
    },
  ];

  async getAllUsers(): Promise<User[]> {
    return this.users();
  }

  async findOne(username: string): Promise<User | undefined> {
    const allUsers = await this.getAllUsers();
    return allUsers.find((user) => user.username === username);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
