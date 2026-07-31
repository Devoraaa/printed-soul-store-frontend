import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Award, 
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu,
  Flame,
  ArrowUpRight,
  Shield,
  Smartphone,
  Check
} from "lucide-react"
import { productApi, catalogApi, bannerApi } from "../../lib/api"
import { getImageUrl } from "../../lib/utils"
import { ProductCard } from "../../components/ui/ProductCard"
import { QuickDeviceFinder } from "../../components/ui/QuickDeviceFinder"

export function HomePage() {
  const { data: featuredData, isLoading: isFeaturedLoading } = useQuery({ 
    queryKey: ["featured-products"], 
    queryFn: () => productApi.getFeatured() 
  })
  const { data: categoriesData } = useQuery({ 
    queryKey: ["categories"], 
    queryFn: () => catalogApi.getCategories() 
  })
  const { data: brandsData } = useQuery({ 
    queryKey: ["brands"], 
    queryFn: () => catalogApi.getBrands() 
  })
  const { data: bannersData } = useQuery({ 
    queryKey: ["banners"], 
    queryFn: () => bannerApi.getAll() 
  })

  const featured = featuredData?.data?.data || []
  const categories = categoriesData?.data?.data || []
  const brands = brandsData?.data?.data || []
  
  const allBanners = bannersData?.data?.data || []
  const heroBanners = allBanners.filter((b: any) => b.type === "hero")
  const promoBanners = allBanners.filter((b: any) => b.type === "promo")

  const [currentHero, setCurrentHero] = useState(0)
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all")

  React.useEffect(() => {
    if (heroBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroBanners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroBanners.length])

  // Filter products by active tab
  const filteredProducts = React.useMemo(() => {
    if (activeCategoryTab === "all") return featured
    return featured.filter((p: any) => {
      const catSlug = p.category?.slug || ""
      return catSlug.includes(activeCategoryTab)
    })
  }, [featured, activeCategoryTab])

  return (
    <div className="bg-[#09090b] text-white antialiased selection:bg-white selection:text-black">
      
      {/* 1. Ultra-Clean Full-Bleed Hero Slider (NO text overlay clutter on the photo!) */}
      <section className="relative h-[78vh] min-h-[540px] max-h-[750px] w-full bg-zinc-950 overflow-hidden border-b border-zinc-800/80">
        {heroBanners.length > 0 ? (
          heroBanners.map((banner: any, idx: number) => (
            <motion.div
              key={banner._id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: idx === currentHero ? 1 : 0, scale: idx === currentHero ? 1 : 1.02 }}
              transition={{ duration: 0.9 }}
              className="absolute inset-0"
              style={{ pointerEvents: idx === currentHero ? "auto" : "none" }}
            >
              {banner.link ? (
                <Link to={banner.link} className="block w-full h-full">
                  <img src={getImageUrl(banner.imageUrl)} alt={banner.title} className="w-full h-full object-cover object-center" />
                </Link>
              ) : (
                <img src={getImageUrl(banner.imageUrl)} alt={banner.title} className="w-full h-full object-cover object-center" />
              )}
            </motion.div>
          ))
        ) : (
          <div className="absolute inset-0">
            <img src="/hero.png" alt="Printed Soul Clean Hero" className="w-full h-full object-cover object-center" />
          </div>
        )}

        {/* Subtle Dark Gradient fade at bottom for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/30 pointer-events-none z-10" />

        {/* Minimal Floating Brand Badge & Slide Counter */}
        <div className="absolute top-6 left-6 md:left-12 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-2xl text-white text-xs font-black tracking-widest uppercase border border-white/10 shadow-2xl">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> PRINTED SOUL DROP '26
          </span>
        </div>

        {heroBanners.length > 1 && (
          <div className="absolute bottom-10 right-6 md:right-12 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10">
            {heroBanners.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentHero(idx)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === currentHero ? "bg-white w-8" : "bg-white/30 hover:bg-white/60 w-2"}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Instant Apple-Style Device Selector Configurator */}
      <QuickDeviceFinder />

      {/* 3. High-Impact Marquee Ticker Bar (Nike/Apple Style) */}
      <div className="py-6 bg-zinc-950 border-b border-zinc-800/80 overflow-hidden mt-6">
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee text-xs font-black tracking-widest uppercase text-zinc-400">
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-400" /> 100% OPTICAL GLASS FINISH</span>
          <span>•</span>
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> MIL-STD 10FT IMPACT CERTIFIED</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Cpu className="h-4 w-4 text-violet-400" /> CUSTOM ENGINEERED FOR 1000+ MODELS</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-blue-400" /> FREE AIR EXPRESS SHIPPING &gt; ₹499</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Flame className="h-4 w-4 text-rose-400" /> ZERO-FADE 3D SUBLIMATION PRINT</span>
          <span>•</span>
        </div>
      </div>

      {/* 4. CRAZY BENTO GRID — "BROO THIS IS PREMIUMNESS" */}
      <section className="py-20 px-4 md:px-8 max-w-[1650px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
                EDITORIAL DROPS 2026
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white mt-1">
              Curated Masterpieces
            </h2>
          </div>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-sm font-extrabold text-white hover:text-amber-400 transition-colors uppercase tracking-wider group"
          >
            <span>Explore All Series</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Crazy Asymmetric Bento Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px] md:auto-rows-[340px]">
          
          {/* Tile 1: LARGE HERO BENTO (Spans 2 cols, 2 rows) — Glass Case */}
          <Link 
            to={promoBanners[0]?.link || "/categories/glass-case"} 
            className="group relative rounded-[2.5rem] overflow-hidden md:col-span-2 md:row-span-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-500 transition-all duration-700 shadow-2xl flex flex-col justify-end p-8 md:p-12"
          >
            <img 
              src={promoBanners[0] ? getImageUrl(promoBanners[0].imageUrl) : "/glass.png"} 
              alt="Ultra Gloss Glass Case" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
            
            {/* Ambient Corner Glow */}
            <div className="absolute top-6 right-6 z-20">
              <span className="bg-white/10 backdrop-blur-2xl text-white text-[11px] font-black px-4 py-2 rounded-full tracking-widest uppercase border border-white/20 shadow-xl flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> OPTICAL GLASS
              </span>
            </div>

            <div className="relative z-20">
              <span className="text-amber-400 font-mono text-xs font-bold tracking-widest uppercase block mb-2">
                SERIES 01 // ULTRA CLARITY
              </span>
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white leading-tight mb-3 drop-shadow-lg">
                {promoBanners[0]?.title || "9H Optical Tempered Glass"}
              </h3>
              <p className="text-zinc-300 text-sm md:text-base max-w-lg font-medium leading-relaxed mb-6">
                Engineered with dual-layer tempered glass for high-definition reflection and scratch resistance.
              </p>

              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider group-hover:bg-amber-400 transition-colors shadow-2xl">
                <span>Shop Glass Series</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Tile 2: WIDE ARMOR BENTO (Spans 2 cols, 1 row) — Dual Protection */}
          <Link 
            to={promoBanners[2]?.link || "/categories/dual-protection-case"} 
            className="group relative rounded-[2.5rem] overflow-hidden md:col-span-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-500 transition-all duration-700 shadow-xl flex flex-col justify-end p-8"
          >
            <img 
              src={promoBanners[2] ? getImageUrl(promoBanners[2].imageUrl) : "/small.png"} 
              alt="Dual Protection Armor" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            <div className="absolute top-6 left-6 z-20">
              <span className="bg-emerald-500/90 backdrop-blur-xl text-white text-[10px] font-black px-3.5 py-1.5 rounded-full tracking-widest uppercase shadow-lg flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> 10FT IMPACT ARMOR
              </span>
            </div>

            <div className="relative z-20 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-1">
                  Dual Protection Series
                </h3>
                <p className="text-zinc-400 text-xs font-semibold">Shock-absorbing inner TPU + Polycarbonate shell.</p>
              </div>

              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-black transition-all">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </Link>

          {/* Tile 3: TALL METALLIC BENTO (1 col, 1 row) — Metal Finish */}
          <Link 
            to={promoBanners[1]?.link || "/categories/metal-case"} 
            className="group relative rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-500 transition-all duration-700 shadow-xl flex flex-col justify-end p-8"
          >
            <img 
              src={promoBanners[1] ? getImageUrl(promoBanners[1].imageUrl) : "/metal.png"} 
              alt="Metallic Finish" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="relative z-20">
              <span className="text-zinc-400 text-[10px] font-extrabold tracking-widest uppercase block mb-1">
                BRUSHED FINISH
              </span>
              <h3 className="text-2xl font-display font-black text-white mb-1">
                Metallic Textures
              </h3>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1 mt-2">
                Explore Metal <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Tile 4: LIVE STATS BENTO (1 col, 1 row) — Dark Luxury Spec Badge */}
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 p-8 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                ENGINEERED PERFECTION
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-3xl font-display font-black text-white tracking-tight">1,000+</span>
                <p className="text-xs text-zinc-400 font-medium">Supported Phone Models</p>
              </div>
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xl font-display font-bold text-amber-400">4.9 ★</span>
                  <p className="text-[10px] text-zinc-400">15K+ Verified Buyers</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-zinc-800 text-white">
                  <Award className="h-5 w-5 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. BESTSELLERS SHOWCASE WITH LUXURY GLOW CARDS */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-[1650px] mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                  TRENDING DROPS
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mt-1">
                Top Rated Bestsellers
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: "all", label: "All Cases" },
                { id: "glass", label: "Glass Series" },
                { id: "dual", label: "Dual Armor" },
                { id: "metal", label: "Metal Textures" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider ${
                    activeCategoryTab === tab.id
                      ? "bg-white text-black shadow-xl"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {isFeaturedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
              <p className="text-zinc-400 font-semibold">No products found in this filter.</p>
              <Link to="/products" className="inline-block mt-4 text-xs font-bold text-white underline">Browse Store</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
              {filteredProducts.slice(0, 8).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors shadow-2xl"
            >
              <span>Explore Complete Store</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CRAFTSMANSHIP & MATERIAL BREAKDOWN */}
      <section className="py-24 bg-[#09090b] border-t border-zinc-800">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-violet-400 bg-violet-500/10 px-4 py-1.5 rounded-full border border-violet-500/20">
              THE PRINTED SOUL STANDARD
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mt-4">
              Engineered For Greatness.
            </h2>
            <p className="text-zinc-400 text-sm mt-3">Why 15,000+ customers trust Printed Soul for their daily carry.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "9H Tempered Optical Glass",
                desc: "Dual-layer optical glass top coat provides high-definition clarity, smooth touch, and zero yellowing over time.",
                color: "text-amber-400 bg-amber-400/10 border-amber-400/20"
              },
              {
                icon: Shield,
                title: "360° Camera & Screen Lip",
                desc: "Raised 1.5mm bezels prevent direct contact with surfaces, keeping your camera lenses safe during accidental drops.",
                color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
              },
              {
                icon: Flame,
                title: "Permanent Sublimation Ink",
                desc: "High-density heat transfer embeds colors deep into the substrate, guaranteeing scratch-proof and fade-proof art.",
                color: "text-rose-400 bg-rose-400/10 border-rose-400/20"
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-[2.5rem] bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all duration-500 space-y-4">
                <div className={`w-14 h-14 rounded-2xl ${item.color} border flex items-center justify-center`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-display font-black text-white">{item.title}</h3>
                <p className="text-zinc-400 text-xs font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SUPPORTED BRANDS BAR */}
      {brands.length > 0 && (
        <section className="py-16 bg-zinc-950 border-t border-b border-zinc-800">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-display font-black tracking-tight text-white mb-2">
              Compatible Smartphone Brands
            </h3>
            <p className="text-xs text-zinc-500 mb-8 max-w-md mx-auto">
              Precision cutouts and tactile buttons for all major flagship and budget models.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              {brands.map((brand: any) => (
                <Link 
                  key={brand._id} 
                  to={`/products?brand=${brand._id}`}
                  className="px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-white hover:bg-white hover:text-black transition-all font-black text-xs tracking-wider uppercase shadow-md flex items-center gap-2"
                >
                  <span>{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. VERIFIED SOCIAL PROOF REVIEWS */}
      <section className="py-20 bg-[#09090b]">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white">
              Loved By 15,000+ Case Enthusiasts
            </h2>
            <p className="text-xs text-zinc-500 mt-2">
              Rated 4.9/5 stars based on verified purchases across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Aarav Sharma",
                device: "iPhone 15 Pro",
                review: "The glass finish is insane! It feels like part of the original phone glass and hasn't scratched even after dropping it twice.",
                rating: 5,
              },
              {
                name: "Rhea Kapoor",
                device: "Samsung S24 Ultra",
                review: "Super fast shipping! Received in 2 days in Bangalore. The print clarity is super sharp and camera protection is solid.",
                rating: 5,
              },
              {
                name: "Karan Patel",
                device: "OnePlus 12",
                review: "Dual protection armor case saved my phone! Build quality feels like a ₹2000 case for half the price.",
                rating: 5,
              }
            ].map((rev, idx) => (
              <div key={idx} className="p-6 rounded-[2rem] bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-xs font-medium leading-relaxed italic">
                    "{rev.review}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">{rev.name}</h4>
                    <p className="text-[11px] text-zinc-500">{rev.device}</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL BRAND CALL TO ACTION */}
      <section className="relative py-28 bg-gradient-to-b from-zinc-950 to-black text-white text-center overflow-hidden border-t border-zinc-800">
        <div className="relative z-10 container mx-auto px-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 inline-block mb-4">
            MAKE YOUR STATEMENT
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight">
            Unleash Your Phone's Soul.
          </h2>
          <p className="text-zinc-400 mt-4 text-base md:text-xl font-medium max-w-xl mx-auto">
            High-definition 3D prints, impact protection, and optical glass clarity for your daily carry.
          </p>
          <div className="mt-8">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors shadow-2xl"
            >
              <span>Explore All Designs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
