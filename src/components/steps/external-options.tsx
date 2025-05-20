"use client"

import type { StepProps } from "@/lib/types"
import CaravanCarousel from "../CaravanCarousel"

interface ExternalOptionsData {
  baseColor?: string
  decalColor?: string
}

export default function ExternalOptions({ formData, updateFormData }: StepProps) {
  const baseColors = [
    {
      id: "silver",
      name: "Silver",
      image: "/assets/SILVER.png",
    },
    {
      id: "white",
      name: "White",
      image: "/assets/SILVER.png",
    },
    {
      id: "mocha",
      name: "Mocha",
      image: "/assets/SILVER.png",
    },
    {
      id: "grey",
      name: "Basalt Grey",
      image: "/assets/SILVER.png",
    },
  ]

  const decalColors = [
    {
      id: "snowy-teal",
      name: "Snowy Teal",
      image: "/assets/TEAL-DECAL-01.png",
    },
    {
      id: "regal-blue",
      name: "Regal Blue",
      image: "/assets/TEAL-DECAL-01.png",
    },
    {
      id: "opulent-orange",
      name: "Opulent Orange",
      image: "/assets/TEAL-DECAL-01.png",
    },
    {
      id: "outback-red",
      name: "Outback Red",
      image: "/assets/TEAL-DECAL-01.png",
    },
    {
      id: "sunrise-yellow",
      name: "Sunrise Yellow",
      image: "/assets/TEAL-DECAL-01.png",
    },
    {
      id: "silver",
      name: "Silver",
      image: "/assets/TEAL-DECAL-01.png",
    },
    {
      id: "forest-green",
      name: "Forest Green",
      image: "/assets/TEAL-DECAL-01.png",
    },
  ]

  const externalOptions =
    typeof formData.externalOptions === "object" && formData.externalOptions !== null
      ? (formData.externalOptions as ExternalOptionsData)
      : ({} as ExternalOptionsData)

  const handleColorSelect = (colorData: Partial<ExternalOptionsData>) => {
    updateFormData("externalOptions", { ...externalOptions, ...colorData })
  }

  const basePrice = 79500
  const caravanImages = ["/assets/Silver-Snowy-Teal-Rightside.png", "/assets/Silver-Snowy-Teal-Rightside.png", "/assets/Silver-Snowy-Teal-Rightside.png"]

  return (
    <div className=" text-white mt-[80px]">


      <div className="grid grid-cols-5 gap-6 ">
        <div className="space-y-8 bg-[#202020] p-8 col-span-5 md:col-span-2 rounded-lg">
          {/* Base Colors Section */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-start">Select Colour</h2>
            <h3 className="font-bold mb-8 uppercase lg:text-center text-start">EXTERNAL BASE COLOURS</h3>
            <div className="grid grid-cols-3 gap-4 justify-center">
              {baseColors.slice(0, 3).map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect({ baseColor: color.id })}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-16 h-16 border-2 ${externalOptions.baseColor === color.id ? "border-white" : "border-gray-600"
                      } rounded overflow-hidden`}
                  >
                    <img
                      src={color.image || "/placeholder.svg"}
                      alt={color.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs mt-1 text-center">{color.name}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 justify-center mt-4">
              <div className="flex justify-center">
                <button
                  onClick={() => handleColorSelect({ baseColor: baseColors[3].id })}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-16 h-16 border-2 ${externalOptions.baseColor === baseColors[3].id ? "border-white" : "border-gray-600"
                      } rounded overflow-hidden`}
                  >
                    <img
                      src={baseColors[3].image || "/placeholder.svg"}
                      alt={baseColors[3].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs mt-1 text-center">{baseColors[3].name}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Decal Colors Section */}
          <div>
            <h3 className="font-bold mb-8 uppercase lg:text-center text-start">EXTERNAL DECALS COLOURS</h3>
            <div className="grid grid-cols-3 gap-4">
              {decalColors.slice(0, 6).map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect({ decalColor: color.id })}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-16 h-16 border-2 ${externalOptions.decalColor === color.id ? "border-white" : "border-gray-600"
                      } rounded overflow-hidden`}
                  >
                    <img
                      src={color.image || "/placeholder.svg"}
                      alt={color.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs mt-1 text-center">
                    {color.name.split(" ")[0]}
                    <br />
                    {color.name.split(" ").slice(1).join(" ")}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 justify-center mt-4">
              <div className="flex justify-center">
                <button
                  onClick={() => handleColorSelect({ decalColor: decalColors[6].id })}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-16 h-16 border-2 ${externalOptions.decalColor === decalColors[6].id ? "border-white" : "border-gray-600"
                      } rounded overflow-hidden`}
                  >
                    <img
                      src={decalColors[6].image || "/placeholder.svg"}
                      alt={decalColors[6].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs mt-1 text-center">
                    {decalColors[6].name.split(" ")[0]}
                    <br />
                    {decalColors[6].name.split(" ").slice(1).join(" ")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5 lg:col-span-3 bg-[#1e1e1e] p-6 rounded-lg mt-[80px]">
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
              <CaravanCarousel
                images={caravanImages}
                baseColor={externalOptions.baseColor || "silver"}
                decalColor={externalOptions.decalColor || "snowy-teal"}
              />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-start">External Base Colour</span>
                <div className="flex items-center gap-2">
                  <span className="capitalize">{externalOptions.baseColor || "Silver"}</span>
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-start">External Decals Colour</span>
                <div className="flex items-center gap-2">
                  <span className="capitalize">{(externalOptions.decalColor || "Snowy Teal").replace("-", " ")}</span>
                  <div className="w-5 h-5 bg-teal-500 rounded"></div>
                </div>
              </div>
            </div>

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

              <div className="text-xs space-y-1 text-gray-400 text-start">
                <p>NZ Type Power Inlet (NZ Dealer Pack)</p>
                <p>Remove TV Antenna and Prewire Roof Satellite (NZ Dealer Pack)</p>
                <p>1 x Grey Water Tank with Gauge</p>
                <p>Gas Bottle Holder Only (NZ Dealer Pack)</p>
                <p>4" (100+100) Hot Dip Gal Deck</p>
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
