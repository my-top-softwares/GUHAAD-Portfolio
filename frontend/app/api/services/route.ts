import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import Service from "@/lib/models/Service";
import { adminProtect } from "@/lib/auth";

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export async function GET() {
    await connectDB();
    try {
        const services = await Service.find({});
        return NextResponse.json(services);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
export async function POST(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const body = await req.json();
        const service = new Service(body);
        const createdService = await service.save();
        return NextResponse.json(createdService, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
