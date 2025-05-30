"use client"

import { useState, useEffect } from "react"
import type { StepProps, Theme, ThemeWiseImage } from "@/lib/types"

interface ColorSelectionData {
  themeId?: number
  themeName?: string
  themeImage?: string
  selectedTheme?: Theme // Pass the complete theme object
}

export default function ColorSelection({ formData, updateFormData }: StepProps) {
  const [themes, setThemes] = useState<Theme[]>([])
  const [themeWiseImage, setThemeWiseImage] = useState<ThemeWiseImage | null>(null)
  const [loading, setLoading] = useState(true)

  const color =
    typeof formData.color === "object" && formData.color !== null
      ? (formData.color as ColorSelectionData)
      : ({} as ColorSelectionData)

  // Fetch themes on component mount
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true)

        // Fallback themes that match the actual API structure
        const fallbackThemes: Theme[] = [
          {
            id: 10,
            name: "Coastal Luxe",
            image: "uploads/1748406687_SRC16-Snowy-River-Caravans-LRV231154-Theme-3.png",
            flooring_name: "Flooring - Montreal VFT10120507",
            flooring_image: "uploads/1748406687_Montreal-VFT10120507-1.jpg",
            cabinetry_1_name: "All Cabinetry - White 0949",
            cabinetry_1_image: "uploads/1748405007_Montreal-VFT10120507-1.jpg",
            table_top_1_name: "Benchtops - Aged Ash 8844D8",
            table_top_1_image: "uploads/1748405007_Montreal-VFT10120507-1.jpg",
            seating_1_name: "Fabric - Kiama Cobblestone S213 75A-1",
            seating_1_image: "uploads/1748405007_Kiama-Cobblestone-S213-75A-1-1.jpg",
            seating_2_name: "Leather - Taupe 0621-B",
            seating_2_image: "uploads/1748405007_Taupe-0621-B.jpg",
            cabinetry_2_name: "All Cabinetry - White 0949",
            cabinetry_2_image: "uploads/1748405007_White-0949-2.jpg",
            table_top_2_name: "Splashback - White 0949",
            table_top_2_image: "uploads/1748405007_White-0949-2.jpg",
            created_at: "2025-05-28T04:03:27.000000Z",
            updated_at: "2025-05-28T04:31:27.000000Z",
          },
          {
            id: 11,
            name: "Grey Oasis",
            image: "uploads/1748409412_localhost_5173_ (2).png",
            flooring_name: "Alana Sutton",
            flooring_image: "uploads/1748409412_localhost_5173_ (5).png",
            cabinetry_1_name: "Yoshi Stuart",
            cabinetry_1_image: "uploads/1748409412_localhost_5173_dashboard.png",
            table_top_1_name: "Rana Wilkerson",
            table_top_1_image: "uploads/1748409412_localhost_5173_ (1).png",
            seating_1_name: "Fletcher Good",
            seating_1_image: "uploads/1748409412_localhost_5173_ (5).png",
            seating_2_name: "Xantha Craft",
            seating_2_image: "uploads/1748409412_localhost_5173_dashboard (2).png",
            cabinetry_2_name: "Knox Winters",
            cabinetry_2_image: "uploads/1748409412_localhost_5173_ (5).png",
            table_top_2_name: "Illiana Levine",
            table_top_2_image: "uploads/1748409412_localhost_5173_dashboard.png",
            created_at: "2025-05-28T05:16:52.000000Z",
            updated_at: "2025-05-28T05:16:52.000000Z",
          },
        ]

        try {
          // Try to fetch from API with timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

          const response = await fetch("https://ben10.scaleupdevagency.com/api/themes", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (response.ok) {
            const data = await response.json()

            if (data.success && data.data?.data && data.data.data.length > 0) {
              console.log("Successfully fetched themes from API")
              setThemes(data.data.data)

              // Auto-select first theme if none selected
              if (!color.themeId) {
                const firstTheme = data.data.data[0]
                handleThemeSelect(firstTheme)
              }
            } else {
              throw new Error("Invalid API response structure")
            }
          } else {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        } catch (apiError) {
          console.warn("API fetch failed, using fallback themes:", apiError)
          // Use fallback themes that match the actual API structure
          setThemes(fallbackThemes)
          if (!color.themeId) {
            handleThemeSelect(fallbackThemes[0])
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Error in fetchThemes:", error)
        // Use fallback data on any error
        const fallbackThemes: Theme[] = [
          {
            id: 10,
            name: "Coastal Luxe",
            image: "uploads/1748406687_SRC16-Snowy-River-Caravans-LRV231154-Theme-3.png",
            flooring_name: "Flooring - Montreal VFT10120507",
            flooring_image: "uploads/1748406687_Montreal-VFT10120507-1.jpg",
            cabinetry_1_name: "All Cabinetry - White 0949",
            cabinetry_1_image: "uploads/1748405007_Montreal-VFT10120507-1.jpg",
            table_top_1_name: "Benchtops - Aged Ash 8844D8",
            table_top_1_image: "uploads/1748405007_Montreal-VFT10120507-1.jpg",
            seating_1_name: "Fabric - Kiama Cobblestone S213 75A-1",
            seating_1_image: "uploads/1748405007_Kiama-Cobblestone-S213-75A-1-1.jpg",
            seating_2_name: "Leather - Taupe 0621-B",
            seating_2_image: "uploads/1748405007_Taupe-0621-B.jpg",
            cabinetry_2_name: "All Cabinetry - White 0949",
            cabinetry_2_image: "uploads/1748405007_White-0949-2.jpg",
            table_top_2_name: "Splashback - White 0949",
            table_top_2_image: "uploads/1748405007_White-0949-2.jpg",
            created_at: "2025-05-28T04:03:27.000000Z",
            updated_at: "2025-05-28T04:31:27.000000Z",
          },
          {
            id: 11,
            name: "Grey Oasis",
            image: "uploads/1748409412_localhost_5173_ (2).png",
            flooring_name: "Alana Sutton",
            flooring_image: "uploads/1748409412_localhost_5173_ (5).png",
            cabinetry_1_name: "Yoshi Stuart",
            cabinetry_1_image: "uploads/1748409412_localhost_5173_dashboard.png",
            table_top_1_name: "Rana Wilkerson",
            table_top_1_image: "uploads/1748409412_localhost_5173_ (1).png",
            seating_1_name: "Fletcher Good",
            seating_1_image: "uploads/1748409412_localhost_5173_ (5).png",
            seating_2_name: "Xantha Craft",
            seating_2_image: "uploads/1748409412_localhost_5173_dashboard (2).png",
            cabinetry_2_name: "Knox Winters",
            cabinetry_2_image: "uploads/1748409412_localhost_5173_ (5).png",
            table_top_2_name: "Illiana Levine",
            table_top_2_image: "uploads/1748409412_localhost_5173_dashboard.png",
            created_at: "2025-05-28T05:16:52.000000Z",
            updated_at: "2025-05-28T05:16:52.000000Z",
          },
        ]

        setThemes(fallbackThemes)
        if (!color.themeId) {
          handleThemeSelect(fallbackThemes[0])
        }
        setLoading(false)
      }
    }

    fetchThemes()
  }, [])

  // Fetch theme-wise image when theme or model changes
  useEffect(() => {
    const fetchThemeWiseImage = async () => {
      if (color.themeId && formData.modelData?.id) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

          const response = await fetch(
            `https://ben10.scaleupdevagency.com/api/model-theme-wise-image?model_id=${formData.modelData.id}&theme_id=${color.themeId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              signal: controller.signal,
            },
          )

          clearTimeout(timeoutId)

          if (response.ok) {
            const data = await response.json()

            if (data.success && data.data?.data && data.data.data.length > 0) {
              setThemeWiseImage(data.data.data[0])
            } else {
              console.warn("No theme-wise image found")
              setThemeWiseImage(null)
            }
          } else {
            console.warn("Failed to fetch theme-wise image")
            setThemeWiseImage(null)
          }
        } catch (error) {
          console.warn("Error fetching theme-wise image (likely CORS):", error)
          setThemeWiseImage(null)
        }
      }
    }

    fetchThemeWiseImage()
  }, [color.themeId, formData.modelData?.id])

  const handleThemeSelect = (theme: Theme) => {
    const colorData: ColorSelectionData = {
      themeId: theme.id,
      themeName: theme.name,
      themeImage: theme.image,
      selectedTheme: theme, // Pass the complete theme object
    }
    updateFormData("color", colorData)
  }

  const selectedTheme = themes.find((t) => t.id === color.themeId)
  const baseUrl = "https://ben10.scaleupdevagency.com"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading themes...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 text-white mt-[80px]">
      {/* Left Column - Theme Selection */}
      <div className="w-full md:w-1/3 space-y-6">
        <h3 className="text-white mb-2">Select Theme</h3>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme)}
              className={`py-2 px-3 text-sm text-center rounded ${
                color.themeId === theme.id ? "bg-[#FFE4A8] text-black" : "bg-[#1e1e1e] text-white hover:bg-[#333]"
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>

        {selectedTheme && (
          <div className="bg-[#202020] space-y-2">
            <div className="border-b border-[#333] py-12">
              <h2 className="text-center uppercase font-bold text-xl">{selectedTheme.name}</h2>
            </div>

            <div className="space-y-6 py-12">
              {/* Flooring */}
              <div className="flex items-center justify-center">
                <div>
                  <h3 className="uppercase font-bold mb-2">Flooring</h3>
                  <div className="">
                    <div className="border-2 border-[#FFD700]">
                      <img
                        src={`${baseUrl}/${selectedTheme.flooring_image}`}
                        alt={selectedTheme.flooring_name}
                        className="w-24 h-20 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=80&width=96&query=wood flooring sample"
                        }}
                      />
                    </div>
                    <div className="text-xs mt-1">
                      <p className="truncate max-w-[96px]" title={selectedTheme.flooring_name}>
                        {selectedTheme.flooring_name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cabinetry */}
              <div className="flex items-center justify-center">
                <div>
                  <h3 className="uppercase font-bold mb-2">Cabinetry</h3>
                  <div className="">
                    <div className="border-2 border-[#FFD700]">
                      <img
                        src={`${baseUrl}/${selectedTheme.cabinetry_1_image}`}
                        alt={selectedTheme.cabinetry_1_name}
                        className="w-24 h-20 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=80&width=96&query=white cabinet sample"
                        }}
                      />
                    </div>
                    <div className="text-xs mt-1">
                      <p className="truncate max-w-[96px]" title={selectedTheme.cabinetry_1_name}>
                        {selectedTheme.cabinetry_1_name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabletop and Splashback */}
              <div>
                <h3 className="uppercase font-bold mb-8">Tabletop and Splashback</h3>
                <div className="flex justify-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-[#FFD700]">
                      <img
                        src={`${baseUrl}/${selectedTheme.table_top_1_image}`}
                        alt={selectedTheme.table_top_1_name}
                        className="w-20 h-20 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=80&width=80&query=benchtop sample"
                        }}
                      />
                    </div>
                    <div className="text-xs text-center mt-1">
                      <p className="truncate max-w-[80px]" title={selectedTheme.table_top_1_name}>
                        {selectedTheme.table_top_1_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-[#FFD700]">
                      <img
                        src={`${baseUrl}/${selectedTheme.table_top_2_image}`}
                        alt={selectedTheme.table_top_2_name}
                        className="w-20 h-20 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=80&width=80&query=splashback sample"
                        }}
                      />
                    </div>
                    <div className="text-xs text-center mt-1">
                      <p className="truncate max-w-[80px]" title={selectedTheme.table_top_2_name}>
                        {selectedTheme.table_top_2_name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seating and Headboard */}
              <div>
                <h3 className="uppercase font-bold mb-4">Seating and Headboard</h3>
                <div className="flex justify-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-[#FFD700]">
                      <img
                        src={`${baseUrl}/${selectedTheme.seating_1_image}`}
                        alt={selectedTheme.seating_1_name}
                        className="w-20 h-20 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=80&width=80&query=fabric sample"
                        }}
                      />
                    </div>
                    <div className="text-xs text-center mt-1">
                      <p className="truncate max-w-[80px]" title={selectedTheme.seating_1_name}>
                        {selectedTheme.seating_1_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-[#FFD700]">
                      <img
                        src={`${baseUrl}/${selectedTheme.seating_2_image}`}
                        alt={selectedTheme.seating_2_name}
                        className="w-20 h-20 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=80&width=80&query=leather sample"
                        }}
                      />
                    </div>
                    <div className="text-xs text-center mt-1">
                      <p className="truncate max-w-[80px]" title={selectedTheme.seating_2_name}>
                        {selectedTheme.seating_2_name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Preview */}
      <div className="w-full md:w-2/3 bg-[#1e1e1e] p-6 mt-[150px] md:mt-[80px]">
        {selectedTheme ? (
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

            <div className="aspect-video relative mb-6">
              {themeWiseImage ? (
                <img
                  src={`${baseUrl}/${themeWiseImage.image}`}
                  alt={`${selectedTheme.name} Interior Preview`}
                  className="w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=300&width=500&query=caravan interior"
                  }}
                />
              ) : (
                <img
                  src="/placeholder.svg?height=300&width=500&query=caravan interior"
                  alt="Interior Preview"
                  className="w-full object-contain"
                />
              )}
            </div>

            <div className="space-y-3 text-sm">
              {selectedTheme && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[70%]">{selectedTheme.flooring_name}</span>
                    <div className="w-6 h-6 rounded overflow-hidden border border-gray-600">
                      <img
                        src={`${baseUrl}/${selectedTheme.flooring_image}`}
                        alt={selectedTheme.flooring_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24&query=flooring sample"
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[70%]">{selectedTheme.cabinetry_1_name}</span>
                    <div className="w-6 h-6 rounded overflow-hidden border border-gray-600">
                      <img
                        src={`${baseUrl}/${selectedTheme.cabinetry_1_image}`}
                        alt={selectedTheme.cabinetry_1_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24&query=cabinet sample"
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[70%]">{selectedTheme.table_top_1_name}</span>
                    <div className="w-6 h-6 rounded overflow-hidden border border-gray-600">
                      <img
                        src={`${baseUrl}/${selectedTheme.table_top_1_image}`}
                        alt={selectedTheme.table_top_1_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24&query=benchtop sample"
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[70%]">{selectedTheme.table_top_2_name}</span>
                    <div className="w-6 h-6 rounded overflow-hidden border border-gray-600">
                      <img
                        src={`${baseUrl}/${selectedTheme.table_top_2_image}`}
                        alt={selectedTheme.table_top_2_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24&query=splashback sample"
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[70%]">{selectedTheme.seating_1_name}</span>
                    <div className="w-6 h-6 rounded overflow-hidden border border-gray-600">
                      <img
                        src={`${baseUrl}/${selectedTheme.seating_1_image}`}
                        alt={selectedTheme.seating_1_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24&query=fabric sample"
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[70%]">{selectedTheme.seating_2_name}</span>
                    <div className="w-6 h-6 rounded overflow-hidden border border-gray-600">
                      <img
                        src={`${baseUrl}/${selectedTheme.seating_2_image}`}
                        alt={selectedTheme.seating_2_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24&query=leather sample"
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Base Price</span>
                <span>${Number.parseFloat(formData.modelData?.base_price || "79500").toLocaleString()}</span>
              </div>

              <div className="text-sm space-y-1 text-gray-300">
                <p>Hot Dip Galvanised Chassis (orders placed from 14/07/23 onwards)</p>
                <p>100L Grey Water Tank</p>
                <p>Shower with Glass Door</p>
                <p>All on-road costs (3 year WOF & 1 year REGO)</p>
                <p>NZ Electrical WOF</p>
                <p>Green Self Containment Certificate (4 years)</p>
                <p>Gas to Go</p>
                <p>All SRC models come with a 5 year structural warranty and 2 year manufacturers warranty.</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between">
                  <span>Manufacturer Options</span>
                  <span>$0.00</span>
                </div>
                <div className="text-sm space-y-1 text-gray-300">
                  <p>NZ Tyre Repair Kit (NZ Dealer Pack)</p>
                  <p>Remove TV Antenna and Replace Roof Satellite (NZ Dealer Pack)</p>
                  <p>1 x Grey Water Tank with Gauge</p>
                  <p>Gas Bottle Holder Only (NZ Dealer Pack)</p>
                  <p>4" (100mm) Pot Tap Deck</p>
                </div>
              </div>

              <div className="flex justify-between font-bold pt-4 border-t border-gray-700 mt-4">
                <span>Estimated Total Build Price</span>
                <span>${Number.parseFloat(formData.modelData?.base_price || "79500").toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Please select a theme to view your caravan</p>
          </div>
        )}
      </div>
    </div>
  )
}
