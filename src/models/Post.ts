import { Entity } from '../types/base';
import { IPost } from '../types/post';

class Post implements Entity<IPost> {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
    authorId: string;



    constructor(data: IPost) {
        this.id = crypto.randomUUID();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.title = data.title;
        this.content = data.content;
        this.authorId = data.authorId;
    }
}

export { Post };