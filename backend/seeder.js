import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import connectDB from "./config/dbconfig.js";

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();

        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            password: "password123",
        });

        console.log("Data Imported! Admin User created: admin@example.com / password123");
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === "-d") {
    // destroyData(); // Not implemented to be safe
} else {
    importData();
}
