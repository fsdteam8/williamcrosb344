"use client"

import type { StepProps } from "@/lib/types"
import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface ManufacturerOptionsData {
  [optionId: string]: boolean
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

export default function ManufacturerOptions({ formData, updateFormData }: StepProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [options, setOptions] = useState<AdditionalOption[]>([])
  const [loading, setLoading] = useState(true)
  const optionsContainerRef = useRef<HTMLDivElement>(null)

  // Fetch manufacturer options from API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true)
        const baseUrl = "https://ben10.scaleupdevagency.com"

        // Add timeout and better error handling
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(`${baseUrl}/api/addtional-options?type=Manufacturer Options`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.data && Array.isArray(data.data.data)) {
            setOptions(data.data.data)
            console.log("Fetched manufacturer options:", data.data.data)
          } else {
            throw new Error("Invalid API response structure")
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        console.warn("Error fetching manufacturer options, using fallback data:", error)
        // Fallback data based on your API response structure
        const fallbackOptions = [
          {
            id: 42,
            name: "Dometic MiniGrill Gas/Elec",
            price: "660.00",
            vehicle_model_id: 4,
            category_name: "Appliances options",
            type: "Manufacturer Options",
            created_at: "2025-05-30T10:18:51.000000Z",
            updated_at: "2025-05-30T10:24:14.000000Z",
          },
          {
            id: 43,
            name: '4" (50x100) Hot Dip Gal Deck',
            price: "660.00",
            vehicle_model_id: 4,
            category_name: "Chassis options",
            type: "Manufacturer Options",
            created_at: "2025-05-30T10:25:48.000000Z",
            updated_at: "2025-05-30T10:25:48.000000Z",
          },
        ]
        setOptions(fallbackOptions)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [])

  // Group options by category with safety checks
  const groupedOptions = options.reduce(
    (acc, option) => {
      const category = option?.category_name || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(option)
      return acc
    },
    {} as Record<string, AdditionalOption[]>,
  )

  const categories = Object.keys(groupedOptions).map((categoryName) => ({
    id: categoryName.toLowerCase().replace(/\s+/g, "-"),
    name: categoryName.toUpperCase(),
  }))

  // Initialize or get the manufacturer options from formData
  const manufacturerOptions: ManufacturerOptionsData =
    typeof formData.manufacturerOptions === "object" &&
    formData.manufacturerOptions !== null &&
    !Array.isArray(formData.manufacturerOptions)
      ? (formData.manufacturerOptions as ManufacturerOptionsData)
      : {}

  // Handle option selection (multiple selections allowed)
  const handleOptionSelect = (optionId: number) => {
    const updatedOptions = { ...manufacturerOptions }

    // Toggle the option
    if (updatedOptions[optionId]) {
      delete updatedOptions[optionId]
    } else {
      updatedOptions[optionId] = true
    }

    updateFormData("manufacturerOptions", updatedOptions)
  }

  const handleCategoryClick = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId)
  }

  const resetOptions = () => {
    updateFormData("manufacturerOptions", {})
  }

  // Calculate total price of selected options
  const calculateTotalPrice = () => {
    let total = 0
    Object.keys(manufacturerOptions).forEach((optionId) => {
      if (manufacturerOptions[optionId]) {
        const option = options.find((opt) => opt.id === Number.parseInt(optionId))
        if (option) {
          total += Number.parseFloat(option.price)
        }
      }
    })
    return total
  }

  const basePrice = 79500
  const totalOptionsPrice = calculateTotalPrice()
  const totalPrice = basePrice + totalOptionsPrice
  const baseUrl = "https://ben10.scaleupdevagency.com"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white mt-[80px]">
        <div>Loading manufacturer options...</div>
      </div>
    )
  }

  return (
    <div className=" text-white mt-[80px]">
      <div className="grid grid-cols-5 gap-6">
        <div className=" space-y-2 col-span-5 md:col-span-2">
          <h2 className="text-xl font-bold mb-6">Select Manufacturer Options</h2>
          {/* Category Dropdowns */}
          {categories.map((category) => (
            <div key={category.id} className="relative">
              {/* Category Button */}
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full p-3 text-left font-bold flex justify-between items-center ${
                  openCategory === category.id ? "bg-[#333]" : "bg-[#1e1e1e] hover:bg-[#2a2a2a]"
                }`}
              >
                <span>{category.name}</span>
              </button>

              {/* Options Dropdown with Animation */}
              <AnimatePresence>
                {openCategory === category.id && (
                  <motion.div
                    ref={optionsContainerRef}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#1e1e1e] p-4 space-y-2 border-t border-gray-800">
                      {(
                        groupedOptions[
                          Object.keys(groupedOptions).find(
                            (key) => key.toLowerCase().replace(/\s+/g, "-") === category.id,
                          ) || ""
                        ] || []
                      ).map((option) => (
                        <div key={option.id} className="flex items-start justify-between">
                          <div className="flex items-start flex-1">
                            <input
                              type="checkbox"
                              id={`option-${option.id}`}
                              checked={!!manufacturerOptions[option.id]}
                              onChange={() => handleOptionSelect(option.id)}
                              className="mt-1 mr-2 h-4 w-4 accent-yellow-400"
                            />
                            <label htmlFor={`option-${option.id}`} className="text-sm flex-1">
                              {option.name || "Unknown Option"}
                            </label>
                          </div>
                          <span className="text-sm text-yellow-400 ml-2">
                            ${Number.parseFloat(option.price || "0").toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Default Button */}
          <button
            onClick={resetOptions}
            className="w-full p-3 text-center font-bold bg-[#1e1e1e] hover:bg-[#2a2a2a] mt-4"
          >
            DEFAULT
          </button>
        </div>

        <div className="bg-[#1e1e1e] p-6 col-span-5 md:col-span-3 mt-[100px]">
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

            <div className="mt-8 pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Base Price</h3>
                <span className="text-xl font-bold text-[#FFE4A8]">${basePrice.toLocaleString()}</span>
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
                <span className="font-bold text-[#FFE4A8]">${totalOptionsPrice.toFixed(2)}</span>
              </div>

              <div className="text-xs space-y-1 text-gray-400 text-start pt-2">
                {Object.keys(manufacturerOptions).length === 0 ? (
                  <>
                    <p>NZ Type Power Inlet (NZ Dealer Pack)</p>
                    <p>Remove TV Antenna and Prewire Roof Satellite (NZ Dealer Pack)</p>
                    <p>1 x Grey Water Tank with Gauge</p>
                    <p>Gas Bottle Holder Only (NZ Dealer Pack)</p>
                    <p>4" (50+100) Hot Dip Gal Deck</p>
                  </>
                ) : (
                  Object.keys(manufacturerOptions).map((optionId) => {
                    if (!manufacturerOptions[optionId]) return null

                    const option = options.find((opt) => opt.id === Number.parseInt(optionId))
                    if (!option) return null

                    return (
                      <div key={optionId} className="flex justify-between">
                        <span>{option.name}</span>
                        <span className="text-yellow-400">${Number.parseFloat(option.price).toFixed(2)}</span>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-start">Estimated Total Build Price</h3>
                <span className="text-xl font-bold text-[#FFE4A8]">${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
