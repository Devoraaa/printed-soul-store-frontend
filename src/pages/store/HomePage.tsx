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
  RefreshCw,
  Lock,
  ThumbsUp
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
      
      {/* 1. Micro Feature Ticker Top Bar */}
      <div className="bg-zinc-950 text-white text-[11px] font-bold py-2.5 px-4 tracking-wider uppercase flex items-center justify-center gap-6 border-b border-zinc-800/80">
        <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-amber-400" /> 100% Ultra-Clarity Optical Glass Finish</span>
        <span className="hidden md:flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 10ft Impact Drop Certified</span>
        <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-violet-400" /> Free Air Express Shipping &gt; ₹499</span>
      </div>

      {/* 2. Pure E-Commerce Visual Hero Slider Section */}
      <section className="relative h-[75vh] min-h-[520px] max-h-[700px] w-full bg-zinc-950 overflow-hidden flex items-center justify-center border-b border-zinc-800">
        {heroBanners.length > 0 ? (
          heroBanners.map((banner: any, idx: number) => (
            <motion.div
              key={banner._id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: idx === currentHero ? 1 : 0, scale: idx === currentHero ? 1 : 1.02 }}
              transition={{ duration: 0.8 }}
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
            <img src="/hero.png" alt="Printed Soul Premium Cases" className="w-full h-full object-cover object-center" />
          </div>
        )}

        {/* Dark Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 pointer-events-none z-10" />

        {/* Hero Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full text-center md:text-left flex flex-col items-center md:items-start pb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-400 text-[11px] font-extrabold tracking-widest uppercase mb-4 border border-white/20 shadow-lg">
            <Sparkles className="h-3.5 w-3.5" /> 2026 PREMIUM COLLECTION
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-none max-w-3xl drop-shadow-lg">
            Aesthetic Meets Ultimate Armor.
          </h1>
          <p className="text-gray-300 text-base sm:text-xl font-medium mt-4 max-w-xl tracking-tight leading-relaxed">
            High-definition 3D prints, 10ft drop protection, and zero-fade glass finish for 1000+ device models.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
            <Link 
              to="/products" 
              className="px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-sm hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-2"
            >
              <span>Explore All Cases</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/products?sort=new" 
              className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md text-white font-bold text-sm hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2"
            >
              <span>New Arrivals</span>
            </Link>
          </div>
        </div>

        {/* Dots Slider Indicator */}
        {heroBanners.length > 1 && (
          <div className="absolute bottom-6 right-8 flex items-center gap-2 z-20 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            {heroBanners.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentHero(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${idx === currentHero ? "bg-white w-7" : "bg-white/30 hover:bg-white/60 w-2"}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Instant Device Model Selector Widget */}
      <QuickDeviceFinder />

      {/* 4. Trust & Value Proposition Strip */}
      <section className="py-14 bg-white border-b border-gray-200/70 mt-8">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "Zero-Fade 3D Print", desc: "Lifetime color & scratch guard", color: "text-violet-600 bg-violet-50" },
              { icon: Zap, title: "Express 48H Dispatch", desc: "Direct Air Shipping via Shiprocket", color: "text-amber-600 bg-amber-50" },
              { icon: Layers, title: "Precision Camera Guard", desc: "Raised bezels for 360° lens safety", color: "text-emerald-600 bg-emerald-50" },
              { icon: Award, title: "1000+ Device Models", desc: "Engineered for Apple, Samsung & more", color: "text-blue-600 bg-blue-50" },
            ].map((perk, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className={`p-3 rounded-2xl ${perk.color} shrink-0`}>
                  <perk.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-gray-900">{perk.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Categories Banners (Editorial Grid) */}
      <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              POPULAR CATEGORIES
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900 mt-2">
              Explore By Material
            </h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 font-bold text-sm text-gray-900 hover:text-violet-600 transition-colors">
            View All Collections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Glass Case Promo */}
          <Link to="/categories/glass-case" className="group relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto h-[320px] md:h-[420px] border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500">
            <img 
              src={promoBanners[0] ? getImageUrl(promoBanners[0].imageUrl) : "/glass.png"} 
              alt="Ultra Gloss Glass Cases" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full tracking-widest uppercase mb-2 inline-block border border-white/30">
                ULTRA GLOSS
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-1">Optical Glass Cases</h3>
              <p className="text-white/90 text-xs font-semibold flex items-center gap-1.5 mt-2">Shop Collection <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></p>
            </div>
          </Link>

          {/* Dual Protection Case Promo */}
          <Link to="/categories/dual-protection-case" className="group relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto h-[320px] md:h-[420px] border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500">
            <img 
              src={promoBanners[2] ? getImageUrl(promoBanners[2].imageUrl) : "/small.png"} 
              alt="Dual Protection Armor" 
              className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full tracking-widest uppercase mb-2 inline-block shadow-md">
                10FT DROP ARMOR
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-1">Dual Protection</h3>
              <p className="text-white/90 text-xs font-semibold flex items-center gap-1.5 mt-2">Explore Tough Cases <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></p>
            </div>
          </Link>

          {/* Metal Texture Case Promo */}
          <Link to="/categories/metal-case" className="group relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto h-[320px] md:h-[420px] border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500">
            <img 
              src={promoBanners[1] ? getImageUrl(promoBanners[1].imageUrl) : "/metal.png"} 
              alt="Premium Metal Cases" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="bg-amber-400 text-black text-[10px] font-extrabold px-3 py-1 rounded-full tracking-widest uppercase mb-2 inline-block">
                LUXURY TEXTURE
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-1">Metal Finish Covers</h3>
              <p className="text-white/90 text-xs font-semibold flex items-center gap-1.5 mt-2">Shop Metallic <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></p>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. Bestseller Showcase with Category Filter Tabs */}
      <section className="py-16 bg-white border-t border-gray-200/80">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                TOP RATED DROPS
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900 mt-2">
                Best Sellers
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: "all", label: "All Cases" },
                { id: "glass", label: "Glass Covers" },
                { id: "dual", label: "Dual Armor" },
                { id: "metal", label: "Metal Finish" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategoryTab === tab.id
                      ? "bg-black text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
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
                <div key={i} className="aspect-[4/5] rounded-3xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
              <p className="text-gray-500 font-semibold">No products found in this category.</p>
              <Link to="/products" className="inline-block mt-4 text-xs font-bold text-black underline">View All Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
              {filteredProducts.slice(0, 8).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-14">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all text-xs font-extrabold tracking-wider uppercase border border-gray-200 shadow-sm"
            >
              <span>Browse Complete Store</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Supported Device Brands Bar */}
      {brands.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-b border-gray-200/80">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl md:text-2xl font-display font-black tracking-tight text-gray-900 mb-2">
              Supported Device Brands
            </h3>
            <p className="text-xs text-gray-500 mb-8 max-w-md mx-auto">
              Precision engineered cutouts and button tactile feedback for over 1,000 smartphone models.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              {brands.map((brand: any) => (
                <Link 
                  key={brand._id} 
                  to={`/products?brand=${brand._id}`}
                  className="px-6 py-3 rounded-2xl bg-white border border-gray-200/80 hover:border-black hover:bg-black hover:text-white transition-all font-extrabold text-xs tracking-wider uppercase shadow-sm flex items-center gap-2"
                >
                  <span>{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Social Proof & Customer Reviews */}
      <section className="py-20 bg-white border-b border-gray-200/80">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900">
              Loved by 15,000+ Customers
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Rated 4.9/5 stars based on verified buyers across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Aarav Sharma",
                device: "iPhone 15 Pro",
                review: "The glass finish is insane! It feels like part of the original phone glass and hasn't scratched even after dropping it twice.",
                rating: 5,
                verified: true
              },
              {
                name: "Rhea Kapoor",
                device: "Samsung S24 Ultra",
                review: "Super fast shipping! Received in 2 days in Bangalore. The print clarity is super sharp and camera protection is solid.",
                rating: 5,
                verified: true
              },
              {
                name: "Karan Patel",
                device: "OnePlus 12",
                review: "Dual protection armor case saved my phone! Build quality feels like a ₹2000 case for half the price.",
                rating: 5,
                verified: true
              }
            ].map((rev, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed italic">
                    "{rev.review}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-gray-900">{rev.name}</h4>
                    <p className="text-[11px] text-gray-400">{rev.device}</p>
                  </div>
                  {rev.verified && (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final High-Converting Call to Action Banner */}
      <section className="relative py-24 bg-black text-white text-center overflow-hidden border-t border-zinc-800">
        <div className="relative z-10 container mx-auto px-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 inline-block mb-4">
            MAKE YOUR STATEMENT
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight">
            Unleash Your Phone's Soul.
          </h2>
          <p className="text-gray-400 mt-4 text-base sm:text-lg font-medium tracking-tight max-w-xl mx-auto">
            High-definition 3D prints, impact protection, and optical glass clarity for your daily carry.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/products" 
              className="px-9 py-4 rounded-2xl bg-white text-black font-extrabold text-sm hover:scale-105 transition-transform duration-300 shadow-2xl"
            >
              Explore All Designs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
