"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Modal, DeleteModal } from "@/components/Modal"
import { Plus, Edit, Trash2, Users, Shield, User } from "lucide-react"

interface UserType {
    _id: string
    name: string
    email: string
    role: "admin" | "employee"
    isActive: boolean
    createdAt: string
}

export default function AdminManagementPage() {
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee" as "admin" | "employee",
    })

    // Check if current user is admin
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
        // Get current user from localStorage
        const user = localStorage.getItem("user")
        if (user) {
            setCurrentUser(JSON.parse(user))
        }
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:5000/api/users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (user?: UserType) => {
        if (user) {
            setSelectedUser(user)
            setFormData({
                name: user.name,
                email: user.email,
                password: "",
                role: user.role,
            })
        } else {
            setSelectedUser(null)
            setFormData({ name: "", email: "", password: "", role: "employee" })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedUser(null)
        setFormData({ name: "", email: "", password: "", role: "employee" })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = selectedUser
                ? `http://localhost:5000/api/users/${selectedUser._id}`
                : "http://localhost:5000/api/users"

            const method = selectedUser ? "PUT" : "POST"

            const payload = selectedUser && !formData.password
                ? { name: formData.name, email: formData.email, role: formData.role }
                : formData

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
                fetchUsers()
                handleCloseModal()
            }
        } catch (error) {
            console.error("Error saving user:", error)
        }
    }

    const handleDelete = async () => {
        if (!selectedUser) return

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (response.ok) {
                fetchUsers()
                setIsDeleteModalOpen(false)
                setSelectedUser(null)
            }
        } catch (error) {
            console.error("Error deleting user:", error)
        }
    }

    const openDeleteModal = (user: UserType) => {
        setSelectedUser(user)
        setIsDeleteModalOpen(true)
    }

    const toggleUserStatus = async (user: UserType) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !user.isActive }),
            })

            if (response.ok) {
                fetchUsers()
            }
        } catch (error) {
            console.error("Error updating user status:", error)
        }
    }

    // Only admins can access this page
    if (currentUser && currentUser.role !== "admin") {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                        <p className="text-gray-600 dark:text-gray-400">Only administrators can access this page.</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Admin Management</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage administrators and employees</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add User
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-[#1e2024] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                                <p className="text-3xl font-bold">{users.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1e2024] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Administrators</p>
                                <p className="text-3xl font-bold">{users.filter(u => u.role === "admin").length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1e2024] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Employees</p>
                                <p className="text-3xl font-bold">{users.filter(u => u.role === "employee").length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-[#1e2024] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                            <p className="text-gray-500 mb-2">No users yet</p>
                                            <button
                                                onClick={() => handleOpenModal()}
                                                className="text-primary hover:underline font-medium"
                                            >
                                                Create your first user
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin"
                                                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                    }`}>
                                                    {user.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleUserStatus(user)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive
                                                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                                                        }`}
                                                >
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(user)}
                                                        className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(user)}
                                                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedUser ? "Edit User" : "Add New User"}
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
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password {selectedUser && "(leave blank to keep current)"}
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            required={!selectedUser}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "employee" })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        >
                            <option value="employee">Employee</option>
                            <option value="admin">Administrator</option>
                        </select>
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
                            {selectedUser ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedUser(null)
                }}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
            />
        </DashboardLayout>
    )
}
