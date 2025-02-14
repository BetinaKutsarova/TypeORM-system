interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

type Entity<T> = T & BaseEntity;

export { BaseEntity, Entity };