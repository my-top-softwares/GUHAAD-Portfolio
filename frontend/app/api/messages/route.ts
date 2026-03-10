import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/lib/models/Message";
import Settings from "@/lib/models/Settings";
import nodemailer from "nodemailer";
import { adminProtect } from "@/lib/auth";

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
export async function GET(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const { name, email, phone, subject, message } = await req.json();
        const newMessage = new Message({ name, email, phone, subject, message });
        const createdMessage = await newMessage.save();

        // Fetch dynamic settings
        const dbSettings = await Settings.findOne();
        const emailUser = dbSettings?.emailUser || process.env.EMAIL_USER;
        const emailPass = dbSettings?.emailPass || process.env.EMAIL_PASS;
        const notificationEmail = dbSettings?.notificationEmail || process.env.NOTIFICATION_EMAIL;

        if (emailUser && emailPass && notificationEmail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: { user: emailUser, pass: emailPass },
                tls: { rejectUnauthorized: false }
            });

            const mailOptions = {
                from: `"Portfolio Notification" <${emailUser}>`,
                replyTo: email,
                to: notificationEmail,
                subject: `🚀 New Message: ${subject}`,
                html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; padding-bottom: 20px;">
                    <h2 style="color: #3b82f6; margin: 0;">New Contact Submission</h2>
                </div>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p><strong>👤 Name:</strong> ${name}</p>
                    <p><strong>📧 Email:</strong> ${email}</p>
                    <p><strong>📞 Phone:</strong> ${phone || "Not provided"}</p>
                    <p><strong>📝 Subject:</strong> ${subject}</p>
                </div>
                <div style="padding: 15px; border-left: 4px solid #3b82f6; background-color: #eff6ff;">
                    <p>${message}</p>
                </div>
            </div>
        `,
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (err) {
                console.error("Email send failed:", err);
            }
        }

        return NextResponse.json(createdMessage, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// @desc    Delete all messages
// @route   DELETE /api/messages
// @access  Private/Admin
export async function DELETE(req: NextRequest) {
    const admin = await adminProtect(req);
    if (!admin) {
        return NextResponse.json({ message: "Not authorized as an admin" }, { status: 401 });
    }

    await connectDB();
    try {
        await Message.deleteMany({});
        return NextResponse.json({ message: "All messages removed" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
