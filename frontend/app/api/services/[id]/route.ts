import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import Service from "@/lib/models/Service";
import { adminProtect } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectDB();
    try {
        const service = await Service.findById(id);
        if (service) {
            return NextResponse.json(service);
        } else {
            return NextResponse.json({ message: "Service not found" }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const body = await req.json();
        const service = await Service.findByIdAndUpdate(id, body, { new: true });
        if (service) {
            return NextResponse.json(service);
        } else {
            return NextResponse.json({ message: "Service not found" }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const service = await Service.findByIdAndDelete(id);
        if (service) {
            return NextResponse.json({ message: "Service removed" });
        } else {
            return NextResponse.json({ message: "Service not found" }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
