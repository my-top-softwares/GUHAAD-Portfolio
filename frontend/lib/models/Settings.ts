import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    emailUser: {
        type: String,
        required: true,
    },
    emailPass: {
        type: String,
        required: true,
    },
    notificationEmail: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
