import mongoose from "mongoose";

const testimonialSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
    },
    company: {
        type: String,
    },
    message: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 5,
    },
    image: {
        type: String, // URL
    },
}, {
    timestamps: true,
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
