import { User } from '../models/User';
import { UserRole } from '../types/user';

import { Post } from '../models/Post';
import { Comment } from '../models/Comment';

function isUser(obj: any): obj is User {
    return obj instanceof User &&
           typeof obj.name === 'string' &&
           typeof obj.email === 'string' &&
           Object.values(UserRole).includes(obj.role);
}

function isPost(obj: any): obj is Post {
    return obj instanceof Post &&
           typeof obj.title === 'string' &&
           typeof obj.content === 'string' &&
           typeof obj.authorId === 'string';
}

function isComment(obj: any): obj is Comment {
    return obj instanceof Comment &&
           typeof obj.content === 'string' &&
           typeof obj.authorId === 'string' &&
           typeof obj.postId === 'string';
}

export { isUser, isPost, isComment };