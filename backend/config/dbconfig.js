import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

// Force use of Google DNS to bypass ISP issues with MongoDB SRV records
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    console.log("DNS servers set to Google DNS (8.8.8.8, 8.8.4.4)");
} catch (e) {
    console.warn("Could not set custom DNS servers, using system default.");
}

dotenv.config();
const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        // Remove trailing slash or spaces if any
        uri = uri.trim();

        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected successfully ✅");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);

        if (error.message.includes("ECONNREFUSED") && error.message.includes("querySrv")) {
            console.error("TIP: This looks like a DNS issue. Try:");
            console.error("1. Check if the cluster hostname is correct (e.g., cluster0.xxxx.mongodb.net)");
            console.error("2. Ensure your IP is whitelisted in MongoDB Atlas");
            console.error("3. Try changing your DNS to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare)");
        }

        process.exit(1);
    }
};

export default connectDB;