import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Shield, Layers, Smartphone } from "lucide-react"
import { SEO } from "../../components/ui/SEO"

export function PhoneCoversHubPage() {
  const coverTypes = [
    {
      id: "dual-case",
      name: "Dual Protection Covers",
      description: "Ultimate drop protection with a tough outer shell and shock-absorbing inner core. Built for extreme lifestyle.",
      image: "/small.webp",
      badge: "10FT IMPACT ARMOR",
      link: "/products?category=covers&subCategory=dual-case",
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      features: ["10ft Drop Protection", "Shock Absorbing TPU", "360° Raised Bezels"]
    },
    {
      id: "glass-case",
      name: "Premium Glass Covers",
      description: "Stunning 9H tempered glass back that makes 3D designs pop with optical clarity and scratch protection.",
      image: "/glass.webp",
      badge: "9H OPTICAL GLASS",
      link: "/products?category=covers&subCategory=glass-case",
      icon: <Layers className="h-6 w-6 text-amber-600" />,
      features: ["9H Tempered Glass", "Vibrant 3D Prints", "Zero Yellowing"]
    },
    {
      id: "metal-case",
      name: "Metal Armor Covers",
      description: "Brushed metal texture aesthetic fused with polycarbonate back. The ultimate statement of durability.",
      image: "/metal.webp",
      badge: "BRUSHED FINISH",
      link: "/products?category=covers&subCategory=metal-case",
      icon: <Smartphone className="h-6 w-6 text-violet-600" />,
      features: ["Metallic Finish", "Ultra Ergonomic", "Lightweight Armor"]
    }
  ]

  const hubStructuredData = [
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which phone case offers the best drop protection?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Dual Protection Cases provide the highest impact resistance with a dual-layer shock absorbing TPU core, reinforced corners, and 10FT drop test certification."
          }
        },
        {
          "@type": "Question",
          "name": "Are toughened glass phone covers scratch-resistant?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our 9H tempered glass back covers are scratch-resistant, anti-yellowing, and offer optical clarity with ultra-vibrant 3D printing."
          }
        },
        {
          "@type": "Question",
          "name": "Do Printed Soul cases support wireless charging?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all Printed Soul Dual Protection, Glass, and Metal Armor phone cases are wireless charging compatible and designed with precise heat dissipation cutouts."
          }
        }
      ]
    }
  ]

  return (
    <div className="bg-[#F4EFEA] min-h-screen text-neutral-900 antialiased selection:bg-black selection:text-white pb-24">
      <SEO
        title="Phone Case Materials Guide | Dual vs Glass vs Metal Armor"
        description="Compare phone case materials at Printed Soul India. Choose from 10FT drop Dual Protection, 9H scratch-proof Toughened Glass, and lightweight brushed Metal Armor covers."
        keywords={[
          "phone case materials guide",
          "dual protection vs glass case",
          "toughened glass mobile cover",
          "metal armor phone case",
          "shockproof phone covers india",
          "Printed Soul"
        ]}
        canonicalUrl="https://printedsoul.in/phone-covers"
        structuredData={hubStructuredData}
      />
      
      {/* Header Section */}
      <div className="bg-white/80 border-b border-black/[0.05] backdrop-blur-md pt-12 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase mb-3 text-neutral-500">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <span>Category</span>
            <span>/</span>
            <span className="text-neutral-900 font-bold">Phone Covers</span>
          </div>
          <span className="block text-[10px] font-bold tracking-[0.2em] text-neutral-600 uppercase bg-neutral-100 px-4 py-1.5 rounded-full border border-black/[0.05] max-w-fit mx-auto mb-3">
            Materials & Protection
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-3 text-neutral-900">
            Phone Cover Series
          </h1>
          <p className="text-sm md:text-base text-neutral-500 font-medium max-w-xl mx-auto">
            Choose your level of protection and style. Precision engineered for over 1000+ device models.
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-[1650px] mx-auto px-4 md:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coverTypes.map((cover) => (
            <Link 
              key={cover.id}
              to={cover.link || `/products?category=covers&subCategory=${cover.id}`}
              className="bg-white rounded-3xl p-6 md:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-black/[0.05] flex flex-col group"
            >
              <div className="aspect-[4/5] rounded-2xl bg-neutral-50 overflow-hidden mb-6 relative">
                <img 
                  src={cover.image} 
                  alt={cover.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3.5 left-3.5 h-10 w-10 bg-white/95 backdrop-blur-md border border-black/[0.06] rounded-xl flex items-center justify-center shadow-xs">
                  {cover.icon}
                </div>
                <div className="absolute top-3.5 right-3.5">
                  <span className="text-[9px] font-bold tracking-wider text-neutral-900 bg-white/95 backdrop-blur-md border border-black/[0.06] px-2.5 py-1 rounded-full uppercase shadow-xs">
                    {cover.badge}
                  </span>
                </div>
              </div>
              
              <h2 className="text-xl font-display font-bold text-neutral-900 mb-1.5">{cover.name}</h2>
              <p className="text-neutral-500 text-xs font-medium leading-relaxed mb-5 flex-1">{cover.description}</p>
              
              <div className="space-y-2 mb-6">
                {cover.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                    <div className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-5 border-t border-black/[0.05]">
                <span className="font-bold text-xs uppercase tracking-wider text-neutral-900 group-hover:text-black transition-colors">
                  Explore Series
                </span>
                <div className="h-9 w-9 rounded-full bg-neutral-900 text-white group-hover:bg-black transition-colors flex items-center justify-center shadow-sm">
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
