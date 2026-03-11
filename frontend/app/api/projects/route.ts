import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import { adminProtect } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
    await connectDB();
    try {
        const projects = await Project.find({}).populate("category").sort({ createdAt: -1 });
        return NextResponse.json(projects);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();

    try {
        const formData = await req.formData();

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const link = formData.get("link") as string;
        const technologies = formData.get("technologies") ? JSON.parse(formData.get("technologies") as string) : [];

        // Handle Main Media Upload
        let mainMedia = { url: "", type: "image" };
        const mainMediaFile = formData.get("mainMediaFile") as File;

        if (mainMediaFile && typeof mainMediaFile !== 'string') {
            const buffer = Buffer.from(await mainMediaFile.arrayBuffer());
            const fileName = `${uuidv4()}-${mainMediaFile.name}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads");

            // Ensure directory exists
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (err) { }

            await writeFile(path.join(uploadDir, fileName), buffer);

            const isVideo = mainMediaFile.type.startsWith("video/");
            mainMedia = {
                url: `/uploads/${fileName}`,
                type: isVideo ? "video" : "image"
            };
        } else if (formData.get("mainMediaUrl")) {
            mainMedia = {
                url: formData.get("mainMediaUrl") as string,
                type: (formData.get("mainMediaType") as "image" | "video") || "image"
            };
        }

        // Handle Gallery Uploads
        let gallery: any[] = [];

        // Handle existing gallery items (if any, as URLs)
        const existingGallery = formData.get("existingGallery") ? JSON.parse(formData.get("existingGallery") as string) : [];
        gallery = [...existingGallery];

        // Handle new gallery files
        const galleryFiles = formData.getAll("galleryFiles") as File[];
        for (const file of galleryFiles) {
            if (typeof file !== 'string') {
                const buffer = Buffer.from(await file.arrayBuffer());
                const fileName = `${uuidv4()}-${file.name}`;
                const uploadDir = path.join(process.cwd(), "public", "uploads");

                try {
                    await mkdir(uploadDir, { recursive: true });
                } catch (err) { }

                await writeFile(path.join(uploadDir, fileName), buffer);

                const isVideo = file.type.startsWith("video/");
                gallery.push({
                    url: `/uploads/${fileName}`,
                    type: isVideo ? "video" : "image"
                });
            }
        }

        const project = new Project({
            title,
            description,
            category,
            link,
            technologies,
            mainMedia,
            gallery,
            inGallery: formData.get("inGallery") === "true"
        });

        const createdProject = await project.save();
        return NextResponse.json(createdProject, { status: 201 });
    } catch (error: any) {
        console.error("POST Project Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
