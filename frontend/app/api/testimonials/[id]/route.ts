import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import Testimonial from "@/lib/models/Testimonial";
import { adminProtect } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectDB();
    try {
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
        }
        return NextResponse.json(testimonial);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
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
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updatedTestimonial);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
        }

        await Testimonial.findByIdAndDelete(id);
        return NextResponse.json({ message: "Testimonial removed" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
