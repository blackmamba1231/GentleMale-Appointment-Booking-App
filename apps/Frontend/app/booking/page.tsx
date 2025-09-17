"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Calendar, Clock, Loader2, Scissors } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/api"

const services = [
  { value: "haircut", label: "Haircut & Styling", price: "$45" },
  { value: "coloring", label: "Hair Coloring", price: "$85" },
  { value: "treatment", label: "Hair Treatment", price: "$65" },
  { value: "highlights", label: "Highlights", price: "$95" },
  { value: "blowout", label: "Blowout", price: "$35" },
  { value: "updo", label: "Updo Styling", price: "$55" },
]

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [loading, setLoading] = useState(false)
  const { user, accessToken } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Generate available time slots
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (!accessToken) {
      toast({
        title: "Error",
        description: "Please log in to book an appointment",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const appointmentDateTime = `${selectedDate}T${selectedTime}:00`

      await apiRequest(`${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/appointment/book`, {
        method: "POST",
        accessToken,
        body: JSON.stringify({
          service: selectedService,
          date: appointmentDateTime,
        }),
      })

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      })

      router.push("/my-appointments")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="CUSTOMER">
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Book Appointment</CardTitle>
                <CardDescription>Schedule your salon appointment with our expert stylists</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="service">Select Service</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            <div className="flex justify-between items-center w-full">
                              <span>{service.label}</span>
                              <span className="text-primary font-medium ml-4">{service.price}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Select Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={today}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Select Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedService && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium mb-2">Booking Summary</h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Service:</span>{" "}
                          {services.find((s) => s.value === selectedService)?.label}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Price:</span>{" "}
                          <span className="text-primary font-medium">
                            {services.find((s) => s.value === selectedService)?.price}
                          </span>
                        </p>
                        {selectedDate && (
                          <p>
                            <span className="text-muted-foreground">Date:</span>{" "}
                            {new Date(selectedDate).toLocaleDateString()}
                          </p>
                        )}
                        {selectedTime && (
                          <p>
                            <span className="text-muted-foreground">Time:</span> {selectedTime}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Scissors className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
