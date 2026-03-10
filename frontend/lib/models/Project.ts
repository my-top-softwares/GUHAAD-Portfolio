import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true }
}, { _id: false });

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    likes: {
        type: Number,
        default: 0
    },

    // Main Image or Video
    mainMedia: mediaSchema,

    link: {
        type: String,
        trim: true
    },

    technologies: [String],

    // Gallery (multiple images or videos)
    gallery: [mediaSchema],

    // Whether this project appears in the featured "Selected Works" gallery
    inGallery: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

if (mongoose.models.Project) {
    delete mongoose.models.Project;
}

const Project = mongoose.model("Project", projectSchema);

export default Project;
