import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { catalogApi } from "../../lib/api"
import { Smartphone, ArrowRight, CheckCircle2, Sparkles, ChevronRight } from "lucide-react"

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
      <div className="bg-zinc-950/95 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.4)] border border-zinc-800 text-white relative overflow-hidden">
        
        {/* Subtle Ambient Glow Effect */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shrink-0 shadow-lg shadow-amber-500/20">
              <Smartphone className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  CONFIGURATOR
                </span>
                <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 1000+ Devices Supported
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-display font-black tracking-tight text-white">
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
                className="w-full bg-zinc-900/90 border border-zinc-700/80 text-white text-sm font-semibold rounded-2xl px-4 py-3.5 focus:outline-none focus:border-amber-400 hover:border-zinc-600 transition-all cursor-pointer shadow-inner"
              >
                <option value="" className="bg-zinc-900 text-zinc-400">1. Select Brand (Apple, Samsung...)</option>
                {brands.map((b: any) => (
                  <option key={b._id} value={b._id} className="bg-zinc-900 text-white">
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
                className="w-full bg-zinc-900/90 border border-zinc-700/80 text-white text-sm font-semibold rounded-2xl px-4 py-3.5 focus:outline-none focus:border-amber-400 hover:border-zinc-600 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-inner"
              >
                <option value="" className="bg-zinc-900 text-zinc-400">
                  {selectedBrand ? "2. Select Model (e.g. iPhone 15)" : "Select Brand First"}
                </option>
                {devices.map((d: any) => (
                  <option key={d._id} value={d._id} className="bg-zinc-900 text-white">
                    {d.displayName || d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedBrand}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-amber-400 text-black font-black text-sm active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
            >
              <span>Explore</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
