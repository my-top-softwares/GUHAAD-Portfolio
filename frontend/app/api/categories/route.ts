import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import Category from "@/lib/models/Category";
import { adminProtect } from "@/lib/auth";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export async function GET() {
    await connectDB();
    try {
        const categories = await Category.find({});
        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export async function POST(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const body = await req.json();
        const category = new Category(body);
        const createdCategory = await category.save();
        return NextResponse.json(createdCategory, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
