import { BaseEntity } from '../types/base';
import { log, requireRole } from '../decorators';
import { UserRole } from '../types/user';
import { User } from '../models/User';

class Database<T extends BaseEntity> {
    private items: Map<string, T>;
    private cache: WeakMap<object, T>;
    currentUser?: User;

    constructor() {
        this.items = new Map();
        this.cache = new WeakMap();
    }

    @log
    async create(item: Omit<T, keyof BaseEntity>): Promise<T> {
        const newItem = {
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        } as T;
        
        this.items.set(newItem.id, newItem);
        return newItem;
    }

    @log
    async findById(id: string): Promise<T | undefined> {
        return this.items.get(id);
    }

    @log
    async update(id: string, data: Partial<T>): Promise<T | undefined> {
        const item = this.items.get(id);
        if (!item) return undefined;

        const updatedItem = {
            ...item,
            ...data,
            updatedAt: new Date(),
        };

        this.items.set(id, updatedItem);
        return updatedItem;
    }

    @log
    @requireRole(UserRole.ADMIN)
    async delete(id: string): Promise<boolean> {
        return this.items.delete(id);
    }

    @log
    @requireRole(UserRole.ADMIN)
    async banUser(userId: string): Promise<{ success: boolean; message: string }> {
        const user = await this.findById(userId);
        
        if (!user) {
            return { 
                success: false, 
                message: `User with ID ${userId} not found` 
            };
        }

        // You can't ban other admins
        if ((user as any).role === UserRole.ADMIN) {
            return { 
                success: false, 
                message: "Cannot ban admin users" 
            };
        }

        // Add banned status
        const bannedUser = await this.update(userId, {
            ...user,
            isBanned: true,
        });

        return { 
            success: true, 
            message: `User ${(bannedUser as any).name} has been banned` 
        };
    }


}

export { Database };