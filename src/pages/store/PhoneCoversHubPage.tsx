import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Shield, Layers, Smartphone } from "lucide-react"

export function PhoneCoversHubPage() {
  const coverTypes = [
    {
      id: "dual-protection-case",
      name: "Dual Protection Covers",
      description: "Ultimate drop protection with a tough outer shell and shock-absorbing inner core. Built for extreme lifestyle.",
      image: "/small.png",
      badge: "10FT IMPACT ARMOR",
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      features: ["10ft Drop Protection", "Shock Absorbing TPU", "360° Raised Bezels"]
    },
    {
      id: "glass-case",
      name: "Premium Glass Covers",
      description: "Stunning 9H tempered glass back that makes 3D designs pop with optical clarity and scratch protection.",
      image: "/glass.png",
      badge: "9H OPTICAL GLASS",
      icon: <Layers className="h-6 w-6 text-amber-600" />,
      features: ["9H Tempered Glass", "Vibrant 3D Prints", "Zero Yellowing"]
    },
    {
      id: "metal-case",
      name: "Metal Texture Covers",
      description: "Brushed metal texture aesthetic fused with polycarbonate back. The ultimate statement of durability.",
      image: "/metal.png",
      badge: "BRUSHED FINISH",
      icon: <Smartphone className="h-6 w-6 text-violet-600" />,
      features: ["Metallic Finish", "Ultra Ergonomic", "Lightweight Armor"]
    }
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-gray-900 antialiased selection:bg-black selection:text-white pb-24">
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200/80 pt-16 pb-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-4 text-gray-500">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <span>Category</span>
            <span>/</span>
            <span className="text-black font-bold">Phone Covers</span>
          </div>
          <span className="block text-[10px] font-black tracking-widest text-violet-600 uppercase bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100 max-w-fit mx-auto mb-4">
            MATERIALS & PROTECTION
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-4 text-gray-900">
            Phone Cover Series
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto">
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
              className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-200/80 flex flex-col group"
            >
              <div className="aspect-[4/5] rounded-[2rem] bg-gray-50 overflow-hidden mb-8 relative">
                <img 
                  src={cover.image} 
                  alt={cover.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4 h-12 w-12 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl flex items-center justify-center shadow-md">
                  {cover.icon}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-black tracking-widest text-black bg-white/90 backdrop-blur-xl border border-gray-200 px-3 py-1 rounded-full uppercase shadow-md">
                    {cover.badge}
                  </span>
                </div>
              </div>
              
              <h2 className="text-2xl font-display font-black text-gray-900 mb-2">{cover.name}</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6 flex-1">{cover.description}</p>
              
              <div className="space-y-2 mb-8">
                {cover.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <div className="h-1.5 w-1.5 rounded-full bg-black" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <span className="font-extrabold text-xs uppercase tracking-wider text-gray-900 group-hover:text-violet-600 transition-colors">
                  Explore Series
                </span>
                <div className="h-10 w-10 rounded-full bg-black text-white group-hover:bg-violet-600 transition-colors flex items-center justify-center">
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
