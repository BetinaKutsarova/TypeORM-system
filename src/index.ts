import { Database } from './database/Database';
import { User } from './models/User';
import { UserRole } from './types/user';

const db = new Database<User>();
db.currentUser = new User({
    name: "Admin",
    email: "admin@example.com",
    role: UserRole.ADMIN
});

async function example() {
    try {
        // Create user
        console.log("1. Creating new user...");
        const newUser = await db.create({
            name: "John Doe",
            email: "john@example.com",
            role: UserRole.USER
        });
        console.log("Created user:", newUser);

        // Find user
        console.log("\n2. Finding user by ID...");
        const found = await db.findById(newUser.id);
        console.log("Found user:", found);
        
        if (found) {
            // Update user
            console.log("\n3. Updating user name...");
            const updated = await db.update(found.id, { name: "John Smith" });
            console.log("Updated user:", updated);
        }

        // Delete user
        console.log("\n4. Deleting user...");
        const deleted = await db.delete(newUser.id);
        console.log("User deleted:", deleted);

        // Try to find deleted user
        console.log("\n5. Trying to find deleted user...");
        const shouldBeUndefined = await db.findById(newUser.id);
        console.log("Result after deletion:", shouldBeUndefined);

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Run the example
console.log("Starting example...\n");
example();