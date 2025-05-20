"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CaravanCarouselProps {
  images: string[]
  title?: string
  baseColor?: string
  decalColor?: string
  className?: string
  showIndicators?: boolean
  autoPlay?: boolean
  interval?: number
}

export default function CaravanCarousel({
  images,
  title,
  className = "",
  showIndicators = true,
  autoPlay = false,
  interval = 5000,
}: CaravanCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play functionality
  useState(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      goToNext()
    }, interval)

    return () => clearInterval(timer)
  })

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className={`h-full w-full flex items-center justify-center bg-gray-900 ${className}`}>
        <p className="text-gray-400">No images available</p>
      </div>
    )
  }

  return (
    <div className={`h-full w-full relative ${className}`}>
      {/* Left Navigation Arrow */}
      <div className="absolute left-[-20px] lg:left-4 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={goToPrevious}
          className="bg-[#333] hover:bg-[#444] rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Carousel Container */}
      <div className="h-full w-full overflow-hidden">
        <div
          className="h-full w-full transition-transform duration-500 ease-out flex"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="h-full w-full flex-shrink-0">
              <img
                src={src || "/placeholder.svg"}
                alt={`View ${index + 1}`}
                className="w-full h-full object-contain"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Navigation Arrow */}
      <div className="absolute right-[-20px] lg:right-4 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={goToNext}
          className="bg-[#333] hover:bg-[#444] rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          aria-label="Next image"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? "bg-[#FFE4A8]" : "bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentIndex === index ? "true" : "false"}
            />
          ))}
        </div>
      )}

      {/* Title */}
      {title && (
        <div className="absolute top-0 left-0 right-0 text-center py-2">
          <h3 className="font-bold text-white">{title}</h3>
        </div>
      )}
    </div>
  )
}
