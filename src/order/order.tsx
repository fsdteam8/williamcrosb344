"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Download, LinkIcon } from "lucide-react"

interface OrderData {
  modelData?: any
  color?: any
  externalOptions?: any
  manufacturerOptions?: any
  vanariOptions?: any
  contactInfo?: any
}

export default function OrderPage() {
  const [searchParams] = useSearchParams()
  const [orderData, setOrderData] = useState<OrderData>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get order data from URL params
    const configData = searchParams.get("config")
    if (configData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(configData))
        setOrderData(parsedData)
      } catch (error) {
        console.error("Error parsing config data:", error)
      }
    }
    setLoading(false)
  }, [searchParams])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard!")
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  const basePrice = Number.parseFloat(orderData.modelData?.base_price || "104900")
  const selectedTheme = orderData.color?.selectedTheme
  const baseUrl = "https://ben10.scaleupdevagency.com"

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading order details...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Caravan Main View"
              className="w-full max-w-md mx-auto object-contain"
            />

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleCopyLink}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
              >
                <LinkIcon className="w-4 h-4" />
                COPY LINK
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD PDF
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-6">Your New {orderData.modelData?.name || "SRC-19E"}</h1>

          {/* Multiple Caravan Views */}
          <div className="flex justify-center gap-4 mb-8">
            <img
              src="/placeholder.svg?height=80&width=120"
              alt="Side View"
              className="w-24 h-16 object-contain border border-gray-600 rounded"
            />
            <img
              src="/placeholder.svg?height=80&width=120"
              alt="Rear View"
              className="w-24 h-16 object-contain border border-gray-600 rounded"
            />
          </div>
        </div>

        {/* Floorplan Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">Floorplan</span>
            <span className="text-sm">{orderData.modelData?.name || "SRC-19E"}</span>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <img
              src={selectedTheme ? `${baseUrl}/${selectedTheme.image}` : "/placeholder.svg?height=300&width=500"}
              alt="3D Floorplan"
              className="w-full max-w-lg mx-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=300&width=500"
              }}
            />
          </div>
        </div>

        {/* Configuration Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* External Colors */}
            <div>
              <h3 className="font-bold mb-2">External Base Colour</h3>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 border border-gray-600 rounded"></div>
                <span>Silver</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">External Decals Colour</h3>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-teal-500 border border-gray-600 rounded"></div>
                <span>Snowy Teal</span>
              </div>
            </div>

            {/* Interior Materials */}
            {selectedTheme && (
              <>
                <div>
                  <h3 className="font-bold mb-2">Flooring</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                      <img
                        src={`${baseUrl}/${selectedTheme.flooring_image}`}
                        alt="Flooring"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                        }}
                      />
                    </div>
                    <span className="text-sm">{selectedTheme.flooring_name}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Cabinetry</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                      <img
                        src={`${baseUrl}/${selectedTheme.cabinetry_1_image}`}
                        alt="Cabinetry"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                        }}
                      />
                    </div>
                    <span className="text-sm">{selectedTheme.cabinetry_1_name}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Tabletop And Splashback</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                        <img
                          src={`${baseUrl}/${selectedTheme.table_top_1_image}`}
                          alt="Benchtop"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                          }}
                        />
                      </div>
                      <span className="text-sm">{selectedTheme.table_top_1_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                        <img
                          src={`${baseUrl}/${selectedTheme.table_top_2_image}`}
                          alt="Splashback"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                          }}
                        />
                      </div>
                      <span className="text-sm">{selectedTheme.table_top_2_name}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Seating And Headboard</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                        <img
                          src={`${baseUrl}/${selectedTheme.seating_1_image}`}
                          alt="Fabric"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                          }}
                        />
                      </div>
                      <span className="text-sm">{selectedTheme.seating_1_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                        <img
                          src={`${baseUrl}/${selectedTheme.seating_2_image}`}
                          alt="Leather"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                          }}
                        />
                      </div>
                      <span className="text-sm">{selectedTheme.seating_2_name}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Pricing */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Base Price</h3>
                <span className="text-xl font-bold">${basePrice.toLocaleString()}.00</span>
              </div>

              <div className="text-sm text-gray-300 space-y-1">
                <p>Hot Dip Galvanised Chassis (orders placed from 14/07/23 onwards)</p>
                <p>100L Grey Water Tank</p>
                <p>Shower with Glass Door</p>
                <p>All on-road costs (3 year WOF & 1 year REGO)</p>
                <p>NZ Electrical WOF</p>
                <p>Green Self Containment Certificate (4 years)</p>
                <p>Gas to Go</p>
                <p>All SRC models come with a 5 year structural warranty and 2 year manufacturers warranty.</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Manufacturer Options</h3>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="text-sm text-gray-300 mt-2">
                <p>No additional manufacturer options selected</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Vanari Options</h3>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="text-sm text-gray-300 mt-2">
                <p>No additional vanari options selected</p>
              </div>
            </div>

            <div className="border-t border-gray-600 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl">Estimated Total Build Price</h3>
                <span className="text-2xl font-bold text-amber-400">${basePrice.toLocaleString()}.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="text-center pt-8 border-t border-gray-600">
          <div className="flex justify-center gap-4">
            <button
              onClick={handleCopyLink}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded font-bold"
            >
              COPY LINK
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded font-bold"
            >
              DOWNLOAD PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
