"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Modal, DeleteModal } from "@/components/Modal"
import { Plus, Edit, Trash2, GraduationCap, Briefcase, Loader2 } from "lucide-react"
import API from "@/api/axios"

interface ResumeItem {
    _id: string
    title: string
    organization: string
    duration: string
    description: string
    type: 'experience' | 'education'
    order: number
}

export default function ResumeManagementPage() {
    const [resumeData, setResumeData] = useState<ResumeItem[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<ResumeItem | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        organization: "",
        duration: "",
        description: "",
        type: "experience" as "experience" | "education",
        order: 0,
    })

    useEffect(() => {
        fetchResume()
    }, [])

    const fetchResume = async () => {
        try {
            setLoading(true)
            const { data } = await API.get("/resume")
            setResumeData(data)
        } catch (error) {
            console.error("Error fetching resume:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (item?: ResumeItem) => {
        if (item) {
            setSelectedItem(item)
            setFormData({
                title: item.title,
                organization: item.organization,
                duration: item.duration,
                description: item.description,
                type: item.type,
                order: item.order,
            })
        } else {
            setSelectedItem(null)
            setFormData({
                title: "",
                organization: "",
                duration: "",
                description: "",
                type: "experience",
                order: resumeData.length + 1,
            })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedItem(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            if (selectedItem) {
                await API.put(`/resume/${selectedItem._id}`, formData)
            } else {
                await API.post("/resume", formData)
            }
            fetchResume()
            handleCloseModal()
        } catch (error: any) {
            console.error("Error saving resume item:", error)
            alert(`Error: ${error.response?.data?.message || "Failed to save record"}`)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedItem) return
        try {
            setSubmitting(true)
            await API.delete(`/resume/${selectedItem._id}`)
            fetchResume()
            setIsDeleteModalOpen(false)
            setSelectedItem(null)
        } catch (error: any) {
            console.error("Error deleting resume item:", error)
            alert(`Error: ${error.response?.data?.message || "Failed to delete record. Please check your permissions."}`)
        } finally {
            setSubmitting(false)
        }
    }

    const experience = resumeData.filter(i => i.type === 'experience').sort((a, b) => a.order - b.order)
    const education = resumeData.filter(i => i.type === 'education').sort((a, b) => a.order - b.order)

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Resume Management</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your experience and education history</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add Item
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Experience Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold">Experience</h2>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
                        ) : experience.map(item => (
                            <ResumeCard key={item._id} item={item} onEdit={handleOpenModal} onDelete={(item) => { setSelectedItem(item); setIsDeleteModalOpen(true); }} />
                        ))}
                    </div>

                    {/* Education Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <GraduationCap className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold">Education</h2>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
                        ) : education.map(item => (
                            <ResumeCard key={item._id} item={item} onEdit={handleOpenModal} onDelete={(item) => { setSelectedItem(item); setIsDeleteModalOpen(true); }} />
                        ))}
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedItem ? "Edit Resume Item" : "Add Resume Item"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full p-2 border rounded-lg bg-background"
                            >
                                <option value="experience">Experience</option>
                                <option value="education">Education</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                className="w-full p-2 border rounded-lg bg-background"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded-lg bg-background"
                            placeholder="e.g. Senior Developer"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Organization</label>
                        <input
                            type="text"
                            value={formData.organization}
                            onChange={e => setFormData({ ...formData, organization: e.target.value })}
                            className="w-full p-2 border rounded-lg bg-background"
                            placeholder="e.g. Adobe Inc."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Duration</label>
                        <input
                            type="text"
                            value={formData.duration}
                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full p-2 border rounded-lg bg-background"
                            placeholder="e.g. 2021 - Present"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded-lg bg-background h-32"
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={handleCloseModal} className="flex-1 py-2 border rounded-lg">Cancel</button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-2 bg-primary text-white rounded-lg flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save
                        </button>
                    </div>
                </form>
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                isLoading={submitting}
                title="Delete Item"
                message={`Are you sure you want to delete "${selectedItem?.title}"?`}
            />
        </DashboardLayout>
    )
}

function ResumeCard({ item, onEdit, onDelete }: { item: ResumeItem, onEdit: (item: ResumeItem) => void, onDelete: (item: ResumeItem) => void }) {
    return (
        <div className="bg-white dark:bg-[#1e2024] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 group relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(item)} className="p-2 bg-blue-500/10 text-blue-600 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(item)} className="p-2 bg-red-500/10 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="mb-2">
                <span className="text-xs font-bold text-primary uppercase">{item.duration}</span>
                <h3 className="text-lg font-bold mt-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.organization}</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
        </div>
    )
}
