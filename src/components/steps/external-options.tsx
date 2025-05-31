"use client"

import type { StepProps, ModelColorWiseImage } from "@/lib/types"
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
}

export default function ExternalOptions({ formData, updateFormData }: StepProps) {
  const [colorTypes, setColorTypes] = useState<string[]>([])
  const [modelColorImages, setModelColorImages] = useState<ModelColorWiseImage[]>([])
  const [loading, setLoading] = useState(false)
  const [baseColors, setBaseColors] = useState<ColorItem[]>([])
  const [decalColors, setDecalColors] = useState<ColorItem[]>([])
  const [colorsLoading, setColorsLoading] = useState(true)

  const externalOptions =
    typeof formData.externalOptions === "object" && formData.externalOptions !== null
      ? (formData.externalOptions as ExternalOptionsData)
      : ({} as ExternalOptionsData)

  useEffect(() => {
    const types = ["External Base Colours", "sabit"]
    setColorTypes(types)
    console.log(types, "colorTypes")
  }, [])

  // Fetch colors from API
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

          console.log("Fetched colors from API:", {
            baseColors: transformedBaseColors,
            decalColors: transformedDecalColors,
          })
        } else {
          console.warn("Failed to fetch colors from API")
          // Keep existing fallback colors as backup
        }
      } catch (error) {
        console.warn("Error fetching colors:", error)
        // Keep existing fallback colors as backup
      } finally {
        setColorsLoading(false)
      }
    }

    fetchColors()
  }, [])

  const handleBaseColorSelect = (color: ColorItem) => {
    handleColorSelect({
      baseColor: color.id,
      baseColorId: color.colorId,
    })
  }

  const handleDecalColorSelect = (color: ColorItem) => {
    handleColorSelect({
      decalColor: color.id,
      decalColorId: color.colorId,
    })
  }

  // Add this useEffect after the existing useEffect for fetching colors
  useEffect(() => {
    // Auto-select first base color if none selected and colors are available
    if (!externalOptions.baseColorId && baseColors.length > 0) {
      handleBaseColorSelect(baseColors[0])
    }
  }, [baseColors, externalOptions.baseColorId, baseColors.length, handleBaseColorSelect])

  useEffect(() => {
    // Auto-select first decal color if none selected and colors are available
    if (!externalOptions.decalColorId && decalColors.length > 0) {
      handleDecalColorSelect(decalColors[0])
    }
  }, [decalColors, externalOptions.decalColorId, decalColors.length, handleDecalColorSelect])

  const handleColorSelect = (colorData: Partial<ExternalOptionsData>) => {
    updateFormData("externalOptions", {
      ...externalOptions,
      ...colorData,
      colorTypes: colorTypes,
    })
  }

  // Fetch model-color-wise images when colors change
  useEffect(() => {
    const fetchModelColorImages = async () => {
      if (externalOptions.baseColorId && externalOptions.decalColorId && formData.modelData?.id) {
        try {
          setLoading(true)
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
              console.log("Fetched model color images:", data.data.data)
            } else {
              console.warn("No model color images found")
              setModelColorImages([])
            }
          } else {
            console.warn("Failed to fetch model color images")
            setModelColorImages([])
          }
        } catch (error) {
          console.warn("Error fetching model color images:", error)
          setModelColorImages([])
        } finally {
          setLoading(false)
        }
      }
    }

    fetchModelColorImages()
  }, [externalOptions.baseColorId, externalOptions.decalColorId, formData.modelData?.id])

  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`

  // Get caravan images from API or fallback
  const getCaravanImages = (): string[] => {
    if (modelColorImages.length > 0) {
      const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`
      const images: string[] = []

      modelColorImages.forEach((img) => {
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

    // Fallback images
    return [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ]
  }

  return (
    <div className=" text-white mt-[80px]">
      <div className="grid grid-cols-5 gap-6 ">
        <div className="space-y-8 bg-[#202020] p-8 col-span-5 md:col-span-2 rounded-lg">
          {/* Base Colors Section */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-start">Select Colour</h2>
            <h3 className="font-bold mb-8 uppercase lg:text-center text-start">EXTERNAL BASE COLOURS</h3>
            {colorsLoading && (
              <div className="flex items-center justify-center h-32">
                <div className="text-white">Loading colors...</div>
              </div>
            )}

            {!colorsLoading && (!baseColors || baseColors.length === 0) && (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-400">No base colors available</div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 justify-center">
              {baseColors &&
                baseColors.length > 0 &&
                baseColors.slice(0, 3).map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleBaseColorSelect(color)}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-16 h-16 border-2 ${
                        externalOptions.baseColor === color.id ? "border-white" : "border-gray-600"
                      } rounded overflow-hidden`}
                    >
                      <img
                        src={color.image || "/placeholder.svg"}
                        alt={color.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                        }}
                      />
                    </div>
                    <span className="text-xs mt-1 text-center">{color.name}</span>
                  </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 justify-center mt-4">
              <div className="flex justify-center">
                {baseColors && baseColors.length > 3 && (
                  <button onClick={() => handleBaseColorSelect(baseColors[3])} className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 border-2 ${
                        externalOptions.baseColor === baseColors[3].id ? "border-white" : "border-gray-600"
                      } rounded overflow-hidden`}
                    >
                      <img
                        src={baseColors[3].image || "/placeholder.svg"}
                        alt={baseColors[3].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                        }}
                      />
                    </div>
                    <span className="text-xs mt-1 text-center">{baseColors[3].name}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Decal Colors Section */}
          <div>
            <h3 className="font-bold mb-8 uppercase lg:text-center text-start">EXTERNAL DECALS COLOURS</h3>
            {colorsLoading && (
              <div className="flex items-center justify-center h-32">
                <div className="text-white">Loading colors...</div>
              </div>
            )}

            {!colorsLoading && (!decalColors || decalColors.length === 0) && (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-400">No decal colors available</div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              {baseColors &&
                decalColors.length > 0 &&
                decalColors.slice(0, 6).map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleDecalColorSelect(color)}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-16 h-16 border-2 ${
                        externalOptions.decalColor === color.id ? "border-white" : "border-gray-600"
                      } rounded overflow-hidden`}
                    >
                      <img
                        src={color.image || "/placeholder.svg"}
                        alt={color.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                        }}
                      />
                    </div>
                    <span className="text-xs mt-1 text-center">
                      {color.name.split(" ")[0]}
                      <br />
                      {color.name.split(" ").slice(1).join(" ")}
                    </span>
                  </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 justify-center mt-4">
              <div className="flex justify-center">
                {decalColors && decalColors.length > 6 && (
                  <button onClick={() => handleDecalColorSelect(decalColors[6])} className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 border-2 ${
                        externalOptions.decalColor === decalColors[6].id ? "border-white" : "border-gray-600"
                      } rounded overflow-hidden`}
                    >
                      <img
                        src={decalColors[6].image || "/placeholder.svg"}
                        alt={decalColors[6].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                        }}
                      />
                    </div>
                    <span className="text-xs mt-1 text-center">
                      {decalColors[6].name.split(" ")[0]}
                      <br />
                      {decalColors[6].name.split(" ").slice(1).join(" ")}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5 lg:col-span-3 bg-[#1e1e1e] p-6 rounded-lg mt-[80px]">
          <div className="space-y-6">
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
            <h3 className="text-center text-white">Your New {formData.modelData?.name || "SRC-14"}</h3>

            {(loading || colorsLoading) && (
              <div className="flex items-center justify-center h-64">
                <div className="text-white">{colorsLoading ? "Loading colors..." : "Loading caravan images..."}</div>
              </div>
            )}

            {!loading && !colorsLoading && baseColors.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <div className="text-white">No colors available</div>
              </div>
            )}

            {!loading && !colorsLoading && (
              <div className="aspect-video relative mb-6">
                <CaravanCarousel
                  images={getCaravanImages()}
                  baseColor={externalOptions.baseColor || "silver"}
                  decalColor={externalOptions.decalColor || "snowy-teal"}
                />
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-start">External Base Colour</span>
                <div className="flex items-center gap-2">
                  <span className="capitalize">
                    {baseColors.find((c) => c.id === externalOptions.baseColor)?.name || "Silver"}
                  </span>
                  <div className="w-5 h-5 rounded overflow-hidden border border-gray-600">
                    <img
                      src={
                        baseColors.find((c) => c.id === externalOptions.baseColor)?.image 
                      }
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
                      src={
                        decalColors.find((c) => c.id === externalOptions.decalColor)?.image
                      }
                      alt={decalColors.find((c) => c.id === externalOptions.decalColor)?.name || "Snowy Teal"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Base Price</h3>
                <span className="text-xl font-bold text-[#FFE4A8]">
                  ${Number.parseFloat(formData.modelData?.base_price || "79500").toLocaleString()}
                </span>
              </div>

              <div className="space-y-1 mt-2 text-xs text-gray-400 text-start">
                <p>Hot Dip Galvanised Chassis (orders placed from 14/09/23 onwards)</p>
                <p>100L Grey Water Tank</p>
                <p>Smart TV (Option to add satellite)</p>
                <p>All on road costs ( 3 year WOF & 1 year REGO)</p>
                <p>NZ Electrical WOF</p>
                <p>Green Self Containment Certificate (4 years)</p>
                <p>Start up Kit</p>
                <p>All new caravans come with a 5 year structural warranty and 2 year manufacturers warranty.</p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <h3 className="font-bold">Manufacturer Options</h3>
                <span className="font-bold">$0.00</span>
              </div>

              <div className="text-xs space-y-1 text-gray-400 text-start">
                <p>NZ Type Power Inlet (NZ Dealer Pack)</p>
                <p>Remove TV Antenna and Prewire Roof Satellite (NZ Dealer Pack)</p>
                <p>1 x Grey Water Tank with Gauge</p>
                <p>Gas Bottle Holder Only (NZ Dealer Pack)</p>
                <p>4" (100+100) Hot Dip Gal Deck</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-start">Estimated Total Build Price</h3>
                <span className="text-xl font-bold text-[#FFE4A8]">
                  ${Number.parseFloat(formData.modelData?.base_price || "79500").toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
