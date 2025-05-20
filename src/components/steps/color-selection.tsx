"use client"

import type { StepProps } from "@/lib/types"

interface ColorSelectionData {
  theme?: string
  baseColor?: string
  decalColor?: string
  flooring?: string
  cabinetry?: string
  benchtop?: string
  splashback?: string
  fabric?: string
  leather?: string
}

export default function ColorSelection({ formData, updateFormData }: StepProps) {
  const themes = [
    { id: "coastal-luxe", name: "Coastal Luxe" },
    { id: "city-oasis", name: "City Oasis" },
    { id: "silver-glamour", name: "Silver Glamour" },
    { id: "urban-glam", name: "Urban Glam" },
    { id: "graphite-storm", name: "Graphite Storm" },
    { id: "shadow-grove", name: "Shadow Grove" },
    { id: "subtle-elegance", name: "Subtle Elegance" },
    { id: "ocean-blue", name: "Ocean Blue" },
    { id: "blue-lagoon", name: "Blue Lagoon" },
  ]

  const color =
    typeof formData.color === "object" && formData.color !== null
      ? (formData.color as ColorSelectionData)
      : ({} as ColorSelectionData)

  const handleColorSelect = (colorData: Partial<ColorSelectionData>) => {
    updateFormData("color", { ...color, ...colorData })
  }

  // Get the selected theme name for display
  const selectedThemeName = themes.find((t) => t.id === color.theme)?.name || "Select Theme"

  return (
    <div className="flex flex-col md:flex-row gap-6 text-white mt-[80px]">
      {/* Left Column - Theme Selection */}
      <div className="w-full md:w-1/3 space-y-6">
        <h3 className="text-white mb-2">Select Theme</h3>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleColorSelect({ theme: theme.id })}
              className={`py-2 px-3 text-sm text-center rounded ${color.theme === theme.id ? "bg-[#FFE4A8] text-black" : "bg-[#1e1e1e] text-white hover:bg-[#333]"
                }`}
            >
              {theme.name}
            </button>
          ))}
        </div>

        {color.theme && (
          <div className="bg-[#202020] space-y-2">
            <div className="border-b border-[#333] py-12">
              <h2 className="text-center uppercase font-bold text-xl">{selectedThemeName}</h2>
            </div>

            <div className="space-y-6 py-12">
              <div className="flex items-center justify-center">
                <div>
                  <h3 className="uppercase font-bold mb-2">Flooring</h3>
                  <div className="">
                    <button
                      onClick={() => handleColorSelect({ flooring: "montreal-vt1205007" })}
                      className={`border-2 ${color.flooring === "montreal-vt1205007" ? "border-[#FFD700]" : "border-transparent"}`}
                    >
                      <img src="/assets/Montreal-VFT10120507-1.jpg" alt="Montreal VT1205007" className="w-24 h-20 object-cover" />
                    </button>
                    <div className="text-xs">
                      <p>Flooring</p>
                      <p>Montreal</p>
                      <p>VT1205007</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div>
                  <h3 className="uppercase font-bold mb-2">Cabinetry</h3>
                  <div className="">
                    <button
                      onClick={() => handleColorSelect({ cabinetry: "white-d049" })}
                      className={`border-2 ${color.cabinetry === "white-d049" ? "border-[#FFD700]" : "border-transparent"}`}
                    >
                      <img src="/assets/White-0949-2.jpg" alt="White D049" className="w-24 h-20 object-cover" />
                    </button>
                    <div className="text-xs">
                      <p>All Cabinetry</p>
                      <p>White D049</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="uppercase font-bold mb-8">Tabletop and Splashback</h3>
                <div className="flex justify-center gap-2">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleColorSelect({ benchtop: "agate-ash-s84408" })}
                      className={`border-2 ${color.benchtop === "agate-ash-s84408" ? "border-[#FFD700]" : "border-transparent"}`}
                    >
                      <img src="/assets/Montreal-VFT10120507-1.jpg" alt="Agate Ash" className="w-20 h-20 object-cover" />
                    </button>
                    <div className="text-xs text-center mt-1">
                      <p>Benchtops</p>
                      <p>Agate Ash</p>
                      <p>S84408</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleColorSelect({ splashback: "white-d049" })}
                      className={`border-2 ${color.splashback === "white-d049" ? "border-[#FFD700]" : "border-transparent"}`}
                    >
                      <img src="/assets/White-0949-2.jpg" alt="White D049" className="w-20 h-20 object-cover" />
                    </button>
                    <div className="text-xs text-center mt-1">
                      <p>Splashback</p>
                      <p>White D049</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="uppercase font-bold mb-4">Seating and Headboard</h3>
                <div className="flex justify-center gap-2">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleColorSelect({ fabric: "kama-cobblestone-s213-t5a" })}
                      className={`border-2 ${color.fabric === "kama-cobblestone-s213-t5a" ? "border-[#FFD700]" : "border-transparent"}`}
                    >
                      <img
                        src="/assets/Kiama-Cobblestone-S213-75A-1-1.jpg"
                        alt="Kama Cobblestone"
                        className="w-20 h-20 object-cover"
                      />
                    </button>
                    <div className="text-xs text-center mt-1">
                      <p>Fabric</p>
                      <p>Kama Cobblestone</p>
                      <p>S213 T5A</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleColorSelect({ leather: "taupe-0631-s" })}
                      className={`border-2 ${color.leather === "taupe-0631-s" ? "border-[#FFD700]" : "border-transparent"}`}
                    >
                      <img
                        src="/assets/Montreal-VFT10120507-1.jpg"
                        alt="Taupe 0631 S"
                        className="w-20 h-20 object-cover"
                      />
                    </button>
                    <div className="text-xs text-center mt-1">
                      <p>Leather</p>
                      <p>Taupe 0631 S</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Preview */}
      <div className="w-full md:w-2/3 bg-[#1e1e1e] p-6 mt-[150px] md:mt-[80px]">
        {color.theme ? (
          <div className="space-y-6">
            <div className="mt-[-130px] mb-6 flex justify-center">
              <img
                src="/assets/mainmodel.webp"
                alt="Caravan Preview"
                className="w-[250px] h-[200px] object-contain"
              />
            </div>
            <h3 className="text-center text-white">Your New SRC-14</h3>



            <div className="aspect-video relative mb-6">
              <img
                src="/assets/car.png"
                alt="Interior Preview"
                className="w-full object-contain"
              />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span>Flooring: Montreal VT1205007</span>
                <div className="w-6 h-6 bg-[#d2b48c]"></div>
              </div>

              <div className="flex justify-between items-center">
                <span>All Cabinetry: White D049</span>
                <div className="w-6 h-6 bg-white"></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Benchtops: Agate Ash S84408</span>
                <div className="w-6 h-6 bg-[#d2b48c]"></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Splashback: White D049</span>
                <div className="w-6 h-6 bg-white"></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Fabric: Kama Cobblestone S213 T5A</span>
                <div className="w-6 h-6 bg-[#a9a9a9]"></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Leather: Taupe 0631 S</span>
                <div className="w-6 h-6 bg-[#c2b280]"></div>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Base Price</span>
                <span>$79,900.00</span>
              </div>

              <div className="text-sm space-y-1 text-gray-300">
                <p>Hot Dip Galvanised Chassis (orders placed from 14/07/23 onwards)</p>
                <p>100L Grey Water Tank</p>
                <p>Shower with Glass Door</p>
                <p>All on-road costs (3 year WOF & 1 year REGO)</p>
                <p>NZ Electrical WOF</p>
                <p>Green Self Containment Certificate (4 years)</p>
                <p>Gas to Go</p>
                <p>All SRC models come with a 5 year structural warranty and 2 year manufacturers warranty.</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between">
                  <span>Manufacturer Options</span>
                  <span>$0.00</span>
                </div>
                <div className="text-sm space-y-1 text-gray-300">
                  <p>NZ Tyre Repair Kit (NZ Dealer Pack)</p>
                  <p>Remove TV Antenna and Replace Roof Satellite (NZ Dealer Pack)</p>
                  <p>1 x Grey Water Tank with Gauge</p>
                  <p>Gas Bottle Holder Only (NZ Dealer Pack)</p>
                  <p>4" (100mm) Pot Tap Deck</p>
                </div>
              </div>

              <div className="flex justify-between font-bold pt-4 border-t border-gray-700 mt-4">
                <span>Estimated Total Build Price</span>
                <span>$79,900.00</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Please select a theme to view your caravan</p>
          </div>
        )}
      </div>
    </div>
  )
}
