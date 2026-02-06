import mongoose from "mongoose";

const resumeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['experience', 'education'],
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
