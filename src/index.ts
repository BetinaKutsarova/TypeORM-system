import { Database } from './database/Database';
import { User } from './models/User';
import { UserRole } from './types/user';
import { Post } from './models/Post';
import { Comment } from './models/Comment';

const db = new Database<User>();
const postDb = new Database<Post>();
const commentDb = new Database<Comment>();

async function setupAdmin() {
    const adminUser = await db.create({
        name: "Admin",
        email: "admin@example.com",
        role: UserRole.ADMIN,
        isBanned: false
    });

    db.currentUser = adminUser;
    return adminUser;
}


async function example() {
    try {
        // Set up admin
        console.log("Setting up admin user");
        await setupAdmin();

        // USER CRUD
        console.log("\n1. Creating new user");
        const newUser = await db.create({
            name: "Ivan",
            email: "user@example.com",
            role: UserRole.USER,
            isBanned: false
        });

        // Attempt user creating with an invalid name
        console.log("\n1.1. Attempt to create with an invalid name");
        try {
            await db.create({
                name: "A",
                email: "a@example.com",
                role: UserRole.USER,
                isBanned: false
            });
        } catch(error) {
            console.error("Error creating user with an invalid name:", (error as Error).message)
        }

        // Find user
        console.log("\n2. Finding user by ID");
        const found = await db.findById(newUser.id);

        // Try to ban an existing user
        console.log("\n3. Attempting to ban existing user");
        const banResult = await db.banUser(newUser.id);

        // Try to ban a non-existent user
        console.log("\n4. Attempting to ban non-existent user");
        const invalidBanResult = await db.banUser("invalidUser");

        // Update user
        console.log("\n5. Updating user name");
        const updatedUser = await db.update(newUser.id, { name: "John Smith" });

        // Attempt to update user with an invalid name
        console.log("\n5.5. Attempt to update with an invalid name");
        try {
            await db.update(newUser.id, { name: "J" });
        } catch(error) {
            console.error("Error updating user with an invalid name:", (error as Error).message)
        }

        // Delete user
        console.log("\n6. Deleting user...");
        const deleted = await db.delete(newUser.id);

        // Try to find deleted user
        console.log("\n7. Trying to find deleted user...");
        const shouldBeUndefined = await db.findById(newUser.id);

        // POST AND COMMENT CRUD

        // create user that would post and comment
        console.log("\n8. Creating new user for post and comment");
        const postCommentUser = await db.create({
            name: "John Doe",
            email: "john@example.com",
            role: UserRole.USER,
            isBanned: false
        });

        // Create post by user
        console.log("\n9. Creating new post");
        const newPost = await postDb.create({
            title: "My First Post",
            content: "Hello, this is my first post!",
            authorId: postCommentUser.id
        });

        // Create comment on this post
        console.log("\n10. Creating new comment");
        const newComment = await commentDb.create({
            content: "This is a comment on my own post!",
            authorId: postCommentUser.id,
            postId: newPost.id
        });

        // Find post
        console.log("\n11. Finding post by ID");
        const foundPost = await postDb.findById(newPost.id);

        // Update post
        if (foundPost) {
            console.log("\n12. Updating post title");
            const updatedPost = await postDb.update(foundPost.id, { 
                title: "My Updated Post Title" 
            });
        }

        // Find comment
        console.log("\n13. Finding comment by ID");
        const foundComment = await commentDb.findById(newComment.id);

        // Update comment
        if (foundComment) {
            console.log("\n14. Updating comment content");
            const updatedComment = await commentDb.update(foundComment.id, {
                content: "This is my updated comment!"
            });
        }

    } catch (error) {
        console.error("An error occurred:", (error as Error).message);
    }
}

// Run
(async () => {
    console.log("Starting example\n");
    try {
        await example();
        console.log("\nExample completed!");
    } catch (error) {
        console.error("Error running example:", error);
    }
})();