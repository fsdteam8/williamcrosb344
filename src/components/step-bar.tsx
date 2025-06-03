"use client"

import { cn } from "@/lib/utils"

interface StepBarProps {
  currentStep: number
  onStepChange: (step: number) => void
}

export default function StepBar({ currentStep }: StepBarProps) {
  const steps = [
    { number: 1, title: "SELECT MODEL & FLOORPLAN" },
    { number: 2, title: "SELECT COLOUR" },
    { number: 3, title: "SELECT EXTERNAL OPTIONS" },
    { number: 4, title: "SELECT MANUFACTURER OPTIONS" },
    { number: 5, title: "SELECT VANARI OPTIONS" },
    { number: 6, title: "SAVE & SHARE" },
  ]

  return (
    <div className="">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <button
              className={cn(
                "flex flex-col gap-2 lg:w-[151px] lg:h-[129px] items-center justify-center text-center transition-colors lg:min-w-[100px] bg-[#1E1E1E] rounded-md p-[2px] lg:p-4",
                currentStep === step.number ? " bg-[#FFE4A8]" : "text-[#999999] hover:text-gray-300 ",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full mb-1",
                  currentStep === step.number
                    ? "bg-black text-white"
                    : index < currentStep - 1
                      ? "bg-[#999999] text-[#1E1E1E]"
                      : "bg-[#999999] text-[#1E1E1E]",
                )}
              >
                {step.number}
              </div>
              <span className={cn(
                "text-xs font-bold hidden lg:block",
                currentStep === step.number ? "text-[#1E1E1E]" : "text-white"
              )}>
                {step.title}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn("h-[1px] w-4 md:w-8 lg:w-12", index < currentStep - 1 ? "bg-yellow-400" : "bg-gray-700")}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
