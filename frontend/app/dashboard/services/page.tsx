"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Modal, DeleteModal } from "@/components/Modal"
import { Plus, Edit, Trash2, Code2, X, Loader2 } from "lucide-react"
import API from "@/api/axios"

interface Service {
    _id: string
    title: string
    description: string
    price: number
    features: string[]
    icon?: string
    createdAt: string
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        features: [] as string[],
        icon: "",
    })
    const [featureInput, setFeatureInput] = useState("")

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            setLoading(true)
            const response = await API.get("/services")
            setServices(response.data)
        } catch (error) {
            console.error("Error fetching services:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (service?: Service) => {
        if (service) {
            setSelectedService(service)
            setFormData({
                title: service.title,
                description: service.description,
                price: service.price || 0,
                features: service.features || [],
                icon: service.icon || "",
            })
        } else {
            setSelectedService(null)
            setFormData({ title: "", description: "", price: 0, features: [], icon: "" })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedService(null)
        setFormData({ title: "", description: "", price: 0, features: [], icon: "" })
        setFeatureInput("")
    }

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({ ...formData, features: [...formData.features, featureInput.trim()] })
            setFeatureInput("")
        }
    }

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setSubmitting(true)
            if (selectedService) {
                await API.put(`/services/${selectedService._id}`, formData)
            } else {
                await API.post("/services", formData)
            }

            fetchServices()
            handleCloseModal()
        } catch (error: any) {
            console.error("Error saving service:", error)
            alert(`Error: ${error.response?.data?.message || "Failed to save service"}`)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedService) return

        try {
            setSubmitting(true)
            await API.delete(`/services/${selectedService._id}`)
            fetchServices()
            setIsDeleteModalOpen(false)
            setSelectedService(null)
        } catch (error: any) {
            console.error("Error deleting service:", error)
            alert(`Error: ${error.response?.data?.message || "Failed to delete service. Please check your permissions."}`)
        } finally {
            setSubmitting(false)
        }
    }

    const openDeleteModal = (service: Service) => {
        setSelectedService(service)
        setIsDeleteModalOpen(true)
    }

    const handleOrderWhatsApp = (service: Service) => {
        const message = `Hi, I want to order the *${service.title}* package ($${service.price})`
        const whatsappUrl = `https://wa.me/252618240346?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Packages & Pricing</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your service packages</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add Package
                    </button>
                </div>

                {/* Services Grid - Pricing Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">Loading packages...</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500 mb-4">No packages yet</p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="text-primary hover:underline font-medium"
                            >
                                Create your first package
                            </button>
                        </div>
                    ) : (
                        services.map((service) => (
                            <div
                                key={service._id}
                                className="bg-white dark:bg-[#1e2024] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800 group relative"
                            >
                                {/* Edit/Delete Buttons */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal(service)}
                                        className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(service)}
                                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Package Name */}
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-4 text-center">
                                    {service.title}
                                </h3>

                                {/* Price */}
                                <div className="text-center mb-6">
                                    <span className="text-5xl font-bold text-primary">${service.price}</span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {service.features && service.features.length > 0 ? (
                                        service.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm">
                                                <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-gray-500 text-center">No features added</li>
                                    )}
                                </ul>

                                {/* Order Button */}
                                <button
                                    onClick={() => handleOrderWhatsApp(service)}
                                    className="w-full py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-bold uppercase text-sm tracking-wider"
                                >
                                    ORDER NOW
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedService ? "Edit Package" : "Add New Package"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Package Name</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., STARTER PACKAGE"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Price ($)</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            placeholder="120"
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

                    <div>
                        <label className="block text-sm font-medium mb-2">Features</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                placeholder="Add a feature..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={addFeature}
                                className="px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="flex-1 text-sm">{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Icon (optional)</label>
                        <input
                            type="text"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            placeholder="Icon class or URL"
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
                            {selectedService ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedService(null)
                }}
                onConfirm={handleDelete}
                isLoading={submitting}
                title="Delete Package"
                message={`Are you sure you want to delete "${selectedService?.title}"? This action cannot be undone.`}
            />
        </DashboardLayout>
    )
}
