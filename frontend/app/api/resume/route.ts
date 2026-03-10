import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Resume from "@/lib/models/Resume";
import { adminProtect } from "@/lib/auth";

// @desc    Get all resume items
// @route   GET /api/resume
// @access  Public
export async function GET() {
    await connectDB();
    try {
        const resumeItems = await Resume.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(resumeItems);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Create a resume item
// @route   POST /api/resume
// @access  Private/Admin
export async function POST(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const body = await req.json();
        const resumeItem = new Resume(body);
        const createdResumeItem = await resumeItem.save();
        return NextResponse.json(createdResumeItem, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
