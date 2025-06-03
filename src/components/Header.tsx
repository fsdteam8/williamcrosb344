"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Navigation items structure
  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Rogue Caravans", href: "/caravans" },
    { name: "In-stock", href: "/in-stock" },
    {
      name: "Make Your Caravan",
      href: "/make-caravan",
      hasDropdown: true,
      dropdownItems: [
        { name: "Custom Build", href: "/custom-build" },
        { name: "Design Options", href: "/design-options" },
        { name: "Pricing", href: "/pricing" },
      ],
    },
    { name: "Contact us", href: "/contact" },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={`${
          scrolled ? "bg-slate-800 shadow-md" : "bg-slate-800"
        } transition-all duration-300 fixed top-0 left-0 right-0 z-50`}
      >
        {/* Desktop Header */}
        <div className="hidden md:block relative">

          {/* Desktop Navigation Content */}
          <nav className="relative z-10">
            <div className="container ">
              <div className="flex h-[105px] items-center justify-between">
                {/* Logo */}
                <div className="">
                      <img src="/assets/logo.webp" alt="" width={100} height={100} className="w-[200px]"/>
                </div>

                {/* Desktop Navigation */}
                <div className="ml-10 flex items-baseline space-x-8">
                  {navigationItems.map((item) => (
                    <div key={item.name} className="relative">
                      {item.hasDropdown ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="text-white hover:text-yellow-400 hover:bg-white/10 flex items-center gap-1 font-medium"
                            >
                              {item.name}
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <DropdownMenuItem
                                key={dropdownItem.name}
                                className="text-white hover:text-yellow-400 hover:bg-gray-700"
                              >
                                <a href={dropdownItem.href} className="w-full">
                                  {dropdownItem.name}
                                </a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <a
                          href={item.href}
                          className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                        >
                          {item.name}
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {/* Home Icon */}
                <div>
                  <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-white hover:bg-white/10">
                    <Home className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div
            className={`${
              scrolled ? "bg-slate-800" : "bg-slate-800/90 backdrop-blur-sm"
            } px-4 py-3 flex items-center justify-between transition-all duration-300`}
          >
            {/* Mobile Logo */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="relative">
                  <div className="text-xl font-bold">
                    <span className="relative">
                      <span className="text-yellow-400">R</span>
                      <span className="absolute -top-1 -right-1 h-2 w-4 bg-yellow-400 transform rotate-12"></span>
                    </span>
                    <span className="ml-1 text-white">ROGUE</span>
                  </div>
                  <div className="text-xs text-yellow-400 font-medium tracking-wider">Caravans</div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-yellow-400 transition-colors duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="min-h-screen bg-slate-800">
            {/* Header with logo and close button */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-700">
              {/* Mobile Logo */}
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="text-xl font-bold">
                      <span className="relative">
                        <span className="text-yellow-400">R</span>
                        <span className="absolute -top-1 -right-1 h-2 w-4 bg-yellow-400 transform rotate-12"></span>
                      </span>
                      <span className="ml-1 text-white">ROGUE</span>
                    </div>
                    <div className="text-xs text-yellow-400 font-medium tracking-wider">Caravans</div>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-white rounded-sm p-1 hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-800" />
              </button>
            </div>

            {/* Menu items */}
            <div className="px-6 py-8 space-y-6">
              {navigationItems.map((item) => (
                <div key={item.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <a
                      href={item.href}
                      className="text-yellow-400 hover:text-yellow-300 font-medium text-lg transition-colors duration-200"
                      onClick={item.hasDropdown ? undefined : () => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                    {item.hasDropdown && <ChevronDown className="h-5 w-5 text-yellow-400" />}
                  </div>

                  {/* Dropdown items */}
                  {item.hasDropdown && item.dropdownItems && (
                    <div className="pl-4 space-y-3 border-l-2 border-yellow-400/30">
                      {item.dropdownItems.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropdownItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
              <div className="text-gray-400 text-sm">luxury touring models, our in-stock</div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  )
}

export default Header
