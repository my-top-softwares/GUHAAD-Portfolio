import Settings from "../models/settingsModel.js";

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // If no settings exist, return environment variables as default
        if (!settings) {
            settings = {
                emailUser: process.env.EMAIL_USER || "",
                emailPass: process.env.EMAIL_PASS || "",
                notificationEmail: process.env.NOTIFICATION_EMAIL || "",
            };
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update or create settings
// @route   POST /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    const { emailUser, emailPass, notificationEmail } = req.body;

    try {
        let settings = await Settings.findOne();

        if (settings) {
            settings.emailUser = emailUser;
            settings.emailPass = emailPass;
            settings.notificationEmail = notificationEmail;
            const updatedSettings = await settings.save();
            res.json(updatedSettings);
        } else {
            const newSettings = new Settings({
                emailUser,
                emailPass,
                notificationEmail,
            });
            const createdSettings = await newSettings.save();
            res.status(201).json(createdSettings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getSettings, updateSettings };
