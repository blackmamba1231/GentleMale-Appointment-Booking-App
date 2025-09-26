"use client"

import {  useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, Scissors, Crown, Sparkles, MapPin } from "lucide-react"
import{ Navigation} from "../../components/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState("2024-01-15")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [step, setStep] = useState(1) 
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "", 
    notes: "",
  })

  const { user, refreshToken } = useAuth();
  useEffect(() => {
    refreshToken();
  }, [])
  const services = [
    {
      id: "classic",
      name: "Classic Haircut",
      price: 200,
      duration: 30,
      description: "Traditional and modern cuts tailored to your style",
      icon: Scissors,
      image: "/classic.jpg?height=200&width=300",
    },
    {
      id: "beard",
      name: "Beard Grooming",
      price: 100,
      duration: 25,
      description: "Professional beard trimming and styling",
      icon: Crown,
      image: "/beard.jpg?height=200&width=300",
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 600,
      duration: 60,
      description: "Complete styling with wash, cut, and premium products",
      icon: Sparkles,
      image: "/premium.jpg?height=200&width=300",
    },
    {
      id: "combo",
      name: "Cut & Beard Combo",
      price: 300,
      duration: 45,
      description: "Perfect combination of haircut and beard grooming",
      icon: Scissors,
      image: "/hero.jpg?height=200&width=300",
    },
  ]

  const timeSlots = [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: false },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
  ]

  const upcomingDates = [
    { date: "2024-01-15", day: "Tue", dayNum: "15", available: 8 },
    { date: "2024-01-16", day: "Wed", dayNum: "16", available: 12 },
    { date: "2024-01-17", day: "Thu", dayNum: "17", available: 6 },
    { date: "2024-01-18", day: "Fri", dayNum: "18", available: 15 },
    { date: "2024-01-19", day: "Sat", dayNum: "19", available: 4 },
    { date: "2024-01-20", day: "Sun", dayNum: "20", available: 10 },
  ]

  const selectedServiceData = services.find((s) => s.id === selectedService)

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <ProtectedRoute redirectTo="/login" requiredRole="CUSTOMER">
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience premium grooming with our expert stylists. Choose your service, pick your time, and we'll take
            care of the rest.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNum ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNum}
                </div>
                <span className={`ml-2 font-medium ${step >= stepNum ? "text-amber-600" : "text-gray-600"}`}>
                  {stepNum === 1 ? "Service" : stepNum === 2 ? "Date & Time" : "Contact"}
                </span>
                {stepNum < 3 && <div className="w-8 h-0.5 bg-gray-300 mx-4"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Service</h2>
                <p className="text-gray-600">Select the service that best fits your grooming needs</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service) => {
                  const Icon = service.icon
                  return (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                        selectedService === service.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={service.image || "/placeholder.svg"}
                              alt={service.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                              {selectedService === service.id && <CheckCircle className="h-6 w-6 text-green-500" />}
                            </div>
                            <p className="text-gray-600 mb-3">{service.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Badge className="bg-amber-100 text-amber-800">₹{service.price}</Badge>
                                <Badge variant="outline">{service.duration} min</Badge>
                              </div>
                              <Icon className="h-6 w-6 text-amber-600" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleNextStep}
                  disabled={!selectedService}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full text-lg font-semibold"
                >
                  Continue to Date & Time
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Select Date & Time</h2>

                {/* Date Selection */}
                <Card className="border-0 shadow-lg mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-amber-600" />
                      Choose Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {upcomingDates.map((date) => (
                        <div
                          key={date.date}
                          className={`p-4 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                            selectedDate === date.date
                              ? "bg-amber-600 text-white"
                              : "bg-gray-100 hover:bg-amber-100 text-gray-900"
                          }`}
                          onClick={() => setSelectedDate(date.date)}
                        >
                          <div className="font-semibold">{date.day}</div>
                          <div className="text-2xl font-bold">{date.dayNum}</div>
                          <div className="text-xs mt-1">{date.available} slots</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Time Selection */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-amber-600" />
                      Available Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                            !slot.available
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : selectedTime === slot.time
                                ? "bg-amber-600 text-white"
                                : "bg-gray-100 hover:bg-amber-100 text-gray-900"
                          }`}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Booking Summary */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedServiceData && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Service:</span>
                          <span className="text-gray-900">{selectedServiceData.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Duration:</span>
                          <span className="text-gray-900">{selectedServiceData.duration} minutes</span>
                        </div>
                      </>
                    )}
                    {selectedDate && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Date:</span>
                        <span className="text-gray-900">{selectedDate}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Time:</span>
                        <span className="text-gray-900">{selectedTime}</span>
                      </div>
                    )}
                    {selectedServiceData && (
                      <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                        <span>Total:</span>
                        <span className="text-amber-600">₹{selectedServiceData.price}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Salon Info */}
                <Card className="border-0 shadow-lg bg-amber-50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-amber-600" />
                      Salon Location
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>Shastri Nagar, Dehradun, Uttarakhand 248001</p>
                      <p>Phone: +91 83769 65423</p>
                      <p>Free parking available</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-4">
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {step === 3 && (
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          <Input
                            placeholder="First Name"
                            className="border-gray-200 focus:border-amber-500"
                            value={contactForm.firstName}
                            onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          <Input
                            placeholder="Last Name"
                            className="border-gray-200 focus:border-amber-500"
                            value={contactForm.lastName}
                            onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <Input
                          placeholder="+91 12345 67890"
                          className="border-gray-200 focus:border-amber-500"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <Input
                          placeholder="youremail@example.com"
                          type="email"
                          className="border-gray-200 focus:border-amber-500"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          placeholder="Any specific requests or preferences..."
                          className="w-full p-3 border border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none resize-none"
                          rows={3}
                          value={contactForm.notes}
                          onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Final Summary */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Appointment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedServiceData && (
                      <>
                        <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                          <selectedServiceData.icon className="h-6 w-6 text-amber-600" />
                          <div>
                            <p className="font-semibold text-gray-900">{selectedServiceData.name}</p>
                            <p className="text-sm text-gray-600">{selectedServiceData.duration} minutes</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">Date:</span>
                            <span className="text-gray-900">{selectedDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Time:</span>
                            <span className="text-gray-900">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold border-t pt-3">
                            <span>Total:</span>
                            <span className="text-amber-600">₹{selectedServiceData.price}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Confirmation Note */}
                <Card className="border-0 shadow-lg bg-blue-50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-blue-900 mb-2">Booking Confirmation</h3>
                    <p className="text-blue-800 text-sm">
                      You'll receive a confirmation email and SMS with your appointment details. Please arrive 10
                      minutes early for your appointment.
                    </p>
                  </CardContent>
                </Card>

                <div className="flex space-x-4">
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent"
                  >
                    Back
                  </Button>
                  <Button
                    disabled={!contactForm.firstName || !contactForm.phone || !contactForm.email}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
