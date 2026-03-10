import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Resume from "@/lib/models/Resume";
import { adminProtect } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id = "" } = await params;
    await connectDB();
    try {
        const resumeItem = await Resume.findById(id);
        if (!resumeItem) {
            return NextResponse.json({ message: "Resume item not found" }, { status: 404 });
        }
        return NextResponse.json(resumeItem);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Update a resume item
// @route   PUT /api/resume/:id
// @access  Private/Admin
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id = "" } = await params;
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const body = await req.json();
        const resumeItem = await Resume.findById(id);
        if (!resumeItem) {
            return NextResponse.json({ message: "Resume item not found" }, { status: 404 });
        }

        const updatedResumeItem = await Resume.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updatedResumeItem);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Delete a resume item
// @route   DELETE /api/resume/:id
// @access  Private/Admin
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id = "" } = await params;
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const resumeItem = await Resume.findById(id);
        if (!resumeItem) {
            return NextResponse.json({ message: "Resume item not found" }, { status: 404 });
        }

        await Resume.findByIdAndDelete(id);
        return NextResponse.json({ message: "Resume item removed" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
