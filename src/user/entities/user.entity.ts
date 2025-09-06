import { Role } from "src/auth/enums/rol.enum";

export class User {
    userId: number;
    username: string;
    password: string;
    roles: Role[];
}
