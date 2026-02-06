"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Modal, DeleteModal } from "@/components/Modal"
import { Plus, Edit, Trash2, FolderKanban, Heart, Loader2 } from "lucide-react"

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
            const response = await fetch("http://localhost:5000/api/projects")
            const data = await response.json()
            setPortfolios(data)
        } catch (error) {
            console.error("Error fetching portfolios:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/categories")
            const data = await response.json()
            setCategories(data)
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
                image: portfolio.image || "",
                link: portfolio.link || "",
                category: portfolio.category?._id || "",
                likes: portfolio.likes || 0,
                technologies: portfolio.technologies?.join(", ") || "",
                gallery: portfolio.gallery || [],
            })
        } else {
            setSelectedPortfolio(null)
            setFormData({ title: "", description: "", image: "", link: "", category: "", likes: 0, technologies: "", gallery: [] })
        }
        setGalleryInput("")
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedPortfolio(null)
        setFormData({ title: "", description: "", image: "", link: "", category: "", likes: 0, technologies: "", gallery: [] })
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
            const url = selectedPortfolio
                ? `http://localhost:5000/api/projects/${selectedPortfolio._id}`
                : "http://localhost:5000/api/projects"

            const method = selectedPortfolio ? "PUT" : "POST"

            const payload = {
                ...formData,
                technologies: formData.technologies.split(",").map(t => t.trim()).filter(t => t),
                category: formData.category || undefined,
            }

            const token = localStorage.getItem("token")
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                fetchPortfolios()
                handleCloseModal()
            } else {
                const errorData = await response.json()
                alert(`Error: ${errorData.message || "Failed to save portfolio"}`)
            }
        } catch (error) {
            console.error("Error saving portfolio:", error)
            alert("An error occurred while saving the portfolio. Please check your connection and try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedPortfolio) return

        try {
            setSubmitting(true)
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/api/projects/${selectedPortfolio._id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (response.ok) {
                fetchPortfolios()
                setIsDeleteModalOpen(false)
                setSelectedPortfolio(null)
            } else {
                const errorData = await response.json()
                alert(`Error: ${errorData.message || "Failed to delete portfolio. Please check your permissions."}`)
            }
        } catch (error) {
            console.error("Error deleting portfolio:", error)
            alert("An error occurred while deleting the portfolio. Please check your connection and try again.")
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
                                        <img
                                            src={portfolio.image}
                                            alt={portfolio.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
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
                    <div>
                        <label className="block text-sm font-medium mb-2">Image</label>
                        <div className="space-y-3">
                            {/* Image Preview */}
                            {formData.image && (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: "" })}
                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {/* URL Input */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
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
                                <label className="block text-xs text-gray-500 mb-1">Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            const reader = new FileReader()
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, image: reader.result as string })
                                            }
                                            reader.readAsDataURL(file)
                                        }
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 file:cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF, WebP</p>
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
                        <label className="block text-sm font-medium mb-2">Portfolio Gallery (More Photos/Videos)</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={galleryInput}
                                onChange={(e) => setGalleryInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryItem())}
                                placeholder="Paste Image/Video URL..."
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
                            <label className="block text-xs text-gray-500 mb-1">Add to Gallery (Upload Photo/Video)</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                            setFormData({ ...formData, gallery: [...formData.gallery, reader.result as string] })
                                        }
                                        reader.readAsDataURL(file)
                                    }
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 file:cursor-pointer"
                            />
                        </div>

                        {formData.gallery.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                                {formData.gallery.map((item, index) => (
                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 h-24">
                                        <img
                                            src={item}
                                            alt={`Gallery ${index}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Handle video thumbnail or placeholder if not an image
                                                (e.target as any).src = 'https://via.placeholder.com/150?text=Video/Media';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryItem(index)}
                                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
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
