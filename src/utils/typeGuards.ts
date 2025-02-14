import { User } from '../models/User';
import { UserRole } from '../types/user';

function isUser(obj: any): obj is User {
    return obj instanceof User &&
           typeof obj.name === 'string' &&
           typeof obj.email === 'string' &&
           Object.values(UserRole).includes(obj.role);
}

export { isUser };