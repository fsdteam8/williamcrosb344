"use client"

import { useState, useEffect } from "react"
import StepBar from "./step-bar"
import ModelSelection from "./steps/model-selection"
import ColorSelection from "./steps/color-selection"
import ExternalOptions from "./steps/external-options"
import ManufacturerOptions from "./steps/manufacturer-options"
import VanariOptions from "./steps/vanari-options"
import SaveAndShare from "./steps/save-and-share"
import { Loader2 } from "lucide-react"

// Define types based on the API responses
interface ModelCategory {
  id: number
  name: string
  vehicle_models: {
    id: number
    category_id: number
    name: string
  }[]
}

interface VehicleModel {
  id: number
  name: string
  sleep_person: string
  description: string
  inner_image: string
  category_id: number
  base_price: string
  price: string
  categories: any
}

interface Color {
  id: number
  name: string
  code: string | null
  image: string | null
  status: string
}

interface FormData {
  model: string
  modelData: VehicleModel | null
  color: any
  externalOptions: any
  manufacturerOptions: any
  vanariOptions: any
  contactInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    postalCode: string
  }
}

export default function MultiStepForm() {
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

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch model categories
        const categoriesResponse = await fetch("https://ben10.scaleupdevagency.com/api/frontend-models-category")
        const categoriesData = await categoriesResponse.json()
        setModelCategories(categoriesData)

        // Fetch models
        const modelsResponse = await fetch("https://ben10.scaleupdevagency.com/api/models")
        const modelsData = await modelsResponse.json()
        setVehicleModels(modelsData.data.data)

        // Fetch colors
        const colorsResponse = await fetch("https://ben10.scaleupdevagency.com/api/colors")
        const colorsData = await colorsResponse.json()
        setColors(colorsData.data.data)

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
      // Submit form
      console.log("Final form data:", formData)
    }
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
              className={`px-6 py-2 uppercase text-sm font-bold ${currentStep === 1 ? "bg-[#FFE4A8]" : "bg-[#FFE4A8] hover:bg-[#FFE4A8]/80"
                }`}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#FFE4A8] hover:bg-[#FFE4A8]/80 uppercase text-sm font-bold"
            >
              {currentStep === 6 ? "Save & Share" : "Next"}
            </button>
          </div>
        </main>

        <footer className="py-3 px-6 border-t border-gray-800 text-xs text-gray-500 text-center">
          Specifications and pricing may be subject to change without notice at the discretion of the Manufacturer &
          Dealer. Floorplans and imagery are for illustrative purposes only. Actual caravans may differ.
        </footer>
      </div>
    </div>
  )
}
