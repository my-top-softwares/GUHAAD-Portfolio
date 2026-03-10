import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/lib/models/Category";
import { adminProtect } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectDB();
    try {
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }
        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const body = await req.json();
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updatedCategory);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        await Category.findByIdAndDelete(id);
        return NextResponse.json({ message: "Category removed" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
