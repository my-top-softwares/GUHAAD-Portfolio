import Message from "../models/messageModel.js";
import Settings from "../models/settingsModel.js";
import nodemailer from "nodemailer";

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    try {
        const newMessage = new Message({
            name,
            email,
            phone,
            subject,
            message,
        });

        const createdMessage = await newMessage.save();

        // Fetch dynamic settings from database
        const dbSettings = await Settings.findOne();

        const emailUser = dbSettings?.emailUser || process.env.EMAIL_USER;
        const emailPass = dbSettings?.emailPass || process.env.EMAIL_PASS;
        const notificationEmail = dbSettings?.notificationEmail || process.env.NOTIFICATION_EMAIL || "faysalmohamed710@gmail.com";

        // Send email notification
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use SSL
            auth: {
                user: emailUser,
                pass: emailPass,
            },
            tls: {
                rejectUnauthorized: false
            }
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
                        <p style="color: #64748b; font-size: 14px;">You have received a new message from your portfolio website.</p>
                    </div>
                    
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><strong>👤 Name:</strong> ${name}</p>
                        <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>📞 Phone:</strong> ${phone || "Not provided"}</p>
                        <p style="margin: 5px 0;"><strong>📝 Subject:</strong> ${subject}</p>
                    </div>

                    <div style="padding: 15px; border-left: 4px solid #3b82f6; background-color: #eff6ff; border-radius: 4px;">
                        <p style="margin: 0; font-weight: bold; color: #1e40af; margin-bottom: 10px;">Message:</p>
                        <p style="margin: 0; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</p>
                    </div>

                    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8;">
                        <p>This email was sent automatically from your Portfolio System.</p>
                    </div>
                </div>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("✅ SUCCESS: Email sent to", notificationEmail);
        } catch (emailError) {
            console.error("❌ FAILED TO SEND EMAIL:");
            console.error("   Reason:", emailError.message);
            console.error("   Current Config -> USER:", emailUser, "| PASS:", emailPass ? "Configured" : "NOT CONFIGURED");
            console.log("   👉 TIP: Please generate a 16-character 'App Password' from Google and check settings in Dashboard.");
        }

        res.status(201).json(createdMessage);
    } catch (error) {
        console.error("❌ DATABASE ERROR:", error.message);
        res.status(500).json({ message: "System error: Failed to save message." });
    }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (message) {
            res.json({ message: "Message removed" });
        } else {
            res.status(404).json({ message: "Message not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a message status (mark as read)
// @route   PUT /api/messages/:id
// @access  Private/Admin
const updateMessageStatus = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (message) {
            message.isRead = !message.isRead;
            const updatedMessage = await message.save();
            res.json(updatedMessage);
        } else {
            res.status(404).json({ message: "Message not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete all messages
// @route   DELETE /api/messages
// @access  Private/Admin
const deleteAllMessages = async (req, res) => {
    try {
        await Message.deleteMany({});
        res.json({ message: "All messages removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createMessage, getMessages, deleteMessage, updateMessageStatus, deleteAllMessages };
