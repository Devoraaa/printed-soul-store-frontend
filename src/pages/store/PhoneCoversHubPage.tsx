import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Shield, Layers, Smartphone } from "lucide-react"

export function PhoneCoversHubPage() {
  const coverTypes = [
    {
      id: "dual-protection-case",
      name: "Dual Protection Covers",
      description: "Ultimate drop protection with a tough outer shell and shock-absorbing inner core. Built for the adventurous.",
      image: "/small.png",
      icon: <Shield className="h-6 w-6" />,
      features: ["10ft Drop Protection", "Shock Absorbing", "Raised Bezels"]
    },
    {
      id: "glass-case",
      name: "Premium Glass Covers",
      description: "A stunning tempered glass back that makes designs pop with cinematic brilliance and deep colors.",
      image: "/glass.png",
      icon: <Layers className="h-6 w-6" />,
      features: ["9H Tempered Glass", "Vibrant Prints", "Scratch Resistant"]
    },
    {
      id: "metal-case",
      name: "Metal Covers",
      description: "Aerospace-grade metal bumper meets premium printed back. The perfect fusion of luxury and durability.",
      image: "/metal.png",
      icon: <Smartphone className="h-6 w-6" />,
      features: ["Aluminum Frame", "Premium Feel", "Lightweight"]
    }
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24">
      {/* Header Section */}
      <div className="bg-black text-white pt-20 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80" />
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-6 text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span>Category</span>
            <span>/</span>
            <span className="text-white">Phone Covers</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter">Phone Covers</h1>
          <p className="text-xl text-gray-300 font-medium">Choose your level of protection and style. Crafted with precision for flagship devices.</p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coverTypes.map((cover) => (
            <Link 
              key={cover.id}
              to={`/categories/${cover.id}`}
              className="bg-white rounded-[2rem] p-6 shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col group"
            >
              <div className="aspect-[4/5] rounded-3xl bg-gray-50 overflow-hidden mb-8 relative">
                <img 
                  src={cover.image} 
                  alt={cover.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 h-12 w-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-black shadow-lg">
                  {cover.icon}
                </div>
              </div>
              
              <h2 className="text-2xl font-display font-bold mb-3 group-hover:text-black">{cover.name}</h2>
              <p className="text-gray-500 mb-6 flex-1">{cover.description}</p>
              
              <div className="space-y-2 mb-8">
                {cover.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <div className="h-1.5 w-1.5 rounded-full bg-black" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <span className="font-semibold">Explore Collection</span>
                <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-gray-800 transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
