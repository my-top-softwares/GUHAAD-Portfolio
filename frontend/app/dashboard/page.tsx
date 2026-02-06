"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Briefcase, FolderKanban, MessageSquare, Tags } from "lucide-react"
import API from "@/api/axios"

import { Bar } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

interface Stats {
    services: number
    portfolios: number
    testimonials: number
    categories: number
}

interface CategoryData {
    name: string
    count: number
    color: string
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        services: 0,
        portfolios: 0,
        testimonials: 0,
        categories: 0,
    })
    const [categoryData, setCategoryData] = useState<CategoryData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            const token = localStorage.getItem("token")
            // Fetch all data
            const [servicesRes, projectsRes, testimonialsRes, categoriesRes] = await Promise.all([
                API.get("/services"),
                API.get("/projects"),
                API.get("/testimonials"),
                API.get("/categories"),
            ])

            const services = servicesRes.data
            const projects = projectsRes.data
            const testimonials = testimonialsRes.data
            const categories = categoriesRes.data

            // Update stats
            setStats({
                services: services.length,
                portfolios: projects.length,
                testimonials: testimonials.length,
                categories: categories.length,
            })

            // Calculate category distribution
            const categoryMap = new Map<string, { count: number; color: string }>()

            categories.forEach((cat: any) => {
                categoryMap.set(cat._id, { count: 0, color: cat.color || "#3b82f6" })
            })

            projects.forEach((project: any) => {
                if (project.category && project.category._id) {
                    const catData = categoryMap.get(project.category._id)
                    if (catData) {
                        catData.count++
                    }
                }
            })

            const categoryStats: CategoryData[] = categories.map((cat: any) => ({
                name: cat.name,
                count: categoryMap.get(cat._id)?.count || 0,
                color: cat.color || "#3b82f6",
            }))

            setCategoryData(categoryStats)
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    const chartData = {
        labels: categoryData.map(c => c.name),
        datasets: [
            {
                label: 'Projects per Category',
                data: categoryData.map(c => c.count),
                backgroundColor: categoryData.map(c => c.color + '80'), // Add transparency
                borderColor: categoryData.map(c => c.color),
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Portfolio Projects by Category',
                font: {
                    size: 18,
                    weight: 'bold' as const,
                },
                color: '#fff',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: '#9ca3af',
                },
                grid: {
                    color: '#374151',
                },
            },
            x: {
                ticks: {
                    color: '#9ca3af',
                },
                grid: {
                    display: false,
                },
            },
        },
    }

    const statCards = [
        { icon: Briefcase, label: "Services", value: stats.services, color: "from-blue-500 to-blue-600" },
        { icon: FolderKanban, label: "Portfolios", value: stats.portfolios, color: "from-purple-500 to-purple-600" },
        { icon: MessageSquare, label: "Testimonials", value: stats.testimonials, color: "from-green-500 to-green-600" },
        { icon: Tags, label: "Categories", value: stats.categories, color: "from-orange-500 to-orange-600" },
    ]

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                    <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your portfolio.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, index) => {
                        const Icon = card.icon
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-[#1e2024] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-800"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-3xl font-bold">{loading ? "..." : card.value}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">{card.label}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Chart */}
                <div className="bg-white dark:bg-[#1e2024] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="h-96">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Loading chart data...</p>
                            </div>
                        ) : categoryData.length > 0 ? (
                            <Bar data={chartData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">No category data available. Create some categories and portfolios to see the chart.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-[#1e2024] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                        <h3 className="text-xl font-bold mb-4">Category Distribution</h3>
                        <div className="space-y-3">
                            {categoryData.length > 0 ? (
                                categoryData.map((cat, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                                            <span className="font-medium">{cat.name}</span>
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-400">{cat.count} projects</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No categories yet</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1e2024] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                        <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800">
                                <span className="text-gray-600 dark:text-gray-400">Total Content Items</span>
                                <span className="text-2xl font-bold">{stats.services + stats.portfolios + stats.testimonials}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800">
                                <span className="text-gray-600 dark:text-gray-400">Most Popular Category</span>
                                <span className="font-bold">
                                    {categoryData.length > 0
                                        ? categoryData.reduce((prev, current) => (prev.count > current.count) ? prev : current).name
                                        : "N/A"
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Avg Projects per Category</span>
                                <span className="font-bold">
                                    {categoryData.length > 0
                                        ? (stats.portfolios / categoryData.length).toFixed(1)
                                        : "0"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
