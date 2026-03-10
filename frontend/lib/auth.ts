import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "./models/User";
import connectDB from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const generateToken = (id: string) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "30d",
    });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (error) {
        return null;
    }
};

export async function protect(req: NextRequest) {
    let token;

    if (
        req.headers.get("authorization") &&
        req.headers.get("authorization")?.startsWith("Bearer")
    ) {
        try {
            token = req.headers.get("authorization")?.split(" ")[1];
            if (!token) return null;

            const decoded = verifyToken(token);
            if (!decoded) return null;

            await connectDB();
            const user = await User.findById(decoded.id).select("-password");
            return user;
        } catch (error) {
            return null;
        }
    }

    return null;
}

export async function adminProtect(req: NextRequest) {
    const user = await protect(req);
    if (user && user.role === "admin") {
        return user;
    }
    return null;
}
