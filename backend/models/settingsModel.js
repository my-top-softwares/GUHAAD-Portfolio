import mongoose from "mongoose";

const settingsSchema = mongoose.Schema({
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

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
