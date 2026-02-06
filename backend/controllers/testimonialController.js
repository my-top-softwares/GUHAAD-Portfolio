import Testimonial from "../models/testimonialModel.js";

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({});
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
const getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (testimonial) {
            res.json(testimonial);
        } else {
            res.status(404).json({ message: "Testimonial not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
const createTestimonial = async (req, res) => {
    const { name, position, company, message, image } = req.body;
    try {
        const testimonial = new Testimonial({
            name,
            position,
            company,
            message,
            image
        });
        const createdTestimonial = await testimonial.save();
        res.status(201).json(createdTestimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonial = async (req, res) => {
    const { name, position, company, message, image } = req.body;
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (testimonial) {
            testimonial.name = name || testimonial.name;
            testimonial.position = position || testimonial.position;
            testimonial.company = company || testimonial.company;
            testimonial.message = message || testimonial.message;
            testimonial.image = image || testimonial.image;

            const updatedTestimonial = await testimonial.save();
            res.json(updatedTestimonial);
        } else {
            res.status(404).json({ message: "Testimonial not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (testimonial) {
            await testimonial.deleteOne();
            res.json({ message: "Testimonial removed" });
        } else {
            res.status(404).json({ message: "Testimonial not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial };
