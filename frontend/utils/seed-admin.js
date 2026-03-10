// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const MONGO_URI = "mongodb+srv://pheyzalmoha:pheyzalmoha@mydatabase.3zyvtwn.mongodb.net/AminoPortfolio?retryWrites=true&w=majority";

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["admin", "employee"], default: "employee" },
//     isActive: { type: Boolean, default: true },
// }, { timestamps: true });

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next();
//         return;
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// const seedAdmin = async () => {
//     try {
//         await mongoose.connect(MONGO_URI);
//         console.log("MongoDB Connected...");

//         const adminExists = await User.findOne({ email: "admin@gmail.com" });

//         if (adminExists) {
//             console.log("Admin user already exists. Updating to ensure role is admin...");
//             adminExists.role = "admin";
//             adminExists.name = "Admin User";
//             adminExists.password = "password123";
//             await adminExists.save();
//             console.log("Admin user updated successfully!");
//         } else {
//             console.log("Creating new admin user...");
//             await User.create({
//                 name: "Admin User",
//                 email: "admin@gmail.com",
//                 password: "password123",
//                 role: "admin",
//                 isActive: true
//             });
//             console.log("Admin user created successfully!");
//         }

//         console.log("-----------------------------------------");
//         console.log("Email: admin@gmail.com");
//         console.log("Password: password123");
//         console.log("-----------------------------------------");

//         process.exit();
//     } catch (error) {
//         console.error("Error seeding admin:", error);
//         process.exit(1);
//     }
// };

// seedAdmin();
