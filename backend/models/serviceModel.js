import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    features: [{
        type: String,
    }],
    icon: {
        type: String,
        // URL or icon class string
    },
}, {
    timestamps: true,
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
