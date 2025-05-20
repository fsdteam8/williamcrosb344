"use client"

import { useState } from "react"
// import StepBar from "./step-bar"
import ModelSelection from "./steps/model-selection"
import ColorSelection from "./steps/color-selection"
import ExternalOptions from "./steps/external-options"
import ManufacturerOptions from "./steps/manufacturer-options"
import VanariOptions from "./steps/vanari-options"
import SaveAndShare from "./steps/save-and-share"
import StepBar from "./step-bar"
// import type { FormData } from "@/lib/types"

type FormData = {
  model: string
  color: string
  externalOptions: string[]
  manufacturerOptions: string[]
  vanariOptions: string[]
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
  const [formData, setFormData] = useState<FormData>({
    model: "",
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

  const updateFormData = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    console.log("Updated form data:", { ...formData, [field]: value })
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
    switch (currentStep) {
      case 1:
        return <ModelSelection formData={formData} updateFormData={updateFormData} />
      case 2:
        return <ColorSelection formData={formData} updateFormData={updateFormData} />
      case 3:
        return <ExternalOptions formData={formData} updateFormData={updateFormData} />
      case 4:
        return <ManufacturerOptions formData={formData} updateFormData={updateFormData} />
      case 5:
        return <VanariOptions formData={formData} updateFormData={updateFormData} />
      case 6:
        return <SaveAndShare formData={formData} updateFormData={updateFormData} />
      default:
        return <ModelSelection formData={formData} updateFormData={updateFormData} />
    }
  }

  return (
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
          <button onClick={handleNext} className="px-6 py-2 bg-[#FFE4A8] hover:bg-[#FFE4A8]/80 uppercase text-sm font-bold">
            {currentStep === 6 ? "Save & Share" : "Next"}
          </button>
        </div>
      </main>

      <footer className="py-3 px-6 border-t border-gray-800 text-xs text-gray-500 text-center">
        Specifications and pricing may be subject to change without notice at the discretion of the Manufacturer &
        Dealer. Floorplans and imagery are for illustrative purposes only. Actual caravans may differ.
      </footer>
    </div>
  )
}
