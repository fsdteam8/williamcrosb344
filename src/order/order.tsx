"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Download, LinkIcon } from "lucide-react"
import type { OrderData } from "@/lib/types"



export default function OrderPage() {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [modelColorImages, setModelColorImages] = useState<{ image: string; image2: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderData = async () => {
      if (orderId) {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`)
          if (response.ok) {
            const result = await response.json()
            if (result.success) {
              // Check if the response has the new structure with model_color_wise_image
              if (result.data.order && result.data.model_color_wise_image) {
                setOrderData(result.data.order)
                setModelColorImages(result.data.model_color_wise_image)
              } else {
                // Fall back to the old structure
                setOrderData(result.data)
              }
            }
          }
        } catch (error) {
          console.error("Error fetching order data:", error)
        }
      } else {
        // Fallback to URL params if no orderId
        const configData = searchParams.get("config")
        if (configData) {
          try {
            const parsedData = JSON.parse(decodeURIComponent(configData))
            // Convert form data to order-like structure for display
            setOrderData(parsedData as OrderData)
          } catch (error) {
            console.error("Error parsing config data:", error)
          }
        }
      }
      setLoading(false)
    }

    fetchOrderData()
  }, [orderId, searchParams])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard!")
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading order details...</div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Order not found</div>
      </div>
    )
  }


  console.log("Order Data:", orderData)

  return (
    <div className="text-white py-24 p-4">
      <div className=" mx-auto px-6  max-w-4xl bg-gray-800 rounded-lg p-4">
        {/* Header Section with Action Buttons */}
        <div className="relative mb-8">
          <div className="absolute mt-[-30px] lg:top-4 right-4 flex gap-2 z-10">
            <button
              onClick={handleCopyLink}
              className="bg-amber-600 hover:bg-amber-700 text-white px-2 lg:px-4 py-2 rounded flex items-center gap-2 text-sm font-bold"
            >
              <LinkIcon className="w-4 h-4" />
              COPY LINK
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold"
            >
              <Download className="w-4 h-4" />
              DOWNLOAD PDF
            </button>
          </div>

          {/* Main Caravan Image */}
          <div className="text-center mb-6">
            <img
              src={
                orderData.vehicle_model?.outer_image
                  ? `${baseUrl}/${orderData.vehicle_model.outer_image}`
                  : "/placeholder.svg?height=200&width=400"
              }
              alt="Caravan Main View"
              className="w-full max-w-md mx-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=200&width=400"
              }}
            />
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">Your New {orderData.vehicle_model?.name || "SRC-19E"}</h1>

          {/* Multiple Caravan Views */}
          <div className="flex justify-center gap-4 mb-8">
            {modelColorImages?.image ? (
              <img
                src={`${baseUrl}/${modelColorImages.image}`}
                alt="Right Side View"
                className="w-24 lg:w-[200px] h-16 lg:h-[150px] object-contain border border-gray-600 rounded"
              />
            ) : (
              <img
                src="/placeholder.svg?height=80&width=120"
                alt="Side View"
                className="w-24 h-16 object-contain border border-gray-600 rounded"
              />
            )}

            {modelColorImages?.image2 ? (
              <img
                src={`${baseUrl}/${modelColorImages.image2}`}
                alt="Left Side View"
                className="w-24 lg:w-[200px] h-16 lg:h-[150px] object-contain border border-gray-600 rounded"
              />
            ) : (
              <img
                src="/placeholder.svg?height=80&width=120"
                alt="Rear View"
                className="w-24 h-16 object-contain border border-gray-600 rounded"
              />
            )}
          </div>
        </div>

        {/* Floorplan Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">Floorplan</span>
            <span className="text-sm text-amber-400">{orderData.vehicle_model?.name}</span>
          </div>

          <div className="">
            <img
              src={
                orderData.theme?.image ? `${baseUrl}/${orderData.theme.image}` : "/placeholder.svg?height=300&width=500"
              }
              alt="3D Floorplan"
              className="w-full max-w-lg mx-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=300&width=500"
              }}
            />
          </div>
        </div>

        {/* Configuration Details */}
        <div className="space-y-6 mb-8">
          {/* External Colors */}
          <div>
            <h3 className="font-bold mb-2">External Base Colour</h3>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                <img
                  src={
                    orderData.colors?.[0]?.image
                      ? `${baseUrl}/${orderData.colors[0].image}`
                      : "/placeholder.svg?height=24&width=24"
                  }
                  alt="Base Color"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                  }}
                />
              </div>
              <span>{orderData.colors?.[0]?.name || "Silver"}</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">External Decals Colour</h3>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                <img
                  src={
                    orderData.colors?.[1]?.image
                      ? `${baseUrl}/${orderData.colors[1].image}`
                      : "/placeholder.svg?height=24&width=24"
                  }
                  alt="Decal Color"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                  }}
                />
              </div>
              <span>{orderData.colors?.[1]?.name || "Snowy Teal"}</span>
            </div>
          </div>

          {/* Interior Materials */}
          {orderData.theme && (
            <>
              <div>
                <h3 className="font-bold mb-2">Flooring</h3>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                    <img
                      src={`${baseUrl}/${orderData.theme.flooring_image}`}
                      alt="Flooring"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                      }}
                    />
                  </div>
                  <span className="text-sm">{orderData.theme.flooring_name}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Cabinetry</h3>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                    <img
                      src={`${baseUrl}/${orderData.theme.cabinetry_1_image}`}
                      alt="Cabinetry"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                      }}
                    />
                  </div>
                  <span className="text-sm">{orderData.theme.cabinetry_1_name}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Tabletop And Splashback</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                      <img
                        src={`${baseUrl}/${orderData.theme.table_top_1_image}`}
                        alt="Benchtop"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                        }}
                      />
                    </div>
                    <span className="text-sm">{orderData.theme.table_top_1_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                      <img
                        src={`${baseUrl}/${orderData.theme.table_top_2_image}`}
                        alt="Splashback"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                        }}
                      />
                    </div>
                    <span className="text-sm">{orderData.theme.table_top_2_name}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Seating And Headboard</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                      <img
                        src={`${baseUrl}/${orderData.theme.seating_1_image}`}
                        alt="Fabric"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                        }}
                      />
                    </div>
                    <span className="text-sm">{orderData.theme.seating_1_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border border-gray-600 rounded overflow-hidden">
                      <img
                        src={`${baseUrl}/${orderData.theme.seating_2_image}`}
                        alt="Leather"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                        }}
                      />
                    </div>
                    <span className="text-sm">{orderData.theme.seating_2_name}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pricing Section */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Base Price</h3>
              <span className="text-xl font-bold">
                ${Number.parseFloat(orderData.base_price || "79500").toLocaleString()}
              </span>
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
              <span className="font-bold">
                $
                {orderData.additional_options
                  ?.filter((opt) => opt.type === "Manufacturer Options")
                  .reduce((sum, opt) => sum + Number.parseFloat(opt.price), 0)
                  .toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="text-sm text-gray-300 mt-2 space-y-1">
              {(orderData.additional_options ?? []).filter((opt) => opt.type === "Manufacturer Options").length > 0 ? (
                (orderData.additional_options ?? [])
                  .filter((opt) => opt.type === "Manufacturer Options")
                  .map((option) => (
                    <div key={option.id} className="flex justify-between">
                      <span>{option.name}</span>
                      <span>${Number.parseFloat(option.price).toFixed(2)}</span>
                    </div>
                  ))
              ) : (
                <p>No additional manufacturer options selected</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Vanari Options</h3>
              <span className="font-bold">
                $
                {orderData.additional_options
                  ?.filter((opt) => opt.type === "Vanari Options")
                  .reduce((sum, opt) => sum + Number.parseFloat(opt.price), 0)
                  .toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="text-sm text-gray-300 mt-2 space-y-1">
              {(orderData.additional_options ?? []).filter((opt) => opt.type === "Vanari Options").length > 0 ? (
                (orderData.additional_options ?? [])
                  .filter((opt) => opt.type === "Vanari Options")
                  .map((option) => (
                    <div key={option.id} className="flex justify-between">
                      <span>{option.name}</span>
                      <span>${Number.parseFloat(option.price).toFixed(2)}</span>
                    </div>
                  ))
              ) : (
                <p>No additional vanari options selected</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm lg:text-2xl">Estimated Total Build Price</h3>
              <span className="  font-bold text-amber-400">
                ${Number.parseFloat(orderData.total_price || orderData.base_price).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
