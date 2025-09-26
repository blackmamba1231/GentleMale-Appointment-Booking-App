"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import {Navigation} from "../../components/navigation"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  const stats = {
    totalBookings: 47,
    todayQueue: 12,
    revenue: 3420,
    lowStock: 3,
  }

  const recentBookings = [
    { id: 1, client: "Arnav Sharma", service: "Signature Cut", time: "09:30", status: "completed" },
    { id: 2, client: "Rajat Verma", service: "Beard Treatment", time: "10:00", status: "in-progress" },
    { id: 3, client: "Ishaan Malhotra", service: "Executive Package", time: "10:30", status: "waiting" },
    { id: 4, client: "Karan Mehta", service: "Signature Cut", time: "11:00", status: "confirmed" },
    { id: 5, client: "Siddharth Joshi", service: "Beard Treatment", time: "11:30", status: "confirmed" },
]


  const inventoryAlerts = [
    { product: "Premium Pomade", stock: 3, status: "critical" },
    { product: "Beard Oil Elixir", stock: 8, status: "low" },
    { product: "Clay Texture Paste", stock: 5, status: "low" },
  ]

  const queueData = [
    { position: 1, client: "Kunal Singh", service: "Beard Treatment", estimatedTime: "10 min" },
    { position: 2, client: "Pratham Negi", service: "Classic Cut", estimatedTime: "25 min" },
    { position: 3, client: "Sujeet Kumar", service: "Signature Cut", estimatedTime: "70 min" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "waiting":
        return "bg-amber-100 text-amber-800"
      case "confirmed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "waiting":
        return <Users className="h-4 w-4" />
      case "confirmed":
        return <Calendar className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <ProtectedRoute redirectTo="/login" requiredRole="ADMIN">
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-xl text-gray-600">Monitor your salon's performance and operations</p>
          </div>

          <div className="flex gap-2">
            {["today", "week", "month"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                onClick={() => setSelectedPeriod(period)}
                className={`capitalize rounded-full ₹{
                  selectedPeriod === period
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "hover:bg-amber-50 border-gray-200"
                }`}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  <p className="text-blue-100 text-sm flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% from yesterday
                  </p>
                </div>
                <Calendar className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Today's Queue</p>
                  <p className="text-3xl font-bold">{stats.todayQueue}</p>
                  <p className="text-amber-100 text-sm flex items-center mt-2">
                    <Clock className="h-4 w-4 mr-1" />3 in progress
                  </p>
                </div>
                <Users className="h-12 w-12 text-amber-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Revenue</p>
                  <p className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</p>
                  <p className="text-green-100 text-sm flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8% from last week
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Low Stock Items</p>
                  <p className="text-3xl font-bold">{stats.lowStock}</p>
                  <p className="text-red-100 text-sm flex items-center mt-2">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Needs attention
                  </p>
                </div>
                <Package className="h-12 w-12 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-amber-600" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(booking.status)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.client}</p>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{booking.time}</p>
                        <Badge className={`₹{getStatusColor(booking.status)} text-xs rounded-full`}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Queue & Inventory */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-amber-600" />
                  Current Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {queueData.map((item) => (
                    <div key={item.position} className="flex items-center justify-between p-3 rounded-lg bg-amber-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {item.position}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.client}</p>
                          <p className="text-xs text-gray-600">{item.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-amber-700">{item.estimatedTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inventory Alerts */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryAlerts.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                      <div>
                        <p className="font-medium text-gray-900">{item.product}</p>
                        <p className="text-sm text-gray-600">{item.stock} units left</p>
                      </div>
                      <Badge
                        className={`rounded-full ${
                          item.status === "critical" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white rounded-full">
                  Reorder Stock
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Charts Placeholder */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-amber-600" />
                Revenue Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-600">Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-green-600" />
                Service Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-600">Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
