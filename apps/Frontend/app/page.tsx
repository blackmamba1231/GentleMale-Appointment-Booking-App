"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Scissors, Clock, Star, Users, Calendar, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const services = [
    {
      name: "Haircut & Styling",
      description: "Professional cuts and styling for all hair types",
      icon: Scissors,
      price: "From $45",
    },
    {
      name: "Hair Coloring",
      description: "Expert color treatments and highlights",
      icon: Sparkles,
      price: "From $85",
    },
    {
      name: "Hair Treatment",
      description: "Deep conditioning and repair treatments",
      icon: Star,
      price: "From $65",
    },
  ]
  const { user, refreshToken } = useAuth();
  useEffect(() => {
    refreshToken();
  }, [])
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Professional Salon Services
            <span className="text-primary block">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Book your perfect appointment with our expert stylists. Experience premium salon services in a welcoming,
            professional environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                <Calendar className="h-5 w-5 mr-2" />
                Book Now
              </Button>
            </Link>
           {user?  
            (<Link href="/profile">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Profile
              </Button>
            </Link>):
            (<Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Sign In
              </Button>
            </Link>)
          }
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our range of professional salon services designed to make you look and feel your best.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-primary">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Easy Booking</h3>
              <p className="text-muted-foreground">
                Schedule your appointments online 24/7 with our simple booking system.
              </p>
            </div>

            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Expert Stylists</h3>
              <p className="text-muted-foreground">
                Our team of professional stylists are trained in the latest techniques and trends.
              </p>
            </div>

            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Premium Experience</h3>
              <p className="text-muted-foreground">
                Enjoy a relaxing, luxurious experience in our modern, well-equipped salon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">SalonBook</span>
          </div>
          <p className="text-muted-foreground">© 2024 SalonBook. Professional salon appointment management.</p>
        </div>
      </footer>
    </div>
  )
}
