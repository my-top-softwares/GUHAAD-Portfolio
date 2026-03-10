import mongoose from "mongoose";
import User from "../lib/models/User";
import dotenv from "dotenv";
import path from "path";

// Load env vars
dotenv.config();

const MONGO_URI = "mongodb+srv://pheyzalmoha:pheyzalmoha@mydatabase.3zyvtwn.mongodb.net/AminoPortfolio?retryWrites=true&w=majority";

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected...");

        const adminExists = await User.findOne({ email: "admin@gmail.com" });

        if (adminExists) {
            console.log("Admin user already exists. Updating to ensure role is admin...");
            adminExists.role = "admin";
            adminExists.name = "Admin User";
            await adminExists.save();
        } else {
            console.log("Creating new admin user...");
            await User.create({
                name: "Admin User",
                email: "admin@gmail.com",
                password: "password123", // Set your preferred password here
                role: "admin",
                isActive: true
            });
            console.log("Admin user created successfully!");
        }

        process.exit();
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
