"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Modal, DeleteModal } from "@/components/Modal"
import { Plus, Edit, Trash2, FolderKanban, Heart, Loader2 } from "lucide-react"
import API from "@/api/axios"

interface Category {
    _id: string
    name: string
    color: string
}

interface Portfolio {
    _id: string
    title: string
    description: string
    image?: string
    link?: string
    category?: Category
    likes: number
    technologies: string[]
    gallery?: string[]
    projectType?: 'image' | 'video'
    createdAt: string
}

export default function PortfolioPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        projectType: "image",
        image: "",
        link: "",
        category: "",
        likes: 0,
        technologies: "",
        gallery: [] as string[],
    })
    const [galleryInput, setGalleryInput] = useState("")

    useEffect(() => {
        fetchPortfolios()
        fetchCategories()
    }, [])

    const fetchPortfolios = async () => {
        try {
            setLoading(true)
            const response = await API.get("/projects")
            setPortfolios(response.data)
        } catch (error) {
            console.error("Error fetching portfolios:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await API.get("/categories")
            setCategories(response.data)
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    const handleOpenModal = (portfolio?: Portfolio) => {
        if (portfolio) {
            setSelectedPortfolio(portfolio)
            setFormData({
                title: portfolio.title,
                description: portfolio.description,
                projectType: portfolio.projectType || "image",
                image: portfolio.image || "",
                link: portfolio.link || "",
                category: portfolio.category?._id || "",
                likes: portfolio.likes || 0,
                technologies: portfolio.technologies?.join(", ") || "",
                gallery: portfolio.gallery || [],
            })
        } else {
            setSelectedPortfolio(null)
            setFormData({ title: "", description: "", projectType: "image", image: "", link: "", category: "", likes: 0, technologies: "", gallery: [] })
        }
        setGalleryInput("")
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedPortfolio(null)
        setFormData({ title: "", description: "", projectType: "image", image: "", link: "", category: "", likes: 0, technologies: "", gallery: [] })
        setGalleryInput("")
    }

    const addGalleryItem = () => {
        if (galleryInput.trim()) {
            setFormData({ ...formData, gallery: [...formData.gallery, galleryInput.trim()] })
            setGalleryInput("")
        }
    }

    const removeGalleryItem = (index: number) => {
        setFormData({
            ...formData,
            gallery: formData.gallery.filter((_, i) => i !== index)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setSubmitting(true)

            const payload = {
                ...formData,
                technologies: formData.technologies.split(",").map(t => t.trim()).filter(t => t),
                category: formData.category || undefined,
            }

            if (selectedPortfolio) {
                await API.put(`/projects/${selectedPortfolio._id}`, payload)
            } else {
                await API.post("/projects", payload)
            }

            fetchPortfolios()
            handleCloseModal()
        } catch (error: any) {
            console.error("Error saving portfolio:", error)
            alert(`Error: ${error.response?.data?.message || "Failed to save portfolio. Please check your connection and try again."}`)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedPortfolio) return

        try {
            setSubmitting(true)
            await API.delete(`/projects/${selectedPortfolio._id}`)
            fetchPortfolios()
            setIsDeleteModalOpen(false)
            setSelectedPortfolio(null)
        } catch (error: any) {
            console.error("Error deleting portfolio:", error)
            alert(`Error: ${error.response?.data?.message || "Failed to delete portfolio. Please check your permissions."}`)
        } finally {
            setSubmitting(false)
        }
    }

    const openDeleteModal = (portfolio: Portfolio) => {
        setSelectedPortfolio(portfolio)
        setIsDeleteModalOpen(true)
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your portfolio projects</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add Portfolio
                    </button>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">Loading portfolios...</p>
                        </div>
                    ) : portfolios.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <FolderKanban className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500 mb-4">No portfolios yet</p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="text-primary hover:underline font-medium"
                            >
                                Create your first portfolio
                            </button>
                        </div>
                    ) : (
                        portfolios.map((portfolio) => (
                            <div
                                key={portfolio._id}
                                className="bg-white dark:bg-[#1e2024] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group"
                            >
                                {portfolio.image && (
                                    <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-gray-800">
                                        {(portfolio.projectType === 'video' ||
                                            portfolio.image.toLowerCase().includes('.mp4') ||
                                            portfolio.image.toLowerCase().includes('.webm') ||
                                            portfolio.image.toLowerCase().includes('.mov')) ? (
                                            <video
                                                src={portfolio.image}
                                                className="w-full h-full object-cover"
                                                controls={false}
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                src={portfolio.image}
                                                alt={portfolio.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        )}
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            {portfolio.category && (
                                                <span
                                                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
                                                    style={{
                                                        backgroundColor: portfolio.category.color + "20",
                                                        color: portfolio.category.color,
                                                    }}
                                                >
                                                    {portfolio.category.name}
                                                </span>
                                            )}
                                            <h3 className="text-xl font-bold mb-2">{portfolio.title}</h3>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(portfolio)}
                                                className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(portfolio)}
                                                className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">{portfolio.description}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <Heart className="w-4 h-4" />
                                            <span>{portfolio.likes}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {new Date(portfolio.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedPortfolio ? "Edit Portfolio" : "Add New Portfolio"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            >
                                <option value="">No Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Likes</label>
                            <input
                                type="number"
                                value={formData.likes}
                                onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Project Type Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Project Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="projectType"
                                    value="image"
                                    checked={formData.projectType === 'image'}
                                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                    className="accent-primary w-4 h-4"
                                />
                                <span className="text-gray-700 dark:text-gray-300">Image</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="projectType"
                                    value="video"
                                    checked={formData.projectType === 'video'}
                                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                    className="accent-primary w-4 h-4"
                                />
                                <span className="text-gray-700 dark:text-gray-300">Video</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Project Media (Image or Video)</label>
                        <div className="space-y-3">
                            {/* Media Preview */}
                            {formData.image && (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    {(formData.image.toLowerCase().includes('.mp4') ||
                                        formData.image.toLowerCase().includes('.webm') ||
                                        formData.image.toLowerCase().includes('.mov')) ? (
                                        <video
                                            src={formData.image}
                                            className="w-full h-full object-cover"
                                            controls
                                        />
                                    ) : (
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: "" })}
                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {/* URL Input */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Media URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg or video.mp4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* OR Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-[#1e2024] px-2 text-gray-500">Or</span>
                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Upload File</label>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            try {
                                                const uploadFormData = new FormData()
                                                uploadFormData.append('file', file)
                                                // Function to get Base URL from API config or default to localhost:5000
                                                const baseURL = API.defaults.baseURL?.replace('/api', '') || "http://localhost:5000"

                                                const { data } = await API.post('/upload', uploadFormData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                })
                                                // data should be the path like /uploads/filename.ext
                                                const fullUrl = `${baseURL}${data}`
                                                setFormData({ ...formData, image: fullUrl })
                                            } catch (err) {
                                                console.error("Upload failed", err)
                                                alert("Failed to upload file. Please try again.")
                                            }
                                        }
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 file:cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 mt-1">Supported formats: Images (JPG, PNG, GIF) & Videos (MP4, WebM)</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Project Link (Optional)</label>
                        <input
                            type="text"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="https://example.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.technologies}
                            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                            placeholder="React, Node.js, After Effects"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Gallery Section */}
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                        <label className="block text-sm font-medium mb-2">Portfolio Gallery (Photos/Videos/Audio)</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={galleryInput}
                                onChange={(e) => setGalleryInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryItem())}
                                placeholder="Paste Image/Video/Audio URL..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={addGalleryItem}
                                className="px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Gallery File Upload */}
                        <div className="mb-4">
                            <label className="block text-xs text-gray-500 mb-1">Add to Gallery (Upload Photo/Video/Audio)</label>
                            <input
                                type="file"
                                accept="image/*,video/*,audio/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        try {
                                            const uploadFormData = new FormData()
                                            uploadFormData.append('file', file)
                                            // Function to get Base URL from API config or default to localhost:5000
                                            const baseURL = API.defaults.baseURL?.replace('/api', '') || "http://localhost:5000"

                                            const { data } = await API.post('/upload', uploadFormData, {
                                                headers: { 'Content-Type': 'multipart/form-data' }
                                            })
                                            const fullUrl = `${baseURL}${data}`
                                            setFormData({ ...formData, gallery: [...formData.gallery, fullUrl] })
                                        } catch (err) {
                                            console.error("Upload failed", err)
                                            alert("Failed to upload file. Please try again.")
                                        }
                                    }
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 file:cursor-pointer"
                            />
                        </div>

                        {formData.gallery.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                                {formData.gallery.map((item, index) => {
                                    const isVideo = item.toLowerCase().includes('data:video') || item.toLowerCase().includes('.mp4') || item.includes('youtube.com') || item.includes('vimeo.com');
                                    const isAudio = item.toLowerCase().includes('data:audio') || item.toLowerCase().includes('.mp3') || item.toLowerCase().includes('.wav') || item.toLowerCase().includes('.ogg');

                                    return (
                                        <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 h-24 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                            {isVideo ? (
                                                <video src={item} className="w-full h-full object-cover" controls={false} muted />
                                            ) : isAudio ? (
                                                <div className="flex flex-col items-center justify-center text-gray-500 gap-1 p-2 w-full">
                                                    <span className="text-xs uppercase font-bold">Audio</span>
                                                    <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
                                                        <div className="w-1/2 h-full bg-primary"></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={item}
                                                    alt={`Gallery ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}

                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryItem(index)}
                                                    className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Type Indicator Badge */}
                                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] uppercase font-bold pointer-events-none">
                                                {isVideo ? 'Video' : isAudio ? 'Audio' : 'Image'}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {selectedPortfolio ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedPortfolio(null)
                }}
                onConfirm={handleDelete}
                title="Delete Portfolio"
                message={`Are you sure you want to delete "${selectedPortfolio?.title}"? This action cannot be undone.`}
            />
        </DashboardLayout>
    )
}
