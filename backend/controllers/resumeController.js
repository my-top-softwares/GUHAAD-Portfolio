import Resume from "../models/resumeModel.js";

// @desc    Get all resume items (experiences and education)
// @route   GET /api/resume
// @access  Public
const getResumeItems = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const items = await Resume.find(filter).sort({ order: 1, createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a resume item
// @route   POST /api/resume
// @access  Private/Admin
const createResumeItem = async (req, res) => {
    const { title, organization, duration, description, type, order } = req.body;
    try {
        const item = new Resume({
            title,
            organization,
            duration,
            description,
            type,
            order
        });
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a resume item
// @route   PUT /api/resume/:id
// @access  Private/Admin
const updateResumeItem = async (req, res) => {
    const { title, organization, duration, description, type, order } = req.body;
    try {
        const item = await Resume.findById(req.params.id);
        if (item) {
            item.title = title || item.title;
            item.organization = organization || item.organization;
            item.duration = duration || item.duration;
            item.description = description || item.description;
            item.type = type || item.type;
            item.order = order !== undefined ? order : item.order;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: "Resume item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a resume item
// @route   DELETE /api/resume/:id
// @access  Private/Admin
const deleteResumeItem = async (req, res) => {
    try {
        const item = await Resume.findByIdAndDelete(req.params.id);
        if (item) {
            res.json({ message: "Resume item removed" });
        } else {
            res.status(404).json({ message: "Resume item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getResumeItems, createResumeItem, updateResumeItem, deleteResumeItem };
