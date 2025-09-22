"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent} from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import {
  Scissors,
  Crown,
  Sparkles,
  Phone,
  MapPin,
  Clock,
  Award,
  CheckCircle,
  Star,
  Quote,
  ArrowRight,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
  })
  const stats = [
    { number: "2500+", label: "Happy Clients" },
    { number: "4", label: "Years Experience" },
    { number: "15+", label: "Expert Stylists" },
    { number: "98%", label: "Satisfaction Rate" },
  ]
  const galleryImages = [
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ]

  const services = [
    {
      name: "Classic Haircuts",
      price: "₹200",
      duration: "30 min",
      description: "Traditional and modern cuts tailored to your style",
      image: "/classic.jpg?height=400&width=350",
      icon: Scissors,
    },
    {
      name: "Beard Grooming",
      price: "₹100",
      duration: "25 min",
      description: "Professional beard trimming and styling",
      image: "/beard.jpg?height=400&width=350",
      icon: Crown,
    },
    {
      name: "Premium Styling",
      price: "₹600",
      duration: "45 min",
      description: "Complete styling with premium products",
      image: "/premium.jpg?height=400&width=350",
      icon: Sparkles,
    },
  ]
  const testimonials = [
    {
      name: "Arjun Mehra",
      rating: 5,
      text: "Best haircut I've ever had. The attention to detail is incredible and the atmosphere is so professional.",
      image: "/placeholder.svg?height=80&width=80",
      service: "Classic Cut",
    },
    {
      name: "Rohit Khanna",
      rating: 5,
      text: "Amazing beard grooming service. They really know what they're doing and the results speak for themselves.",
      image: "/placeholder.svg?height=80&width=80",
      service: "Beard Styling",
    },
    {
      name: "Kunal Singh",
      rating: 5,
      text: "The premium styling package is worth every penny. I always leave feeling like a new person.",
      image: "/placeholder.svg?height=80&width=80",
      service: "Premium Package",
    },
  ]
  const { user, refreshToken } = useAuth();
  useEffect(() => {
    refreshToken();
  }, [])
  
  return (
    <div className="min-h-screen bg-white">
    <Navigation />

    {/* Hero Section */}
    <section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <div className="space-y-8 z-10 relative">
            <div className="space-y-6">
              <Badge className="bg-amber-100 text-amber-800 px-4 py-2 text-sm font-medium w-fit">
                Premium Men's Grooming
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900">
                Where Style
                <span className="block text-amber-600">Meets Precision</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Experience the art of traditional barbering combined with modern techniques. Every cut is crafted to
                perfection by our master stylists.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                asChild
              >
                <Link href="/booking">
                  <Scissors className="mr-2 h-5 w-5" />
                  Book Appointment
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-4 rounded-full transition-all duration-300 bg-transparent"
                asChild
              >
                <Link href="/store">View Our Products</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">2500+</div>
                <p className="text-gray-600">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">4 Years</div>
                <p className="text-gray-600">Experience</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-red-400/20 rounded-3xl blur-3xl"></div>
            <Image
              src="/hero2.jpg?height=700&width=500"
              alt="Professional barber at work"
              width={500}
              height={700}
              className="relative rounded-3xl shadow-2xl object-cover"
              priority
            />
            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Expert Stylists</p>
                  <p className="text-xs text-gray-600">Certified Professionals</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">5-Star Rated</p>
                  <p className="text-xs text-gray-600">Customer Favorite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Services Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-amber-100 text-amber-800 mb-4">Our Services</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Crafted for Excellence</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From classic cuts to modern styles, our expert barbers deliver precision and artistry in every service
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-400">{service.price}</div>
                        <div className="text-sm text-white/80">{service.duration}</div>
                      </div>
                    </div>
                    <p className="text-white/90 text-sm">{service.description}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-full transition-all duration-300"
                    asChild
                  >
                    <Link href="/booking">
                      Book Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>

    {/* Gallery Section */}
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-amber-100 text-amber-800 mb-4">Our Work</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Transformations</h2>
          <p className="text-xl text-gray-600">See the artistry and precision in every cut</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8" asChild>
            <Link href="/store">View More Work</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Testimonials Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-amber-100 text-amber-800 mb-4">Testimonials</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">What Our Clients Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.service}</p>
                    <div className="flex mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <Quote className="h-8 w-8 text-amber-200 mb-4" />
                <p className="text-gray-600 leading-relaxed italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Why Choose Us Section */}
    <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="bg-amber-600/20 text-amber-400 mb-6">Why Choose GentleMale</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">Excellence in Every Detail</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Master Craftsmen</h3>
                  <p className="text-gray-300">
                    Our barbers are trained in both traditional and modern techniques, ensuring every cut is a
                    masterpiece.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Premium Experience</h3>
                  <p className="text-gray-300">
                    From the moment you walk in, enjoy luxury amenities and personalized service tailored to you.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Satisfaction Guaranteed</h3>
                  <p className="text-gray-300">
                    We're not satisfied until you are. Every service comes with our commitment to excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-6xl font-bold text-amber-400 mb-2">{stat.number}</div>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Contact Section */}
    <section className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="bg-amber-600 text-white mb-6">Get In Touch</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Ready for Your Best Look?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Book your appointment today and experience the difference that expert craftsmanship makes.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Visit Our Salon</p>
                  <p className="text-gray-600">Shastri Nagar, Dehradun, Uttarakhand 248001</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Call Us</p>
                  <p className="text-gray-600">+91 83769 65423</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Opening Hours</p>
                  <p className="text-gray-600">Mon-Sat: 9AM-8PM, Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Your Appointment</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Your Name"
                  className="border-gray-200 focus:border-amber-500 rounded-lg"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
                <Input
                  placeholder="Phone Number"
                  className="border-gray-200 focus:border-amber-500 rounded-lg"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                />
                <Input
                  placeholder="Email Address"
                  className="border-gray-200 focus:border-amber-500 rounded-lg"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
                <Input
                  placeholder="Preferred Service"
                  className="border-gray-200 focus:border-amber-500 rounded-lg"
                  value={contactForm.service}
                  onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                />
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 text-lg font-semibold"
                  onClick={() => {
                    console.log("Form submitted:", contactForm)
                    window.location.href = "/booking"  // Redirect to booking page after form submission
                  }}
                >
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                <Scissors className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold">GentleMale</h3>
                <p className="text-gray-400">Premium Men's Grooming</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Where traditional craftsmanship meets modern style. Experience the art of precision grooming with our
              master barbers and premium services.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-amber-600" />
                <span className="text-gray-400">Shastri Nagar, Dehradun, Uttarakhand 248001</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-600" />
                <span className="text-gray-400">+91 83769 65423</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <span className="text-gray-400">Mon-Sat: 9AM-8PM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/booking" className="hover:text-amber-400 transition-colors">
                  Classic Cuts
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-amber-400 transition-colors">
                  Beard Grooming
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-amber-400 transition-colors">
                  Premium Styling
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-amber-400 transition-colors">
                  Hair Treatments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-amber-400 transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-amber-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 GentleMale. All rights reserved. Crafted with precision and care.</p>
        </div>
      </div>
    </footer>
  </div>
  )
}
