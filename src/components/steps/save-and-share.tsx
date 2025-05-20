"use client"

import type { StepProps } from "@/lib/types"


export default function SaveAndShare({ formData, updateFormData }: StepProps) {
  const handleInputChange = (field: string, value: string) => {
    updateFormData("contactInfo", {
      ...formData.contactInfo,
      [field]: value,
    })
  }

  // const basePrice = 79800

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6 text-center">Save & Share</h2>

      <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto bg-[#1A1A1A] p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm text-start text-white">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.contactInfo?.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full p-2 bg-white border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm text-start text-white">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.contactInfo?.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full p-2 bg-white border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-start text-white">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.contactInfo?.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full p-2 bg-white border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm text-start text-white">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.contactInfo?.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full p-2 bg-white border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="postalCode" className="block text-sm text-start text-white">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.contactInfo?.postalCode || ""}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="w-full p-2 bg-white border border-gray-700 focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
