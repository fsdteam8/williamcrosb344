"use client"

import type { StepProps } from "@/lib/types"
import { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface VanariOptionsData {
  [category: string]: string | null
}

export default function VanariOptions({ formData, updateFormData }: StepProps) {
  const [openCategory, setOpenCategory] = useState<string | null>("entertainment")
  const optionsContainerRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: "entertainment", name: "ENTERTAINMENT OPTIONS" },
    { id: "power", name: "POWER OPTIONS" },
    { id: "water", name: "WATER OPTIONS" },
    { id: "comfort", name: "COMFORT OPTIONS" },
  ]

  const entertainmentOptions = [
    { id: "wifi-installed", name: "WIFI Installed (Ceiling Outlet with SIM Capability)" },
    { id: "bluetooth-speakers", name: "Bluetooth 4K Waterproof Thermostat Controlled Bathroom Speakers" },
    { id: "bluetooth-speakers-lounge", name: "Bluetooth 4K Waterproof Thermostat Controlled Lounge Speakers" },
    { id: "auto-satellite", name: "Auto Satellite TV System (Satellite Dish)" },
    { id: "auto-satellite-hd", name: "Auto Full Auto Satellite (HD)" },
    { id: "tv-mount", name: "TV Mount/Arm for Satellite Viewer" },
  ]

  const powerOptions = [
    { id: "usb-outlets", name: "USB Outlets at Vanity and Bed" },
    { id: "usb-outlets-kitchen", name: "USB Outlets at Kitchen" },
    { id: "dual-solar", name: "Dual Solar Panels on roof (Includes Regulator)" },
    { id: "dual-batteries", name: "Dual Gel AGM Batteries on rear (Includes Charger)" },
  ]

  const waterOptions = [
    { id: "water-gauge", name: "Water Gauge (Standard from tank)" },
    { id: "water-gauge-digital", name: "Digital Water Gauge (Bluetooth App)" },
    { id: "composting-toilet", name: "OEM composting toilet" },
    { id: "water-filter", name: "Water Filter (External Mounting Spout)" },
  ]

  const comfortOptions = [
    { id: "auto-awning", name: "Auto Slide Automatic electric awning" },
    { id: "heating-cooling", name: "Vanari Heating Cooling Suit to 20ft" },
    {
      id: "heating-cooling-premium",
      name: "Vanari Premium Heating Cooling Premium (Includes WiFi Security System for Suit to 20ft)",
    },
    { id: "luxury-mattress", name: "Luxury Mattress (Luxury Topper Plus Mattress Protector) (Double Bed Only)" },
  ]

  const getOptionsForCategory = (categoryId: string) => {
    switch (categoryId) {
      case "entertainment":
        return entertainmentOptions
      case "power":
        return powerOptions
      case "water":
        return waterOptions
      case "comfort":
        return comfortOptions
      default:
        return []
    }
  }

  // Initialize or get the vanari options from formData
  const vanariOptions: VanariOptionsData =
    typeof formData.vanariOptions === "object" &&
      formData.vanariOptions !== null &&
      !Array.isArray(formData.vanariOptions)
      ? (formData.vanariOptions as VanariOptionsData)
      : {}

  // Handle option selection (single selection per category)
  const handleOptionSelect = (category: string, optionId: string) => {
    const updatedOptions = { ...vanariOptions }

    // If the option is already selected, deselect it
    if (updatedOptions[category] === optionId) {
      updatedOptions[category] = null
    } else {
      // Otherwise, select this option (replacing any previous selection in this category)
      updatedOptions[category] = optionId
    }

    updateFormData("vanariOptions", updatedOptions)
  }

  const handleCategoryClick = (categoryId: string) => {
    setOpenCategory(categoryId)
  }

  // const resetOptions = () => {
  //   updateFormData("vanariOptions", {})
  // }

  const basePrice = 79500


  return (
    <div className=" text-white mt-[80px]">


      <div className="grid grid-cols-5 gap-6">
        <div className="space-y-2 col-span-5 md:col-span-2">
          <h2 className="text-xl font-bold mb-6">Select Vanari Options</h2>
          {/* Category Dropdowns */}
          {categories.map((category) => (
            <div key={category.id} className="relative">
              {/* Category Button */}
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full p-3 text-left font-bold flex justify-between items-center ${openCategory === category.id ? "bg-[#333]" : "bg-[#1e1e1e] hover:bg-[#2a2a2a]"
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
                      {getOptionsForCategory(category.id).map((option) => (
                        <div key={option.id} className="flex items-start">
                          <input
                            type="checkbox"
                            id={option.id}
                            checked={vanariOptions[category.id] === option.id}
                            onChange={() => handleOptionSelect(category.id, option.id)}
                            className="mt-1 mr-2 h-4 w-4 accent-yellow-400"
                          />
                          <label htmlFor={option.id} className="text-sm">
                            {option.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

        </div>

        <div className="bg-[#1e1e1e] p-6 col-span-5 md:col-span-3 mt-[100px]">
          <div className="space-y-6">
            <div className="mt-[-130px] mb-6 flex justify-center">
              <img
                src="/assets/mainmodel.webp"
                alt="Caravan Preview"
                className="w-[250px] h-[200px] object-contain"
              />
            </div>
            <h3 className="text-center text-white">Your New SRC-14</h3>

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
                <h3 className="font-bold">Vanari Options</h3>
                <span className="font-bold">$0.00</span>
              </div>

              <div className="text-xs space-y-1 text-gray-400 text-start pt-2">
                {Object.entries(vanariOptions).map(([category, optionId]) => {
                  if (!optionId) return null

                  const categoryObj = categories.find((c) => c.id === category)
                  const options = getOptionsForCategory(category)
                  const option = options.find((o) => o.id === optionId)

                  if (!option) return null

                  return (
                    <p key={`${category}-${optionId}`}>
                      {option.name} ({categoryObj?.name})
                    </p>
                  )
                })}

                {Object.keys(vanariOptions).length === 0 && <p>No Vanari options selected</p>}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-start">Estimated Total Build Price</h3>
                <span className="text-xl font-bold text-[#FFE4A8]">${basePrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
