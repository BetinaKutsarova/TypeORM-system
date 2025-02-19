import { Entity } from './base';

enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator'
}

interface IUser {
    name: string;
    email: string;
    role: UserRole;
    isBanned?: boolean;
}

export { UserRole, IUser };