"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Scissors } from "lucide-react"

import { usePathname } from "next/navigation"

export function Navigation() {
  const { user, logout, refreshToken } = useAuth()
  useEffect(() => {
    refreshToken();
  }, [])
  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/booking", label: "Booking" },
  ]
  const adminNavItems = [
    { href: "/", label: "Home" },
    { href: "/booking", label: "Booking" },
    { href: "/admin", label: "Admin Dashboard" },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
              <Scissors className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 tracking-wider">GENTLEMALE</div>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === "CUSTOMER" && (
                  <>
                <div className="hidden md:flex items-center space-x-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span
                        className={`text-sm font-medium transition-colors duration-200 hover:text-amber-600 ${
                          isActive(item.href) ? "text-amber-600" : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Contact Button */}
                <div className="hidden md:flex">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-6" asChild>
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </div>

                {/* Mobile Menu Button */}
                <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
                  </>
                )}

                {user.role === "ADMIN" && (
                  <>
                   <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`text-sm font-medium transition-colors duration-200 hover:text-amber-600 ${
                    isActive(item.href) ? "text-amber-600" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Contact Button */}
          <div className="hidden md:flex">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-6" asChild>
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button></>
                )}

            {isOpen && (
                      <div className="md:hidden py-4 border-t border-gray-100">
                        <div className="space-y-2">
                          {navItems.map((item) => (
                            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                              <div
                                className={`block px-4 py-2 text-sm font-medium transition-colors duration-200 hover:text-amber-600 hover:bg-amber-50 rounded-lg ${
                                  isActive(item.href) ? "text-amber-600 bg-amber-50" : "text-gray-700"
                                }`}
                              >
                                {item.label}
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-full" asChild>
                            <Link href="/booking">Book Now</Link>
                          </Button>
                        </div>
                      </div>
                    )}
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-amber-700 hover:text-white rounded-xl px-6">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-6" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
