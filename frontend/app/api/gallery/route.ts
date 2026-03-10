import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Gallery from "@/lib/models/Gallery";
import { adminProtect } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
    await connectDB();
    try {
        const items = await Gallery.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();

    try {
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const category = formData.get("category") as string;
        const featured = formData.get("featured") === "true";
        const mediaFile = formData.get("mediaFile") as File;

        let media = { url: "", type: "image" };

        if (mediaFile && typeof mediaFile !== 'string') {
            const buffer = Buffer.from(await mediaFile.arrayBuffer());
            const fileName = `${uuidv4()}-${mediaFile.name}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");

            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (err) { }

            await writeFile(path.join(uploadDir, fileName), buffer);

            const isVideo = mediaFile.type.startsWith("video/");
            media = {
                url: `/uploads/gallery/${fileName}`,
                type: isVideo ? "video" : "image"
            };
        } else if (formData.get("mediaUrl")) {
            media = {
                url: formData.get("mediaUrl") as string,
                type: ((formData.get("mediaType") as string) as "image" | "video") || "image"
            };
        }

        const item = new Gallery({
            title,
            category,
            featured,
            media
        });

        const createdItem = await item.save();
        return NextResponse.json(createdItem, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
