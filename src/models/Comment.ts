import { Entity } from '../types/base';
import { IComment } from '../types/comment';

class Comment implements Entity<IComment> {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    authorId: string;
    postId: string;

    constructor(data: IComment) {
        this.id = crypto.randomUUID();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.content = data.content;
        this.authorId = data.authorId;
        this.postId = data.postId;
    }
}

export { Comment };