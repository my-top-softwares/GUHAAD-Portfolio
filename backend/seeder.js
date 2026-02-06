import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Resume from "./models/resumeModel.js";
import Service from "./models/serviceModel.js";
import Project from "./models/projectModel.js";
import Category from "./models/categoryModel.js";
import Testimonial from "./models/testimonialModel.js";
import connectDB from "./config/dbconfig.js";




dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Resume.deleteMany();
        await Service.deleteMany();
        await Project.deleteMany();
        await Category.deleteMany();
        await Testimonial.deleteMany();


        await Service.create([
            {
                title: "Graphic Design",
                description: "Creative designs for Social Media, Posters, and wide-ranging Marketing Creatives that capture attention.",
                icon: "ux",
                price: 100
            },
            {
                title: "Branding & Identity",
                description: "Complete Brand Systems, Logos, and Guidelines to establish a strong and memorable market presence.",
                icon: "system",
                price: 150
            },
            {
                title: "Motion Graphics & Video",
                description: "High-quality video production and motion graphics that bring your stories to life.",
                icon: "web",
                price: 120
            },
            {
                title: "Content & Voice Over",
                description: "Professional Content Writing and Voice Over Production to convey your message clearly.",
                icon: "wireframe",
                price: 50
            }
        ]);

        await Resume.create([
            {
                title: "Senior Creative Visual Producer",
                organization: "Deero Advert",
                duration: "2021 - Present",
                description: "Leading creative visual production and managing branding & video projects. Overseeing a team of designers and editors to deliver high-quality content.",
                type: "experience",
                order: 1
            },
            {
                title: "CEO & Founder",
                organization: "Guhaad Creatives & Advertisement Agency",
                duration: "2019 - Present",
                description: "Founded and currently managing a creative agency focused on digital marketing, branding, and multimedia production.",
                type: "experience",
                order: 2
            },
            {
                title: "Multimedia Specialist",
                organization: "Freelance",
                duration: "2018 - 2020",
                description: "Worked with multiple clients to produce engaging video content, motion graphics, and comprehensive brand identity packages.",
                type: "experience",
                order: 3
            },
            {
                title: "Bachelor of Multimedia Arts",
                organization: "University of Creative Arts",
                duration: "2015 - 2019",
                description: "Specialized in visual communication, digital media, and interactive design.",
                type: "education",
                order: 1
            },
            {
                title: "Certified Digital Marketer",
                organization: "Google Digital Garage",
                duration: "2020",
                description: "Comprehensive certification in online marketing strategies, SEO, and analytics.",
                type: "education",
                order: 2
            }
        ]);

        const cat1 = await Category.create({ name: "Web Design", color: "#ff014f" });
        const cat2 = await Category.create({ name: "Graphic Design", color: "#3b82f6" });

        await Project.create([
            {
                title: "Inbio Portfolio Design",
                description: "A premium portfolio design with neumorphic style.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
                category: cat1._id,
                likes: 120,
            },
            {
                title: "Brand Motion Graphics",
                description: "Dynamic motion graphics for a tech startup branding.",
                image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60",
                category: cat2._id,
                likes: 85,
            }
        ]);

        await Testimonial.create([
            {
                name: "John Doe",
                position: "Marketing Manager",
                message: "Working with Guhaad was a game changer for our brand. The visual identity they created is stunning.",
                rating: 5,
                image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60"
            }
        ]);


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
