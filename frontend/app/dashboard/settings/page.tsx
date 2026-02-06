"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Mail, Settings, Lock, Save, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import API from "@/api/axios"
import { motion, AnimatePresence } from "framer-motion"

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const [formData, setFormData] = useState({
        emailUser: "",
        emailPass: "",
        notificationEmail: ""
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const { data } = await API.get("/settings")
            setFormData({
                emailUser: data.emailUser || "",
                emailPass: data.emailPass || "",
                notificationEmail: data.notificationEmail || ""
            })
        } catch (error) {
            console.error("Error fetching settings:", error)
            setErrorMessage("Failed to load settings. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccessMessage("")
        setErrorMessage("")

        try {
            setSubmitting(true)
            await API.post("/settings", formData)
            setSuccessMessage("Settings updated successfully! ✅")
            setTimeout(() => setSuccessMessage(""), 5000)
        } catch (error: any) {
            console.error("Error updating settings:", error)
            setErrorMessage(error.response?.data?.message || "Failed to update settings.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Settings className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">System Settings</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Configure your email notifications and system credentials.
                    </p>
                </div>

                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 font-bold flex items-center gap-3"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            {successMessage}
                        </motion.div>
                    )}
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 font-bold flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="font-medium text-gray-500">Loading Configuration...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white dark:bg-[#1e2024] p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 space-y-8">

                            {/* Email Configuration Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-bold">SMTP Configuration</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-wider text-gray-500">Admin Email (Sender)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.emailUser}
                                                onChange={(e) => setFormData({ ...formData, emailUser: e.target.value })}
                                                placeholder="your-email@gmail.com"
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#17181c] focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-base"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-wider text-gray-500">App Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.emailPass}
                                                onChange={(e) => setFormData({ ...formData, emailPass: e.target.value })}
                                                placeholder="xxxx xxxx xxxx xxxx"
                                                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#17181c] focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-base"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-all"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <label className="text-sm font-black uppercase tracking-wider text-gray-500">Receiving Email (Notification Destination)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.notificationEmail}
                                            onChange={(e) => setFormData({ ...formData, notificationEmail: e.target.value })}
                                            placeholder="faysalmohamed710@gmail.com"
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#17181c] focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-base"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 italic mt-2">
                                        💡 Messages from your contact form will be sent to this email address.
                                    </p>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving Configuration...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save All Settings
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Instruction Card */}
                        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                            <h3 className="flex items-center gap-2 font-bold text-primary mb-3">
                                <AlertCircle className="w-5 h-5" />
                                How to get your App Password?
                            </h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc pl-5">
                                <li>Ensure <strong>2-Step Verification</strong> is ON in your Google Account.</li>
                                <li>Go to Security and search for "App Passwords".</li>
                                <li>Create a new password for "Portfolio".</li>
                                <li>Copy the <strong>16-character code</strong> and paste it above.</li>
                            </ul>
                        </div>
                    </form>
                )}
            </div>
        </DashboardLayout>
    )
}
