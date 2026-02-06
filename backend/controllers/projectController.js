import Project from "../models/projectModel.js";

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).populate('category');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('category');
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    const { title, description, image, link, technologies, category, likes, gallery } = req.body;
    try {
        const project = new Project({
            title,
            description,
            image,
            link,
            technologies,
            category,
            likes,
            gallery
        });
        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    const { title, description, image, link, technologies, category, likes, gallery } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            project.title = title || project.title;
            project.description = description || project.description;
            project.image = image || project.image;
            project.link = link || project.link;
            project.technologies = technologies || project.technologies;
            project.category = category || project.category;
            project.likes = likes !== undefined ? likes : project.likes;
            project.gallery = gallery || project.gallery;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (project) {
            res.json({ message: "Project removed" });
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getProjects, getProjectById, createProject, updateProject, deleteProject };
