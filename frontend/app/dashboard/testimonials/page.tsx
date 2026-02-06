"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Modal, DeleteModal } from "@/components/Modal"
import { Plus, Edit, Trash2, MessageSquare, Star, Loader2 } from "lucide-react"
import API from "@/api/axios"

interface Testimonial {
    _id: string
    name: string
    position?: string
    company?: string
    message: string
    image?: string
    createdAt: string
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        position: "",
        company: "",
        message: "",
        image: "",
    })

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            setLoading(true)
            const response = await API.get("/testimonials")
            setTestimonials(response.data)
        } catch (error) {
            console.error("Error fetching testimonials:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (testimonial?: Testimonial) => {
        if (testimonial) {
            setSelectedTestimonial(testimonial)
            setFormData({
                name: testimonial.name,
                position: testimonial.position || "",
                company: testimonial.company || "",
                message: testimonial.message,
                image: testimonial.image || "",
            })
        } else {
            setSelectedTestimonial(null)
            setFormData({ name: "", position: "", company: "", message: "", image: "" })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedTestimonial(null)
        setFormData({ name: "", position: "", company: "", message: "", image: "" })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setSubmitting(true)

            if (selectedTestimonial) {
                await API.put(`/testimonials/${selectedTestimonial._id}`, formData)
            } else {
                await API.post("/testimonials", formData)
            }

            fetchTestimonials()
            handleCloseModal()
        } catch (error: any) {
            console.error("Error saving testimonial:", error)
            alert(`Error: ${error.response?.data?.message || "Failed to save testimonial"}`)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedTestimonial) return

        try {
            setSubmitting(true)
            await API.delete(`/testimonials/${selectedTestimonial._id}`)
            fetchTestimonials()
            setIsDeleteModalOpen(false)
            setSelectedTestimonial(null)
        } catch (error: any) {
            console.error("Error deleting testimonial:", error)
            alert(`Error: ${error.response?.data?.message || "Failed to delete testimonial. Please check your permissions."}`)
        } finally {
            setSubmitting(false)
        }
    }

    const openDeleteModal = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial)
        setIsDeleteModalOpen(true)
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Testimonials</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage client testimonials and reviews</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add Testimonial
                    </button>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">Loading testimonials...</p>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500 mb-4">No testimonials yet</p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="text-primary hover:underline font-medium"
                            >
                                Add your first testimonial
                            </button>
                        </div>
                    ) : (
                        testimonials.map((testimonial) => (
                            <div
                                key={testimonial._id}
                                className="bg-white dark:bg-[#1e2024] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
                                        {testimonial.image ? (
                                            <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                                        ) : (
                                            testimonial.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold">{testimonial.name}</h3>
                                        {testimonial.position && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {testimonial.position}
                                                {testimonial.company && ` at ${testimonial.company}`}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(testimonial)}
                                            className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(testimonial)}
                                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-1 text-yellow-500 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-4">
                                    "{testimonial.message}"
                                </p>

                                <p className="text-xs text-gray-500">
                                    {new Date(testimonial.createdAt).toLocaleDateString()}
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
                title={selectedTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Position</label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                placeholder="e.g., CEO"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Company</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="e.g., Acme Inc"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/avatar.jpg"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
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
                            disabled={submitting}
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {selectedTestimonial ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedTestimonial(null)
                }}
                onConfirm={handleDelete}
                isLoading={submitting}
                title="Delete Testimonial"
                message={`Are you sure you want to delete the testimonial from "${selectedTestimonial?.name}"? This action cannot be undone.`}
            />
        </DashboardLayout>
    )
}
