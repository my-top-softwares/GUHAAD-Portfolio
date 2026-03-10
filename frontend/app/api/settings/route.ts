import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Settings from "@/lib/models/Settings";
import { adminProtect } from "@/lib/auth";

// @desc    Get settings
// @route   GET /api/settings
// @access  Private/Admin
export async function GET(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const settings = await Settings.findOne({});
        return NextResponse.json(settings || {});
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Update or create settings
// @route   POST /api/settings
// @access  Private/Admin
export async function POST(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const body = await req.json();
        let settings = await Settings.findOne({});

        if (settings) {
            settings = await Settings.findByIdAndUpdate(settings._id, body, { new: true });
        } else {
            settings = new Settings(body);
            await settings.save();
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
