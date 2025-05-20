"use client"

import type { StepProps } from "@/lib/types"

export default function ModelSelection({ formData, updateFormData }: StepProps) {
  const srcModels = [
    { id: "SRC-14", name: "SRC-14" },
    { id: "SRC-16", name: "SRC-16" },
    { id: "SRC-17", name: "SRC-17" },
    { id: "SRC-18", name: "SRC-18" },
    { id: "SRC-19", name: "SRC-19" },
    { id: "SRC-19E", name: "SRC-19E" },
    { id: "SRC-20", name: "SRC-20" },
    { id: "SRC-20F", name: "SRC-20F" },
    { id: "SRC-21", name: "SRC-21" },
    { id: "SRC-21S", name: "SRC-21S" },
    { id: "SRC-22", name: "SRC-22" },
    { id: "SRC-22F", name: "SRC-22F" },
    { id: "SRC-22S", name: "SRC-22S" },
    { id: "SRC-24", name: "SRC-24" },
  ]

  const srpModels = [
    { id: "SRP-15", name: "SRP-15" },
    { id: "SRP-16F", name: "SRP-16F" },
    { id: "SRP-19", name: "SRP-19" },
    { id: "SRP-19F", name: "SRP-19F" },
  ]

  const srtModels = [
    { id: "SRT-18", name: "SRT-18" },
    { id: "SRT-18F", name: "SRT-18F" },
    { id: "SRT-19", name: "SRT-19" },
    { id: "SRT-20", name: "SRT-20" },
    { id: "SRT-22F", name: "SRT-22F" },
  ]

  const handleModelSelect = (modelId: string) => {
    updateFormData("model", modelId)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Select Your Model</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2 text-white">SRC</h3>
            <div className="grid grid-cols-2 gap-2">
              {srcModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`p-3 text-center text-white rounded ${
                    formData.model === model.id
                      ? "bg-[#FFE4A8] !text-black"
                      : "bg-[#1e1e1e] hover:bg-[#FFE4A8] hover:text-black"
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2 text-white">SRP</h3>
            <div className="grid grid-cols-2 gap-2">
              {srpModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`p-3 text-center text-white rounded ${
                    formData.model === model.id
                      ? "bg-[#FFE4A8] !text-black"
                      : "bg-[#1e1e1e] hover:bg-[#FFE4A8] hover:text-black"
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2 text-white">SRT</h3>
            <div className="grid grid-cols-2 gap-2">
              {srtModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`p-3 text-center text-white rounded ${
                    formData.model === model.id
                      ? "bg-[#FFE4A8] !text-black"
                      : "bg-[#1e1e1e] hover:bg-[#FFE4A8] hover:text-black"
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-0">
          {formData.model && (
            <div className="space-y-4">
              <div className="aspect-video relative">
                <img
                  src="/assets/car.png"
                  alt="Floorplan"
                  width={1000}
                  height={1000}
                  className="object-contain"
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mt-8">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/assets/ref-icon.svg" alt="Refrigerator" width={40} height={40} />
                  </div>
                  <span className="text-xs mt-1 text-white">Refrigerator</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/assets/sleeps-icon.svg" alt="Sleeps" width={40} height={40} />
                  </div>
                  <span className="text-xs mt-1 text-white">Sleeps 2-3</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/assets/shower-icon.svg" alt="Shower" width={40} height={40} />
                  </div>
                  <span className="text-xs mt-1 text-white">Shower</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/assets/toilet.svg" alt="Toilet" width={40} height={40} />
                  </div>
                  <span className="text-xs mt-1 text-white">Toilet</span>
                </div>
              </div>

              {formData.model === "SRC-14" && (
                <div className="mt-4 ">
                  <h3 className="font-bold mb-2 text-white text-[20px] text-start">{formData.model}</h3>
                  <p className="text-white text-sm text-start">
                    Welcome to the world of the SRC-14, the ultimate small caravan with ensure that doesn't sacrifice on
                    comfort or functionality. Despite its small size, this exceptional model is filled with a remarkable
                    range of features, guaranteeing unmatched comfort for your journey. With its cozy and inviting
                    interior, it becomes your perfect home away from home, providing a delightful sanctuary wherever
                    your adventures may lead.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
