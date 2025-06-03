"use client"

import { MapPin, Mail, Phone } from "lucide-react"

const Footer = () => {
  const footerSections = [
    {
      title: "Rogue Caravans",
      links: [
        { name: "SRT - Touring", href: "/srt-touring" },
        { name: "SRT - Touring", href: "/srt-touring-2" },
        { name: "SRT - Touring", href: "/srt-touring-3" },
      ],
    },
    {
      title: "Buers",
      links: [
        { name: "In-stock", href: "/in-stock" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Caravan",
      links: [
        { name: "Make Your Caravan", href: "/make-caravan" },
        { name: "Rogue Caravans Colour", href: "/caravan-colours" },
      ],
    },
    {
      title: "Sell Caravan",
      links: [
        { name: "Rogue Caravans", href: "/sell-rogue" },
        { name: "Small Caravan", href: "/sell-small" },
      ],
    },
  ]

  const contactInfo = {
    location: "Tauranga new Zealand",
    email: "william@roguecaravans.co.nz",
    phone: "+9210742182",
  }

  return (
    <footer className="bg-slate-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          {/* Logo Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <div className="text-3xl font-bold text-white">
                  <span className="relative">
                    <span className="text-yellow-400">R</span>
                    <span className="absolute -top-1 -right-1 h-4 w-8 bg-yellow-400 transform rotate-12"></span>
                  </span>
                  <span className="ml-2">ROGUE</span>
                </div>
                <div className="text-sm text-yellow-400 font-medium tracking-wider text-center mt-1">Caravans</div>
              </div>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-yellow-400 font-semibold text-lg">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center"
                      >
                        <span className="text-yellow-400 mr-2">›</span>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-yellow-400 font-semibold text-lg">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{contactInfo.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 break-all"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              Copyright © 2025 All rights reserved. WWW.ROGUECARAVANS.CO.NZ
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 text-sm">
              <a href="/sitemap" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
                Sitemap
              </a>
              <span className="text-gray-400">|</span>
              <a href="/terms" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
                Terms of Use
              </a>
              <span className="text-gray-400">|</span>
              <a href="/privacy" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
