"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Modal, DeleteModal } from "@/components/Modal"
import { Plus, Edit, Trash2, Tags } from "lucide-react"

interface Category {
    _id: string
    name: string
    description?: string
    color: string
    createdAt: string
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "#3b82f6",
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await fetch("http://localhost:5000/api/categories")
            const data = await response.json()
            setCategories(data)
        } catch (error) {
            console.error("Error fetching categories:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setSelectedCategory(category)
            setFormData({
                name: category.name,
                description: category.description || "",
                color: category.color,
            })
        } else {
            setSelectedCategory(null)
            setFormData({ name: "", description: "", color: "#3b82f6" })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedCategory(null)
        setFormData({ name: "", description: "", color: "#3b82f6" })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = selectedCategory
                ? `http://localhost:5000/api/categories/${selectedCategory._id}`
                : "http://localhost:5000/api/categories"

            const method = selectedCategory ? "PUT" : "POST"

            const token = localStorage.getItem("token")
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                fetchCategories()
                handleCloseModal()
            }
        } catch (error) {
            console.error("Error saving category:", error)
        }
    }

    const handleDelete = async () => {
        if (!selectedCategory) return

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/api/categories/${selectedCategory._id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (response.ok) {
                fetchCategories()
                setIsDeleteModalOpen(false)
                setSelectedCategory(null)
            }
        } catch (error) {
            console.error("Error deleting category:", error)
        }
    }

    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category)
        setIsDeleteModalOpen(true)
    }

    const predefinedColors = [
        "#3b82f6", // Blue
        "#8b5cf6", // Purple
        "#ec4899", // Pink
        "#f59e0b", // Amber
        "#10b981", // Green
        "#ef4444", // Red
        "#06b6d4", // Cyan
        "#f97316", // Orange
    ]

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Categories</h1>
                        <p className="text-gray-600 dark:text-gray-400">Organize your portfolio projects with categories</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add Category
                    </button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">Loading categories...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <Tags className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500 mb-4">No categories yet</p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="text-primary hover:underline font-medium"
                            >
                                Create your first category
                            </button>
                        </div>
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category._id}
                                className="bg-white dark:bg-[#1e2024] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group relative overflow-hidden"
                            >
                                {/* Color Bar */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-2"
                                    style={{ backgroundColor: category.color }}
                                />

                                <div className="flex items-start justify-between mb-4 mt-2">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                                        style={{ backgroundColor: category.color }}
                                    >
                                        <Tags className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(category)}
                                            className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(category)}
                                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                                {category.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                        {category.description}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Created: {new Date(category.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedCategory ? "Edit Category" : "Add New Category"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description (optional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Color</label>
                        <div className="grid grid-cols-8 gap-2 mb-3">
                            {predefinedColors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-10 h-10 rounded-lg transition-all ${formData.color === color
                                        ? "ring-2 ring-offset-2 ring-primary scale-110"
                                        : "hover:scale-105"
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-700 cursor-pointer"
                        />
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
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg transition-all font-medium"
                        >
                            {selectedCategory ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedCategory(null)
                }}
                onConfirm={handleDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
            />
        </DashboardLayout>
    )
}
