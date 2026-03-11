import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { adminProtect } from "@/lib/auth";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export async function GET(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const users = await User.find({}).select("-password");
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
export async function POST(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const { name, email, password, role, isActive } = await req.json();

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            isActive
        });

        if (user) {
            return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            }, { status: 201 });
        } else {
            return NextResponse.json({ message: "Invalid user data" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

