import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL
    },
    link: {
        type: String, // Project URL
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    likes: {
        type: Number,
        default: 0,
    },
    technologies: [{
        type: String,
    }],
    gallery: [{
        type: String, // URLs for more photos or videos
    }],
}, {
    timestamps: true,
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
