"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" 
import StepBar from "./step-bar"
import ModelSelection from "./steps/model-selection"
import ColorSelection from "./steps/color-selection"
import ExternalOptions from "./steps/external-options"
import ManufacturerOptions from "./steps/manufacturer-options"
import SaveAndShare from "./steps/save-and-share"
import { Loader2 } from "lucide-react"
import type { ModelCategory, VehicleModel, Color, FormData } from "@/lib/types"
import VanariOptions from "./steps/vanari-options"

export default function MultiStepForm() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modelCategories, setModelCategories] = useState<ModelCategory[]>([])
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [formData, setFormData] = useState<FormData>({
    model: "",
    modelData: null,
    color: "",
    externalOptions: [],
    manufacturerOptions: [],
    vanariOptions: [],
    contactInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postalCode: "",
    },
  })

  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [orderResponse, setOrderResponse] = useState<any>(null)

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Use direct API URL
        const baseUrl = "https://ben10.scaleupdevagency.com"

        // Fetch model categories with error handling
        try {
          const categoriesResponse = await fetch(`${baseUrl}/api/frontend-models-category`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json()
            setModelCategories(categoriesData || [])
          } else {
            console.warn("Failed to fetch categories, using fallback data")
            setModelCategories([
              {
                id: 6,
                name: "SRC",
                vehicle_models: [{ id: 13, category_id: 6, name: "SRC-14" }],
              },
            ])
          }
        } catch (error) {
          console.warn("Categories API error:", error)
          setModelCategories([
            {
              id: 6,
              name: "SRC",
              vehicle_models: [{ id: 13, category_id: 6, name: "SRC-14" }],
            },
          ])
        }

        // Fetch models with error handling - UPDATED to match the actual API response structure
        try {
          const modelsResponse = await fetch(`${baseUrl}/api/models`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json()
            // The data is directly in data array, not in data.data
            setVehicleModels(modelsData.data || [])
          } else {
            console.warn("Failed to fetch models, using fallback data")
            setVehicleModels([
              {
                id: 13,
                name: "SRC-14",
                sleep_person: "2-3",
                description:
                  "Welcome to the world of the SRC-14, the ultimate small caravan with ensuite that doesn't sacrifice on comfort or functionality.",
                inner_image: "uploads/1748403721_SRC14-Snowy-River-Caravans-LRV231153-Theme-3.png",
                category_id: 6,
                base_price: "79500.00",
                price: "79500.00",
                category: {
                  id: 6,
                  name: "SRC",
                },
              },
            ])
          }
        } catch (error) {
          console.warn("Models API error:", error)
          setVehicleModels([
            {
              id: 13,
              name: "SRC-14",
              sleep_person: "2-3",
              description:
                "Welcome to the world of the SRC-14, the ultimate small caravan with ensuite that doesn't sacrifice on comfort or functionality.",
              inner_image: "uploads/1748403721_SRC14-Snowy-River-Caravans-LRV231153-Theme-3.png",
              category_id: 6,
              base_price: "79500.00",
              price: "79500.00",
              category: {
                id: 6,
                name: "SRC",
              },
            },
          ])
        }

        // Fetch colors with error handling
        try {
          const colorsResponse = await fetch(`${baseUrl}/api/colors`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (colorsResponse.ok) {
            const colorsData = await colorsResponse.json()
            setColors(colorsData.data?.data || [])
          } else {
            console.warn("Failed to fetch colors, using fallback data")
            setColors([])
          }
        } catch (error) {
          console.warn("Colors API error:", error)
          setColors([])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      }

      // If model is updated, find and set the corresponding model data
      if (field === "model" && typeof value === "string") {
        const selectedModel = vehicleModels.find((model) => model.name === value)
        newData.modelData = selectedModel || null
      }

      console.log("Updated form data:", newData)
      return newData
    })
  }

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    } else {
      // Show save modal instead of direct save
      setShowSaveModal(true)
    }
  }

  const handleSaveAndView = async () => {
    try {
      setSaving(true)

      // Calculate pricing
      const basePrice = Number.parseFloat(formData.modelData?.base_price || "79500")

      const calculateManufacturerOptionsPrice = () => {
        const total = 0
        if (formData.manufacturerOptions && typeof formData.manufacturerOptions === "object") {
          // Add manufacturer options price calculation logic here
        }
        return total
      }

      const calculateVanariOptionsPrice = () => {
        const total = 0
        if (formData.vanariOptions && typeof formData.vanariOptions === "object") {
          // Add vanari options price calculation logic here
        }
        return total
      }

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
        base_price: basePrice,
        manufacturer_options_price: calculateManufacturerOptionsPrice(),
        vanari_options_price: calculateVanariOptionsPrice(),
        total_price: basePrice + calculateManufacturerOptionsPrice() + calculateVanariOptionsPrice(),

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
        setShowSaveModal(false)

        // Navigate to order page with configuration data
        const configParam = encodeURIComponent(JSON.stringify(formData))
         navigate(`/order?config=${configParam}`)  // Changed this line
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

  const handleInputChange = (field: string, value: string) => {
    updateFormData("contactInfo", {
      ...formData.contactInfo,
      [field]: value,
    })
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <span className="ml-2 text-white">Loading...</span>
        </div>
      )
    }

    switch (currentStep) {
      case 1:
        return (
          <ModelSelection
            formData={formData}
            updateFormData={updateFormData}
            modelCategories={modelCategories}
            vehicleModels={vehicleModels}
          />
        )
      case 2:
        return <ColorSelection formData={formData} updateFormData={updateFormData} colors={colors} />
      case 3:
        return <ExternalOptions formData={formData} updateFormData={updateFormData} colors={colors} />
      case 4:
        return <ManufacturerOptions formData={formData} updateFormData={updateFormData} />
      case 5:
        return <VanariOptions formData={formData} updateFormData={updateFormData} />
      case 6:
        return <SaveAndShare formData={formData} updateFormData={updateFormData} />
      default:
        return (
          <ModelSelection
            formData={formData}
            updateFormData={updateFormData}
            modelCategories={modelCategories}
            vehicleModels={vehicleModels}
          />
        )
    }
  }

  return (
    <div className="container">
      <div className="flex flex-col min-h-screen">
        <header className="py-8">
          <h1 className="text-2xl font-bold text-center text-[#999999] mb-4">Build Your Dream</h1>
          <p className="text-sm text-center text-[#333333] mt-1">
            Select your Caravan, Accessories and place a hold for our next available delivery date through our quote
            builder.
          </p>
        </header>

        <div className="px-6 py-4">
          <StepBar currentStep={currentStep} onStepChange={handleStepChange} />
        </div>

        <main className="flex-1 p-6">
          {renderStep()}

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              className={`px-6 py-2 uppercase text-sm font-bold ${
                currentStep === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-[#FFE4A8] hover:bg-[#FFE4A8]/80"
              }`}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#FFE4A8] hover:bg-[#FFE4A8]/80 uppercase text-sm font-bold text-black"
            >
              {currentStep === 6 ? "Save & View" : "Next"}
            </button>
          </div>
        </main>

        <footer className="py-3 px-6 border-t border-gray-800 text-xs text-gray-500 text-center">
          Specifications and pricing may be subject to change without notice at the discretion of the Manufacturer &
          Dealer. Floorplans and imagery are for illustrative purposes only. Actual caravans may differ.
        </footer>

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-black border border-gray-700 p-8 rounded-lg max-w-md w-full mx-4">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 text-white">Save & Share</h2>

                <div className="bg-[#1A1A1A] p-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm text-white">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.contactInfo?.firstName || ""}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full p-2 bg-white text-black border border-gray-700 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm text-white">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.contactInfo?.lastName || ""}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full p-2 bg-white text-black border border-gray-700 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm text-white">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.contactInfo?.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full p-2 bg-white text-black border border-gray-700 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm text-white">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.contactInfo?.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full p-2 bg-white text-black border border-gray-700 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="block text-sm text-white">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={formData.contactInfo?.postalCode || ""}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className="w-full p-2 bg-white text-black border border-gray-700 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAndView}
                    disabled={saving}
                    className="flex-1 bg-[#FFE4A8] hover:bg-[#FFE4A8]/80 text-black font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save & View Configuration"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
