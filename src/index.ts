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
        console.log("Setting up admin user...");
        await setupAdmin();
        console.log("Admin user set up complete");

        // USER CRUD
        console.log("\n1. Creating new user...");
        const newUser = await db.create({
            name: "Ivan",
            email: "user@example.com",
            role: UserRole.USER,
            isBanned: false
        });
        console.log("Created user:", newUser.name);

        // Find user
        console.log("\n2. Finding user by ID...");
        const found = await db.findById(newUser.id);
        console.log("Found user:", found);

        // Try to ban an existing user
        console.log("\n3. Attempting to ban existing user...");
        const banResult = await db.banUser(newUser.id);
        console.log("Valid user ban attempt:", banResult);

        // Try to ban a non-existent user
        console.log("\n4. Attempting to ban non-existent user...");
        const invalidBanResult = await db.banUser("invalidUser");
        console.log("Invalid user ban attempt:", invalidBanResult);

        // Update user
        console.log("\n5. Updating user name...");
        const updatedUser = await db.update(newUser.id, { name: "John Smith" });
        console.log("Updated user:", updatedUser);

        // Delete user
        console.log("\n6. Deleting user...");
        const deleted = await db.delete(newUser.id);
        console.log("User deleted:", deleted);

        // Try to find deleted user
        console.log("\n7. Trying to find deleted user...");
        const shouldBeUndefined = await db.findById(newUser.id);
        console.log("Result after deletion:", shouldBeUndefined);

        // POST AND COMMENT CRUD

        // create user that would post and comment
        console.log("\n8. Creating new user for post and comment...");
        const postCommentUser = await db.create({
            name: "John Doe",
            email: "john@example.com",
            role: UserRole.USER,
            isBanned: false
        });
        console.log("Created user:", postCommentUser);

        // Create post by user
        console.log("\n9. Creating new post...");
        const newPost = await postDb.create({
            title: "My First Post",
            content: "Hello, this is my first post!",
            authorId: postCommentUser.id
        });
        console.log("Created post:", newPost);

        // Create comment on this post
        console.log("\n10. Creating new comment...");
        const newComment = await commentDb.create({
            content: "This is a comment on my own post!",
            authorId: postCommentUser.id,
            postId: newPost.id  // Fixed: Using post ID instead of user ID
        });
        console.log("Created comment:", newComment);

        // Find post
        console.log("\n11. Finding post by ID...");
        const foundPost = await postDb.findById(newPost.id);
        console.log("Found post:", foundPost);

        // Update post
        if (foundPost) {
            console.log("\n12. Updating post title...");
            const updatedPost = await postDb.update(foundPost.id, { 
                title: "My Updated Post Title" 
            });
            console.log("Updated post:", updatedPost);
        }

        // Find comment
        console.log("\n13. Finding comment by ID...");
        const foundComment = await commentDb.findById(newComment.id);
        console.log("Found comment:", foundComment);

        // Update comment
        if (foundComment) {
            console.log("\n14. Updating comment content...");
            const updatedComment = await commentDb.update(foundComment.id, {
                content: "This is my updated comment!"
            });
            console.log("Updated comment:", updatedComment);
        }

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Run
(async () => {
    console.log("Starting example...\n");
    try {
        await example();
        console.log("\nExample completed!");
    } catch (error) {
        console.error("Error running example:", error);
    }
})();