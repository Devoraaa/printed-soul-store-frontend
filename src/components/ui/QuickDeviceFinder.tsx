import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { catalogApi } from "../../lib/api"
import { Smartphone, ArrowRight, CheckCircle2 } from "lucide-react"

export function QuickDeviceFinder() {
  const navigate = useNavigate()
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [selectedDevice, setSelectedDevice] = useState<string>("")

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => catalogApi.getBrands(),
  })
  const brands = brandsData?.data?.data || []

  const selectedBrandObj = brands.find((b: any) => b._id === selectedBrand)

  const { data: devicesData } = useQuery({
    queryKey: ["devices", selectedBrandObj?.slug],
    queryFn: () => catalogApi.getDevicesByBrand(selectedBrandObj.slug),
    enabled: !!selectedBrandObj?.slug,
  })
  const devices = devicesData?.data?.data || []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBrand) return
    let url = `/products?brand=${selectedBrand}`
    if (selectedDevice) {
      url += `&deviceModels=${selectedDevice}`
    }
    navigate(url)
  }

  return (
    <div className="w-full max-w-6xl mx-auto -mt-12 md:-mt-16 relative z-30 px-4">
      <div className="bg-white/95 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200/80 text-gray-900 relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-black flex items-center justify-center text-white shrink-0 shadow-lg">
              <Smartphone className="h-6 w-6 text-amber-400 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black tracking-widest text-violet-600 uppercase bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">
                  INSTANT FINDER
                </span>
                <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 1000+ Models Supported
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-display font-black tracking-tight text-gray-900">
                Find Covers For Your Phone
              </h3>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:max-w-xl">
            {/* Brand Select */}
            <div className="w-full sm:w-1/2">
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value)
                  setSelectedDevice("")
                }}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-semibold rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-black/10 hover:border-gray-300 transition-all cursor-pointer shadow-inner"
              >
                <option value="">1. Select Brand (Apple, Samsung...)</option>
                {brands.map((b: any) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Select */}
            <div className="w-full sm:w-1/2">
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                disabled={!selectedBrand}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-semibold rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-black/10 hover:border-gray-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
              >
                <option value="">
                  {selectedBrand ? "2. Select Model (e.g. iPhone 15)" : "Select Brand First"}
                </option>
                {devices.map((d: any) => (
                  <option key={d._id} value={d._id}>
                    {d.displayName || d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedBrand}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-black text-white font-black text-sm hover:bg-gray-800 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
            >
              <span>View Covers</span>
              <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
