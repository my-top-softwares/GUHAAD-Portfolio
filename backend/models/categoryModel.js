import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    color: {
        type: String,
        default: "#3b82f6", // Default blue color
    },
}, {
    timestamps: true,
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
