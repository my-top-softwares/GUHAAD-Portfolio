import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import Gallery from "@/lib/models/Gallery";
import { adminProtect } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
        const item = await Gallery.findById(id);
        if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

        item.title = (formData.get("title") as string) || item.title;
        item.category = (formData.get("category") as string) || item.category;

        if (formData.has("featured")) {
            item.featured = formData.get("featured") === "true";
        }

        const mediaFile = formData.get("mediaFile") as File;
        if (mediaFile && typeof mediaFile !== 'string') {
            const buffer = Buffer.from(await mediaFile.arrayBuffer());
            const fileName = `${uuidv4()}-${mediaFile.name}`;
            await writeFile(path.join(process.cwd(), "public", "uploads", "gallery", fileName), buffer);
            item.media = {
                url: `/uploads/gallery/${fileName}`,
                type: mediaFile.type.startsWith("video/") ? "video" : "image"
            };
        } else if (formData.get("mediaUrl")) {
            item.media = {
                url: formData.get("mediaUrl") as string,
                type: ((formData.get("mediaType") as string) as "image" | "video") || "image"
            };
        }

        const updatedItem = await item.save();
        return NextResponse.json(updatedItem);
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
        const item = await Gallery.findByIdAndDelete(id);
        return item
            ? NextResponse.json({ message: "Item removed" })
            : NextResponse.json({ message: "Item not found" }, { status: 404 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
