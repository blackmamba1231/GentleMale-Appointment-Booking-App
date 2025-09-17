"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Settings, Check, Loader2, Calendar, User, Mail, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AdminAppointment {
  id: string
  service: string
  date: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  customer: {
    id: string
    name?: string
    email: string
    phone?: string
  }
  createdAt: string
}

const serviceLabels: Record<string, string> = {
  haircut: "Haircut & Styling",
  coloring: "Hair Coloring",
  treatment: "Hair Treatment",
  highlights: "Highlights",
  blowout: "Blowout",
  updo: "Updo Styling",
}

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const { user, accessToken } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchAllAppointments()
  }, [])

  const fetchAllAppointments = async () => {
    if (!accessToken) return

    try {
      const data = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/appointment/all-appointments`,
        {
          accessToken,
        },
      )
      setAppointments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmAppointment = async (appointmentId: string) => {
    if (!accessToken) return

    setConfirmingId(appointmentId)
    try {
      await apiRequest(`${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/appointment/confirm/${appointmentId}`, {
        method: "POST",
        accessToken,
      })

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "CONFIRMED" as const } : apt)),
      )

      toast({
        title: "Success",
        description: "Appointment confirmed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to confirm appointment",
        variant: "destructive",
      })
    } finally {
      setConfirmingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const getStats = () => {
    const total = appointments.length
    const pending = appointments.filter((apt) => apt.status === "PENDING").length
    const confirmed = appointments.filter((apt) => apt.status === "CONFIRMED").length
    const cancelled = appointments.filter((apt) => apt.status === "CANCELLED").length

    return { total, pending, confirmed, cancelled }
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="container mx-auto px-4 py-16 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading dashboard...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const stats = getStats()

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-8">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage salon appointments and customers</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                </CardContent>
              </Card>
            </div>

            {/* Appointments Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>Manage customer appointments and confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No appointments yet</h3>
                    <p className="text-muted-foreground">Appointments will appear here once customers start booking.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appointment) => {
                          const { date, time } = formatDateTime(appointment.date)
                          return (
                            <TableRow key={appointment.id}>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                      {appointment.customer.name || "No name provided"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span>{appointment.customer.email}</span>
                                  </div>
                                  {appointment.customer.phone && (
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                      <Phone className="h-3 w-3" />
                                      <span>{appointment.customer.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">
                                  {serviceLabels[appointment.service] || appointment.service}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{date}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <span>{time}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                              <TableCell>
                                {appointment.status === "PENDING" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleConfirmAppointment(appointment.id)}
                                    disabled={confirmingId === appointment.id}
                                  >
                                    {confirmingId === appointment.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4 mr-1" />
                                        Confirm
                                      </>
                                    )}
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
