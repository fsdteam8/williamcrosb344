"use client"

import type { StepProps } from "@/lib/types"
import { useState, useEffect } from "react"
import CaravanCarousel from "../CaravanCarousel"

interface ExternalOptionsData {
  baseColor?: string
  baseColorId?: number
  decalColor?: string
  decalColorId?: number
  colorTypes?: string[]
}

interface ColorItem {
  id: string
  colorId: number
  name: string
  image: string
  image2?: string
}

interface AdditionalOption {
  id: number
  name: string
  price: string
  vehicle_model_id: number
  category_name: string
  type: string
  created_at: string
  updated_at: string
}

export default function SaveAndShare({ formData }: StepProps) {
  const [manufacturerOptions, setManufacturerOptions] = useState<AdditionalOption[]>([])
  const [vanariOptions, setVanariOptions] = useState<AdditionalOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [colorsLoading, setColorsLoading] = useState(false)

  // Add state for colors
  const [baseColors, setBaseColors] = useState<ColorItem[]>([])
  const [decalColors, setDecalColors] = useState<ColorItem[]>([])
  const [modelColorImages, setModelColorImages] = useState<ColorItem[]>([])

  // Add function to get caravan images
  const getCaravanImages = (): string[] => {
    if (modelColorImages.length > 0) {
      const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`
      const images: string[] = []

      modelColorImages.forEach((img: ColorItem) => {
        if (img.image) {
          images.push(`${baseUrl}/${img.image}`)
        }
        if (img.image2) {
          images.push(`${baseUrl}/${img.image2}`)
        }
      })

      return images.length > 0
        ? images
        : [
            "/placeholder.svg?height=300&width=500",
            "/placeholder.svg?height=300&width=500",
            "/placeholder.svg?height=300&width=500",
          ]
    }

    return [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ]
  }

  // Fetch options data to display selected items
  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        setLoading(true)
        const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`

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

  // Add this useEffect to fetch colors
  useEffect(() => {
    const fetchColors = async () => {
      try {
        setColorsLoading(true)
        const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`
        const response = await fetch(`${baseUrl}/api/colors?type_wise=type_wise`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()

          // Extract base colors and decal colors from API response
          const baseColorsData = data["External Base Colours"] || []
          const decalColorsData = data["External Decals Colours"] || []

          // Transform API data to match component structure
          const transformedBaseColors = baseColorsData.map((color: ColorItem) => ({
            id: color.name.toLowerCase().replace(/\s+/g, "-"),
            colorId: color.id,
            name: color.name,
            image: `${baseUrl}/${color.image}`,
          }))

          const transformedDecalColors = decalColorsData.map((color: ColorItem) => ({
            id: color.name.toLowerCase().replace(/\s+/g, "-"),
            colorId: color.id,
            name: color.name,
            image: `${baseUrl}/${color.image}`,
          }))

          setBaseColors(transformedBaseColors)
          setDecalColors(transformedDecalColors)
        }
      } catch (error) {
        console.warn("Error fetching colors:", error)
      } finally {
        setColorsLoading(false)
      }
    }

    fetchColors()
  }, [])

  // Fetch model-color-wise images when colors change
  useEffect(() => {
    const fetchModelColorImages = async () => {
      const externalOptions = formData.externalOptions as ExternalOptionsData
      if (externalOptions?.baseColorId && externalOptions?.decalColorId && formData.modelData?.id) {
        try {
          const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`
          const response = await fetch(
            `${baseUrl}/api/model-color-wise-image?model_id=${formData.modelData.id}&color_1_id=${externalOptions.baseColorId}&color_2_id=${externalOptions.decalColorId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          )

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data?.data) {
              setModelColorImages(data.data.data)
            } else {
              setModelColorImages([])
            }
          } else {
            setModelColorImages([])
          }
        } catch (error) {
          console.warn("Error fetching model color images:", error)
          setModelColorImages([])
        }
      }
    }

    fetchModelColorImages()
  }, [formData.externalOptions, formData.modelData?.id])

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

  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`
  const selectedTheme = formData.color?.selectedTheme || null

  console.log(selectedTheme, "selectedTheme")
  const externalOptions = (formData.externalOptions as ExternalOptionsData) || {}

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

              {!loading && !colorsLoading && (
                <div className="aspect-video relative mb-6">
                  <CaravanCarousel
                    images={getCaravanImages()}
                    baseColor={externalOptions.baseColor || "silver"}
                    decalColor={externalOptions.decalColor || "snowy-teal"}
                  />
                </div>
              )}

              {/* Exterior Colors */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-start">External Base Colour</span>
                  <div className="flex items-center gap-2">
                    <span className="capitalize">
                      {baseColors.find((c) => c.id === externalOptions.baseColor)?.name || "Silver"}
                    </span>
                    <div className="w-5 h-5 rounded overflow-hidden border border-gray-600">
                      <img
                        src={baseColors.find((c) => c.id === externalOptions.baseColor)?.image || "/placeholder.svg"}
                        alt={baseColors.find((c) => c.id === externalOptions.baseColor)?.name || "Silver"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-start">External Decals Colour</span>
                  <div className="flex items-center gap-2">
                    <span className="capitalize">
                      {decalColors.find((c) => c.id === externalOptions.decalColor)?.name || "Snowy Teal"}
                    </span>
                    <div className="w-5 h-5 rounded overflow-hidden border border-gray-600">
                      <img
                        src={decalColors.find((c) => c.id === externalOptions.decalColor)?.image || "/placeholder.svg"}
                        alt={decalColors.find((c) => c.id === externalOptions.decalColor)?.name || "Snowy Teal"}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
