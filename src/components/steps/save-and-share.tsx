"use client"

import type { StepProps } from "@/lib/types"
import { useState, useEffect } from "react"

export default function SaveAndShare({ formData, updateFormData }: StepProps) {
  const [manufacturerOptions, setManufacturerOptions] = useState<any[]>([])
  const [vanariOptions, setVanariOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [orderResponse, setOrderResponse] = useState<any>(null)

  // Fetch options data to display selected items
  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        setLoading(true)
        const baseUrl = "https://ben10.scaleupdevagency.com"

        // Fetch manufacturer options
        const manufacturerResponse = await fetch(`${baseUrl}/api/addtional-options?type=Manufacturer Options`)
        if (manufacturerResponse.ok) {
          const manufacturerData = await manufacturerResponse.json()
          setManufacturerOptions(manufacturerData.data?.data || [])
        }

        // Fetch vanari options
        const vanariResponse = await fetch(`${baseUrl}/api/addtional-options?type=Vanari Options`)
        if (vanariResponse.ok) {
          const vanariData = await vanariResponse.json()
          setVanariOptions(vanariData.data?.data || [])
        }

        setLoading(false)
      } catch (error) {
        console.warn("Error fetching options data:", error)
        setLoading(false)
      }
    }

    fetchOptionsData()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    updateFormData("contactInfo", {
      ...formData.contactInfo,
      [field]: value,
    })
  }

  const handleSaveAndView = async () => {
    try {
      setSaving(true)

      // Prepare order data
      const orderData = {
        // Customer Information
        first_name: formData.contactInfo?.firstName || "",
        last_name: formData.contactInfo?.lastName || "",
        email: formData.contactInfo?.email || "",
        phone: formData.contactInfo?.phone || "",
        postal_code: formData.contactInfo?.postalCode || "",

        // Model Information
        vehicle_model_id: formData.modelData?.id || null,
        model_name: formData.modelData?.name || "",

        // Theme/Color Information
        theme_id: formData.color?.themeId || null,
        theme_name: formData.color?.themeName || "",

        // External Colors
        base_color_id: formData.externalOptions?.baseColorId || null,
        base_color_name: formData.externalOptions?.baseColor || "",
        decal_color_id: formData.externalOptions?.decalColorId || null,
        decal_color_name: formData.externalOptions?.decalColor || "",

        // Selected Options
        manufacturer_options: Object.keys(formData.manufacturerOptions || {})
          .filter((optionId) => formData.manufacturerOptions[optionId])
          .map((optionId) => Number.parseInt(optionId)),

        vanari_options: Object.keys(formData.vanariOptions || {})
          .filter((optionId) => formData.vanariOptions[optionId])
          .map((optionId) => Number.parseInt(optionId)),

        // Pricing
        base_price: Number.parseFloat(formData.modelData?.base_price || "79500"),
        manufacturer_options_price: calculateManufacturerOptionsPrice(),
        vanari_options_price: calculateVanariOptionsPrice(),
        total_price: calculateTotalPrice(),

        // Additional metadata
        configuration_data: JSON.stringify(formData),
      }

      console.log("Sending order data:", orderData)

      // Post to API
      const response = await fetch("https://ben10.scaleupdevagency.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Order saved successfully:", result)
        setOrderResponse(result)
        setShowModal(true)
      } else {
        const errorData = await response.json()
        console.error("Failed to save order:", errorData)
        alert("Failed to save configuration. Please try again.")
      }
    } catch (error) {
      console.error("Error saving order:", error)
      alert("An error occurred while saving. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Calculate pricing
  const basePrice = Number.parseFloat(formData.modelData?.base_price || "79500")

  const calculateManufacturerOptionsPrice = () => {
    let total = 0
    if (formData.manufacturerOptions && typeof formData.manufacturerOptions === "object") {
      Object.keys(formData.manufacturerOptions).forEach((optionId) => {
        if (formData.manufacturerOptions[optionId]) {
          const option = manufacturerOptions.find((opt) => opt.id === Number.parseInt(optionId))
          if (option) {
            total += Number.parseFloat(option.price)
          }
        }
      })
    }
    return total
  }

  const calculateVanariOptionsPrice = () => {
    let total = 0
    if (formData.vanariOptions && typeof formData.vanariOptions === "object") {
      Object.keys(formData.vanariOptions).forEach((optionId) => {
        if (formData.vanariOptions[optionId]) {
          const option = vanariOptions.find((opt) => opt.id === Number.parseInt(optionId))
          if (option) {
            total += Number.parseFloat(option.price)
          }
        }
      })
    }
    return total
  }

  const calculateTotalPrice = () => {
    return basePrice + calculateManufacturerOptionsPrice() + calculateVanariOptionsPrice()
  }

  const manufacturerOptionsPrice = calculateManufacturerOptionsPrice()
  const vanariOptionsPrice = calculateVanariOptionsPrice()
  const totalPrice = calculateTotalPrice()

  const baseUrl = "https://ben10.scaleupdevagency.com"
  const selectedTheme = formData.color?.selectedTheme

  return (
    <>
      <div className="text-white mt-[80px]">
        <div className="flex justify-center">
          {/* Configuration Summary - Full Width */}
          <div className="bg-[#1e1e1e] p-6 max-w-2xl w-full">
            <div className="space-y-6">
              {/* Caravan Preview */}
              <div className="text-center">
                <div className="mt-[-170px] mb-6 flex justify-center">
                  <img
                    src={`${baseUrl}/${formData.modelData?.outer_image}`}
                    alt={`${formData.modelData?.name} Interior Preview`}
                    className="w-[350px] h-[300px] object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=300&width=350"
                    }}
                  />
                </div>
                <h3 className="text-white font-bold">Your New {formData.modelData?.name || "SRC-14"}</h3>
              </div>

              {/* Exterior Colors */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">External Base Colour</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Silver</span>
                    <div className="w-4 h-4 bg-gray-300 border border-gray-600"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">External Decals Colour</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Snowy Teal</span>
                    <div className="w-4 h-4 bg-teal-500 border border-gray-600"></div>
                  </div>
                </div>
              </div>

              {/* Interior Preview */}
              <div className="aspect-video relative">
                {selectedTheme ? (
                  <img
                    src={`${baseUrl}/${selectedTheme.image}`}
                    alt="Interior Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                ) : (
                  <img
                    src="/placeholder.svg?height=200&width=300"
                    alt="Interior Preview"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Interior Materials */}
              {selectedTheme && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span>{selectedTheme.flooring_name}</span>
                    <div className="w-4 h-4 border border-gray-600">
                      <img
                        src={`${baseUrl}/${selectedTheme.flooring_image}`}
                        alt="Flooring"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=16&width=16"
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>{selectedTheme.cabinetry_1_name}</span>
                    <div className="w-4 h-4 border border-gray-600">
                      <img
                        src={`${baseUrl}/${selectedTheme.cabinetry_1_image}`}
                        alt="Cabinetry"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=16&width=16"
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>{selectedTheme.table_top_1_name}</span>
                    <div className="w-4 h-4 border border-gray-600">
                      <img
                        src={`${baseUrl}/${selectedTheme.table_top_1_image}`}
                        alt="Benchtop"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=16&width=16"
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>{selectedTheme.seating_1_name}</span>
                    <div className="w-4 h-4 border border-gray-600">
                      <img
                        src={`${baseUrl}/${selectedTheme.seating_1_image}`}
                        alt="Seating"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=16&width=16"
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between font-bold">
                  <span>Base Price</span>
                  <span>${basePrice.toLocaleString()}</span>
                </div>

                <div className="text-xs space-y-1 text-gray-300">
                  <p>Hot Dip Galvanised Chassis (orders placed from 14/07/23 onwards)</p>
                  <p>100L Grey Water Tank</p>
                  <p>Shower with Glass Door</p>
                  <p>All on-road costs (3 year WOF & 1 year REGO)</p>
                  <p>NZ Electrical WOF</p>
                  <p>Green Self Containment Certificate (4 years)</p>
                  <p>Gas to Go</p>
                  <p>All SRC models come with a 5 year structural warranty and 2 year manufacturers warranty.</p>
                </div>

                <div className="flex justify-between">
                  <span>Manufacturer Options</span>
                  <span>${manufacturerOptionsPrice.toFixed(2)}</span>
                </div>

                {/* Selected Manufacturer Options */}
                {!loading && formData.manufacturerOptions && typeof formData.manufacturerOptions === "object" && (
                  <div className="text-xs space-y-1 text-gray-300">
                    {Object.keys(formData.manufacturerOptions).map((optionId) => {
                      if (!formData.manufacturerOptions[optionId]) return null
                      const option = manufacturerOptions.find((opt) => opt.id === Number.parseInt(optionId))
                      if (!option) return null
                      return (
                        <div key={optionId} className="flex justify-between">
                          <span>{option.name}</span>
                          <span>${Number.parseFloat(option.price).toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Vanari Options</span>
                  <span>${vanariOptionsPrice.toFixed(2)}</span>
                </div>

                {/* Selected Vanari Options */}
                {!loading && formData.vanariOptions && typeof formData.vanariOptions === "object" && (
                  <div className="text-xs space-y-1 text-gray-300">
                    {Object.keys(formData.vanariOptions).map((optionId) => {
                      if (!formData.vanariOptions[optionId]) return null
                      const option = vanariOptions.find((opt) => opt.id === Number.parseInt(optionId))
                      if (!option) return null
                      return (
                        <div key={optionId} className="flex justify-between">
                          <span>{option.name}</span>
                          <span>${Number.parseFloat(option.price).toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-700">
                  <span>Estimated Total Build Price</span>
                  <span className="text-[#FFE4A8]">${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-600 mb-2">Configuration Saved Successfully!</h2>
              <p className="text-gray-600">Your caravan configuration has been saved and submitted.</p>
            </div>

            {orderResponse && (
              <div className="space-y-4 text-sm">
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-bold mb-2">Order Details:</h3>
                  <p>
                    <strong>Order ID:</strong> {orderResponse.data?.id || "N/A"}
                  </p>
                  <p>
                    <strong>Customer:</strong> {formData.contactInfo?.firstName} {formData.contactInfo?.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.contactInfo?.email}
                  </p>
                  <p>
                    <strong>Model:</strong> {formData.modelData?.name}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ${totalPrice.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-bold mb-2">Next Steps:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>You will receive a confirmation email shortly</li>
                    <li>Our team will contact you within 24 hours</li>
                    <li>We'll schedule a consultation to finalize your order</li>
                    <li>Production timeline will be provided during consultation</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#FFE4A8] hover:bg-[#FFE4A8]/80 text-black font-bold py-2 px-4 rounded"
              >
                Print Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
