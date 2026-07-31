import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { catalogApi } from "../../lib/api"
import { Smartphone, ArrowRight, Sparkles, CheckCircle } from "lucide-react"

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
    <div className="w-full max-w-5xl mx-auto -mt-10 md:-mt-14 relative z-30 px-4">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-200/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shrink-0 shadow-md">
              <Smartphone className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-widest text-violet-600 uppercase bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">
                  INSTANT FINDER
                </span>
                <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-500" /> 1000+ Models Supported
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-display font-black text-gray-900 tracking-tight mt-0.5">
                Select Your Phone Model
              </h3>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:max-w-xl">
            {/* Brand Dropdown */}
            <div className="w-full sm:w-1/2">
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value)
                  setSelectedDevice("")
                }}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-semibold rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-black/10 hover:border-gray-300 transition-all cursor-pointer"
              >
                <option value="">Select Brand (Apple, Samsung...)</option>
                {brands.map((b: any) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Dropdown */}
            <div className="w-full sm:w-1/2">
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                disabled={!selectedBrand}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-semibold rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-black/10 hover:border-gray-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedBrand ? "Select Model (e.g. iPhone 15)" : "Select Brand First"}
                </option>
                {devices.map((d: any) => (
                  <option key={d._id} value={d._id}>
                    {d.displayName || d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={!selectedBrand}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-black text-white font-extrabold text-sm hover:bg-gray-900 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>View Covers</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
