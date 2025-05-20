"use client"

import type { StepProps } from "@/lib/types"
import { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface ManufacturerOptionsData {
  [category: string]: string | null
}

export default function ManufacturerOptions({ formData, updateFormData }: StepProps) {
  const [openCategory, setOpenCategory] = useState<string | null>("plumbing")
  const optionsContainerRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: "chassis", name: "CHASSIS OPTIONS" },
    { id: "external", name: "EXTERNAL OPTIONS" },
    { id: "appliances", name: "APPLIANCES OPTIONS" },
    { id: "electrical", name: "ELECTRICAL OPTIONS" },
    { id: "plumbing", name: "PLUMBING OPTIONS" },
    { id: "internal", name: "INTERNAL OPTIONS" },
  ]

  const plumbingOptions = [
    { id: "black-square-shower", name: "Black Square External Shower" },
    { id: "dometic-cassette", name: "Dometic Cassette Ceramic Bowl Toilet & Spare Toilet Cassette" },
    { id: "water-filter", name: "Water Filter with Separate Tap" },
    { id: "counter-top-ceramic", name: "Counter Top Ceramic Oval White Ensuite Basin and Chrome Swivel Tap" },
    { id: "bbq-gas-point-1", name: "2 x BBQ Gas Point under Tunnel Boot on Doorside" },
    { id: "bbq-gas-point-2", name: "1 x BBQ Gas Point under Tunnel Boot and 1 at Rear of Van on Doorside" },
    { id: "external-water-tap-1", name: "1 x External Water Tap behind Wheels" },
    { id: "external-water-tap-2", name: "1 x External Water Tap on A-Frame with Protector" },
    { id: "main-water-inlet", name: "1 x Main Water Inlet behind Wheels" },
  ]

  const internalOptions = [
    { id: "square-benchtop", name: "Square Benchtop Edging" },
    { id: "no-splashback", name: "NO Splashback" },
    { id: "flat-cupboard", name: "Flat Cupboard Door Style" },
    { id: "tie-cushion", name: "Tie Cushion As Per Upholstery Seating Base" },
    { id: "bench-seating", name: "Bench Seating with Drop Down Table Leg" },
    { id: "additional-drawer-ensuite", name: "Additional 3 x Drawer under Ensuite Vanity Next to Shower" },
    { id: "additional-pot-drawer", name: "Additional Pot Drawer under Stove" },
    { id: "additional-shelf-kitchen", name: "Additional 1 x Shelf at Kitchen OHC Above Sink" },
    { id: "additional-shelf-lounge", name: "Additional 2 x Shelf at Lounge OHC" },
    { id: "lips-shelves", name: "Lips on All Shelves" },
    { id: "pelmet-bedroom", name: "Pelmet on Bedroom Windows" },
    { id: "pelmet-lounge", name: "Pelmet on Lounge Window" },
    { id: "standard-grab-handles", name: "Standard Internal Grab Handle" },
    { id: "mirror-shower", name: "Mirror Glass Shower Door" },
    { id: "piano-cabinet", name: "Piano Cabinet Door Hinge" },
    { id: "key-hook", name: "1 x Key Hook at Entry" },
    { id: "white-square-sink", name: "White Square Sink Cover" },
  ]

  // Placeholder for other category options
  const otherCategoryOptions = [
    { id: "option-1", name: "Option 1" },
    { id: "option-2", name: "Option 2" },
    { id: "option-3", name: "Option 3" },
  ]

  const getOptionsForCategory = (categoryId: string) => {
    switch (categoryId) {
      case "internal":
        return internalOptions
      case "plumbing":
        return plumbingOptions
      default:
        return otherCategoryOptions
    }
  }

  // Initialize or get the manufacturer options from formData
  const manufacturerOptions: ManufacturerOptionsData =
    typeof formData.manufacturerOptions === "object" &&
      formData.manufacturerOptions !== null &&
      !Array.isArray(formData.manufacturerOptions)
      ? (formData.manufacturerOptions as ManufacturerOptionsData)
      : {}

  // Handle option selection (single selection per category)
  const handleOptionSelect = (category: string, optionId: string) => {
    const updatedOptions = { ...manufacturerOptions }

    // If the option is already selected, deselect it
    if (updatedOptions[category] === optionId) {
      updatedOptions[category] = null
    } else {
      // Otherwise, select this option (replacing any previous selection in this category)
      updatedOptions[category] = optionId
    }

    updateFormData("manufacturerOptions", updatedOptions)
  }

  const handleCategoryClick = (categoryId: string) => {
    setOpenCategory(categoryId)
  }

  const resetOptions = () => {
    updateFormData("manufacturerOptions", {})
  }

  const basePrice = 79500



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
                            checked={manufacturerOptions[category.id] === option.id}
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
                <h3 className="font-bold">Manufacturer Options</h3>
                <span className="font-bold">$0.00</span>
              </div>

              <div className="text-xs space-y-1 text-gray-400 text-start pt-2">
                {Object.entries(manufacturerOptions).map(([category, optionId]) => {
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

                {Object.keys(manufacturerOptions).length === 0 && (
                  <>
                    <p>NZ Type Power Inlet (NZ Dealer Pack)</p>
                    <p>Remove TV Antenna and Prewire Roof Satellite (NZ Dealer Pack)</p>
                    <p>1 x Grey Water Tank with Gauge</p>
                    <p>Gas Bottle Holder Only (NZ Dealer Pack)</p>
                    <p>4" (50+100) Hot Dip Gal Deck</p>
                  </>
                )}
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
