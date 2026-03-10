import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    media: {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], required: true }
    },
    category: {
        type: String,
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

if (mongoose.models.Gallery) {
    delete mongoose.models.Gallery;
}

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
