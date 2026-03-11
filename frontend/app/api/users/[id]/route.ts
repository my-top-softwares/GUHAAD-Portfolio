import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { adminProtect } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const { name, email, password, role, isActive } = await req.json();

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.isActive = isActive !== undefined ? isActive : user.isActive;

        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();
        return NextResponse.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isActive: updatedUser.isActive,
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    // Prevent admin from deleting themselves
    if (admin._id.toString() === id) {
        return NextResponse.json({ message: "You cannot delete yourself" }, { status: 400 });
    }

    await connectDB();
    try {
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: "User removed" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
