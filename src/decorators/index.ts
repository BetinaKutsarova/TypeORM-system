import { UserRole } from '../types/user';

function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
        console.log(`Calling ${propertyKey} with arguments:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`Method ${propertyKey} returned:`, result);
        return result;
    };
    return descriptor;
}

function requireRole(role: UserRole) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(this: any, ...args: any[]) {
            const user = this.currentUser;
            if (user?.role !== role) {
                throw new Error(`This action requires ${role} role`);
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}

export { log, requireRole };