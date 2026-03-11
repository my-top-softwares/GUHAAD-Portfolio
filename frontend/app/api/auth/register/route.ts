import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const { name, email, password } = await req.json();
        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            }, { status: 201 });
        } else {
            return NextResponse.json({ message: "Invalid user data" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
