import { Entity } from '../types/base';
import { IUser, UserRole } from '../types/user';

class User implements Entity<IUser> {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    email: string;
    role: UserRole;

    constructor(data: IUser) {
        this.id = crypto.randomUUID();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.name = data.name;
        this.email = data.email;
        this.role = data.role;
    }
}

export { User };