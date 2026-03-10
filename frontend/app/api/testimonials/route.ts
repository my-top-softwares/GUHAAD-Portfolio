import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/lib/models/Testimonial";
import { adminProtect } from "@/lib/auth";

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export async function GET() {
    await connectDB();
    try {
        const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
        return NextResponse.json(testimonials);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export async function POST(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const body = await req.json();
        const testimonial = new Testimonial(body);
        const createdTestimonial = await testimonial.save();
        return NextResponse.json(createdTestimonial, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
