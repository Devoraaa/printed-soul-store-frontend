import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Shield, Layers, Smartphone, Sparkles, ChevronRight } from "lucide-react"

export function PhoneCoversHubPage() {
  const coverTypes = [
    {
      id: "dual-protection-case",
      name: "Dual Protection Covers",
      description: "Ultimate drop protection with a tough outer shell and shock-absorbing inner core. Built for extreme lifestyle.",
      image: "/small.png",
      badge: "10FT IMPACT ARMOR",
      icon: <Shield className="h-6 w-6 text-emerald-400" />,
      features: ["10ft Drop Protection", "Shock Absorbing TPU", "360° Raised Bezels"]
    },
    {
      id: "glass-case",
      name: "Premium Glass Covers",
      description: "Stunning 9H tempered glass back that makes 3D designs pop with optical clarity and scratch protection.",
      image: "/glass.png",
      badge: "9H OPTICAL GLASS",
      icon: <Layers className="h-6 w-6 text-amber-400" />,
      features: ["9H Tempered Glass", "Vibrant 3D Prints", "Zero Yellowing"]
    },
    {
      id: "metal-case",
      name: "Metal Texture Covers",
      description: "Brushed metal texture aesthetic fused with polycarbonate back. The ultimate statement of durability.",
      image: "/metal.png",
      badge: "BRUSHED FINISH",
      icon: <Smartphone className="h-6 w-6 text-violet-400" />,
      features: ["Metallic Finish", "Ultra Ergonomic", "Lightweight Armor"]
    }
  ]

  return (
    <div className="bg-[#09090b] min-h-screen text-white antialiased selection:bg-white selection:text-black pb-24">
      
      {/* Header Section */}
      <div className="bg-zinc-950 border-b border-zinc-800/80 pt-16 pb-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-4 text-zinc-500">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span>Category</span>
            <span>/</span>
            <span className="text-amber-400">Phone Covers</span>
          </div>
          <span className="block text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 max-w-fit mx-auto mb-4">
            MATERIALS & PROTECTION
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-4">
            Phone Cover Series
          </h1>
          <p className="text-lg text-zinc-400 font-medium max-w-xl mx-auto">
            Choose your level of protection and style. Precision engineered for over 1000+ device models.
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-[1650px] mx-auto px-4 md:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coverTypes.map((cover) => (
            <Link 
              key={cover.id}
              to={`/categories/${cover.id}`}
              className="bg-zinc-950 rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-zinc-800 hover:border-zinc-500 hover:-translate-y-2 transition-all duration-500 flex flex-col group"
            >
              <div className="aspect-[4/5] rounded-[2rem] bg-zinc-900 overflow-hidden mb-8 relative">
                <img 
                  src={cover.image} 
                  alt={cover.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4 h-12 w-12 bg-black/80 backdrop-blur-xl border border-zinc-700 rounded-2xl flex items-center justify-center shadow-xl">
                  {cover.icon}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-black tracking-widest text-white bg-black/80 backdrop-blur-xl border border-zinc-700 px-3 py-1 rounded-full uppercase">
                    {cover.badge}
                  </span>
                </div>
              </div>
              
              <h2 className="text-2xl font-display font-black text-white mb-2">{cover.name}</h2>
              <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-6 flex-1">{cover.description}</p>
              
              <div className="space-y-2 mb-8">
                {cover.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800/80">
                <span className="font-extrabold text-xs uppercase tracking-wider text-white group-hover:text-amber-400 transition-colors">
                  Explore Series
                </span>
                <div className="h-10 w-10 rounded-full bg-white text-black group-hover:bg-amber-400 transition-colors flex items-center justify-center">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
