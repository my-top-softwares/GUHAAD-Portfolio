import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import "@/lib/models/Category";
import { adminProtect } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectDB();
    try {
        const project = await Project.findById(id).populate("category");
        return project
            ? NextResponse.json(project)
            : NextResponse.json({ message: "Project not found" }, { status: 404 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const admin = await adminProtect(req);
    if (!admin) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    await connectDB();
    try {
        const formData = await req.formData();
        const project = await Project.findById(id);
        if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

        const categoryId = formData.get("category") as string;
        if (categoryId) {
            project.category = new mongoose.Types.ObjectId(categoryId) as any;
        }
        project.link = (formData.get("link") as string) || (project.link as string);

        if (formData.has("inGallery")) {
            project.inGallery = formData.get("inGallery") === "true";
        }

        if (formData.get("technologies")) {
            project.technologies = JSON.parse(formData.get("technologies") as string);
        }

        // Handle Main Media
        const mainMediaFile = formData.get("mainMediaFile") as File;
        if (mainMediaFile && typeof mainMediaFile !== 'string') {
            const buffer = Buffer.from(await mainMediaFile.arrayBuffer());
            const fileName = `${uuidv4()}-${mainMediaFile.name}`;
            await writeFile(path.join(process.cwd(), "public", "uploads", fileName), buffer);
            project.mainMedia = {
                url: `/uploads/${fileName}`,
                type: mainMediaFile.type.startsWith("video/") ? "video" : "image"
            };
        } else if (formData.get("mainMediaUrl")) {
            project.mainMedia = {
                url: formData.get("mainMediaUrl") as string,
                type: (formData.get("mainMediaType") as "image" | "video") || "image"
            };
        }

        // Handle Gallery
        const existingGallery = formData.get("existingGallery") ? JSON.parse(formData.get("existingGallery") as string) : [];
        const updatedGallery = [...existingGallery];

        const galleryFiles = formData.getAll("galleryFiles") as File[];
        for (const file of galleryFiles) {
            if (typeof file !== 'string') {
                const buffer = Buffer.from(await file.arrayBuffer());
                const fileName = `${uuidv4()}-${file.name}`;
                await writeFile(path.join(process.cwd(), "public", "uploads", fileName), buffer);
                updatedGallery.push({
                    url: `/uploads/${fileName}`,
                    type: file.type.startsWith("video/") ? "video" : "image"
                });
            }
        }
        project.gallery = updatedGallery as any;

        const updatedProject = await project.save();
        return NextResponse.json(updatedProject);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const admin = await adminProtect(req);
    if (!admin) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

    await connectDB();
    try {
        const project = await Project.findByIdAndDelete(id);
        return project
            ? NextResponse.json({ message: "Project removed" })
            : NextResponse.json({ message: "Project not found" }, { status: 404 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
