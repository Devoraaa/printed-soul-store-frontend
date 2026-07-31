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
    <div className="bg-[#FAFAFA] text-[#111111] antialiased selection:bg-black selection:text-white">
      
      {/* 1. Ultra-Clean Hero Slider (CLEAN PHOTO, ZERO text clutter overlay!) */}
      <section className="relative h-[78vh] min-h-[540px] max-h-[750px] w-full bg-white overflow-hidden border-b border-gray-200/80">
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

        {/* Minimal Floating Brand Badge */}
        <div className="absolute top-6 left-6 md:left-12 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-2xl text-black text-xs font-black tracking-widest uppercase border border-gray-200/80 shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> PRINTED SOUL COLLECTION
          </span>
        </div>

        {/* Slide Indicators */}
        {heroBanners.length > 1 && (
          <div className="absolute bottom-10 right-6 md:right-12 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-2xl px-4 py-2 rounded-full border border-gray-200/80 shadow-lg">
            {heroBanners.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentHero(idx)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === currentHero ? "bg-black w-8" : "bg-gray-300 hover:bg-gray-500 w-2"}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Instant Apple-Style Device Selector Configurator */}
      <QuickDeviceFinder />

      {/* 3. High-Impact Marquee Ticker Bar */}
      <div className="py-5 bg-white border-b border-gray-200/80 overflow-hidden mt-6 shadow-sm">
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee text-xs font-black tracking-widest uppercase text-gray-700">
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" /> 100% OPTICAL GLASS FINISH</span>
          <span>•</span>
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> 10FT DROP IMPACT CERTIFIED</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Cpu className="h-4 w-4 text-violet-600" /> CUSTOM ENGINEERED FOR 1000+ MODELS</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-blue-600" /> FREE AIR EXPRESS SHIPPING &gt; ₹499</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Flame className="h-4 w-4 text-rose-500" /> ZERO-FADE 3D SUBLIMATION PRINT</span>
          <span>•</span>
        </div>
      </div>

      {/* 4. CLEAN WHITE BENTO GRID — "PURE E-COMMERCE LUXURY" */}
      <section className="py-20 px-4 md:px-8 max-w-[1650px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-600 animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-3.5 py-1 rounded-full border border-violet-100">
                EDITORIAL DROPS 2026
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-gray-900 mt-1">
              Curated Collections
            </h2>
          </div>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-sm font-extrabold text-gray-900 hover:text-violet-600 transition-colors uppercase tracking-wider group"
          >
            <span>Explore All Series</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid (Clean White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px] md:auto-rows-[340px]">
          
          {/* Tile 1: LARGE HERO BENTO (Spans 2 cols, 2 rows) — Glass Case */}
          <Link 
            to={promoBanners[0]?.link || "/categories/glass-case"} 
            className="group relative rounded-[2.5rem] overflow-hidden md:col-span-2 md:row-span-2 bg-white border border-gray-200/80 hover:border-gray-400 transition-all duration-700 shadow-md hover:shadow-2xl flex flex-col justify-end p-8 md:p-12"
          >
            <img 
              src={promoBanners[0] ? getImageUrl(promoBanners[0].imageUrl) : "/glass.png"} 
              alt="Ultra Gloss Glass Case" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity" />
            
            {/* Ambient Corner Glow */}
            <div className="absolute top-6 right-6 z-20">
              <span className="bg-white/90 backdrop-blur-2xl text-black text-[11px] font-black px-4 py-2 rounded-full tracking-widest uppercase border border-white shadow-xl flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> OPTICAL GLASS
              </span>
            </div>

            <div className="relative z-20">
              <span className="text-amber-400 font-mono text-xs font-bold tracking-widest uppercase block mb-2">
                SERIES 01 // ULTRA CLARITY
              </span>
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white leading-tight mb-3 drop-shadow-md">
                {promoBanners[0]?.title || "9H Tempered Glass Cases"}
              </h3>
              <p className="text-gray-200 text-sm md:text-base max-w-lg font-medium leading-relaxed mb-6">
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
            className="group relative rounded-[2.5rem] overflow-hidden md:col-span-2 bg-white border border-gray-200/80 hover:border-gray-400 transition-all duration-700 shadow-md hover:shadow-2xl flex flex-col justify-end p-8"
          >
            <img 
              src={promoBanners[2] ? getImageUrl(promoBanners[2].imageUrl) : "/small.png"} 
              alt="Dual Protection Armor" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute top-6 left-6 z-20">
              <span className="bg-emerald-500 text-white text-[10px] font-black px-3.5 py-1.5 rounded-full tracking-widest uppercase shadow-md flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> 10FT IMPACT ARMOR
              </span>
            </div>

            <div className="relative z-20 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-1">
                  Dual Protection Series
                </h3>
                <p className="text-gray-300 text-xs font-semibold">Shock-absorbing inner TPU + Polycarbonate shell.</p>
              </div>

              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:bg-amber-400 transition-all shadow-lg">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </Link>

          {/* Tile 3: TALL METALLIC BENTO (1 col, 1 row) — Metal Finish */}
          <Link 
            to={promoBanners[1]?.link || "/categories/metal-case"} 
            className="group relative rounded-[2.5rem] overflow-hidden bg-white border border-gray-200/80 hover:border-gray-400 transition-all duration-700 shadow-md hover:shadow-2xl flex flex-col justify-end p-8"
          >
            <img 
              src={promoBanners[1] ? getImageUrl(promoBanners[1].imageUrl) : "/metal.png"} 
              alt="Metallic Finish" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="relative z-20">
              <span className="text-gray-300 text-[10px] font-extrabold tracking-widest uppercase block mb-1">
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

          {/* Tile 4: LIVE STATS BENTO (1 col, 1 row) — Clean White Metric Card */}
          <div className="relative rounded-[2.5rem] bg-white border border-gray-200/80 p-8 flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                ENGINEERED FIT
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-3xl font-display font-black text-gray-900 tracking-tight">1,000+</span>
                <p className="text-xs text-gray-500 font-medium">Supported Phone Models</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xl font-display font-bold text-amber-500">4.9 ★</span>
                  <p className="text-[10px] text-gray-400">15K+ Verified Buyers</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60">
                  <Award className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. BESTSELLERS SHOWCASE (Clean White Theme) */}
      <section className="py-20 bg-white border-t border-gray-200/80">
        <div className="max-w-[1650px] mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  TOP RATED DROPS
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gray-900 mt-1">
                Best Sellers
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
                      ? "bg-black text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black border border-gray-200/60"
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
                <div key={i} className="aspect-[4/5] rounded-3xl bg-gray-100 animate-pulse border border-gray-200" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
              <p className="text-gray-500 font-semibold">No products found in this filter.</p>
              <Link to="/products" className="inline-block mt-4 text-xs font-bold text-black underline">Browse Store</Link>
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
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-xl"
            >
              <span>Explore Complete Store</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CRAFTSMANSHIP & MATERIAL BREAKDOWN (Light Mode) */}
      <section className="py-24 bg-[#FAFAFA] border-t border-gray-200/80">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100">
              THE PRINTED SOUL STANDARD
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gray-900 mt-4">
              Engineered For Greatness.
            </h2>
            <p className="text-gray-500 text-sm mt-3">Why 15,000+ customers trust Printed Soul for their daily carry.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "9H Tempered Optical Glass",
                desc: "Dual-layer optical glass top coat provides high-definition clarity, smooth touch, and zero yellowing over time.",
                color: "text-amber-600 bg-amber-50 border-amber-200/60"
              },
              {
                icon: Shield,
                title: "360° Camera & Screen Lip",
                desc: "Raised 1.5mm bezels prevent direct contact with surfaces, keeping your camera lenses safe during accidental drops.",
                color: "text-emerald-600 bg-emerald-50 border-emerald-200/60"
              },
              {
                icon: Flame,
                title: "Permanent Sublimation Ink",
                desc: "High-density heat transfer embeds colors deep into the substrate, guaranteeing scratch-proof and fade-proof art.",
                color: "text-rose-600 bg-rose-50 border-rose-200/60"
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-[2.5rem] bg-white border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-500 space-y-4">
                <div className={`w-14 h-14 rounded-2xl ${item.color} border flex items-center justify-center`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-display font-black text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SUPPORTED BRANDS BAR */}
      {brands.length > 0 && (
        <section className="py-16 bg-white border-t border-b border-gray-200/80">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-display font-black tracking-tight text-gray-900 mb-2">
              Compatible Smartphone Brands
            </h3>
            <p className="text-xs text-gray-500 mb-8 max-w-md mx-auto">
              Precision cutouts and tactile buttons for all major flagship and budget models.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              {brands.map((brand: any) => (
                <Link 
                  key={brand._id} 
                  to={`/products?brand=${brand._id}`}
                  className="px-6 py-3 rounded-2xl bg-gray-50 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all font-black text-xs tracking-wider uppercase shadow-sm flex items-center gap-2"
                >
                  <span>{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. VERIFIED SOCIAL PROOF REVIEWS */}
      <section className="py-20 bg-gray-50 border-b border-gray-200/80">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900">
              Loved By 15,000+ Customers
            </h2>
            <p className="text-xs text-gray-500 mt-2">
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
              <div key={idx} className="p-6 rounded-[2rem] bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-xs font-medium leading-relaxed italic">
                    "{rev.review}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-gray-900">{rev.name}</h4>
                    <p className="text-[11px] text-gray-400">{rev.device}</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL BRAND CALL TO ACTION */}
      <section className="relative py-28 bg-black text-white text-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 inline-block mb-4">
            MAKE YOUR STATEMENT
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight">
            Unleash Your Phone's Soul.
          </h2>
          <p className="text-gray-400 mt-4 text-base md:text-xl font-medium max-w-xl mx-auto">
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
