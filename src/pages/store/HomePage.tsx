import React from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { ArrowRight, Zap, ShieldCheck, Truck, Sparkles, CheckCircle2, Star, Award, Layers } from "lucide-react"
import { productApi, catalogApi, bannerApi } from "../../lib/api"
import { getImageUrl } from "../../lib/utils"
import { ProductCard } from "../../components/ui/ProductCard"
import { CategorySection } from "../../components/ui/CategorySection"

export function HomePage() {
  const { data: featuredData } = useQuery({ queryKey: ["featured-products"], queryFn: () => productApi.getFeatured() })
  const { data: categoriesData } = useQuery({ queryKey: ["categories"], queryFn: () => catalogApi.getCategories() })
  const { data: brandsData } = useQuery({ queryKey: ["brands"], queryFn: () => catalogApi.getBrands() })
  const { data: bannersData } = useQuery({ queryKey: ["banners"], queryFn: () => bannerApi.getAll() })

  const featured = featuredData?.data?.data || []
  const categories = categoriesData?.data?.data || []
  const brands = brandsData?.data?.data || []
  
  const allBanners = bannersData?.data?.data || []
  const heroBanners = allBanners.filter((b: any) => b.type === "hero")
  const promoBanners = allBanners.filter((b: any) => b.type === "promo")

  const [currentHero, setCurrentHero] = React.useState(0)

  React.useEffect(() => {
    if (heroBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroBanners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroBanners.length])

  return (
    <div className="bg-[#FAFAFA] text-[#111111] antialiased">
      {/* Micro Feature Ticker Top Bar */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white text-[11px] font-bold py-2.5 px-4 tracking-wider uppercase flex items-center justify-center gap-6 overflow-hidden border-b border-zinc-800">
        <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-amber-400" /> 100% Ultra-Clarity Optical Glass Finish</span>
        <span className="hidden md:flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 10ft Impact Drop Certified</span>
        <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-violet-400" /> Free Express Air Delivery Above ₹499</span>
      </div>

      {/* Visual Hero Banner Slider */}
      <section className="relative h-[82vh] min-h-[580px] w-full bg-zinc-950 overflow-hidden flex items-end justify-center md:justify-start pb-20 md:pb-28 px-4 md:px-16 border-b border-zinc-800/80">
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
            <img src="/hero.png" alt="Premium Phone Case" className="w-full h-full object-cover object-center" />
          </div>
        )}

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

        {/* Dots Indicator with Progress Bar */}
        {heroBanners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            {heroBanners.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentHero(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${idx === currentHero ? "bg-white w-8" : "bg-white/30 hover:bg-white/60 w-2"}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Luxury Perks Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "Zero-Fade 3D Prints", desc: "Lifetime vibrant color & scratch guard", color: "text-violet-600 bg-violet-50" },
              { icon: Zap, title: "Express 48H Dispatch", desc: "Shipped directly via Shiprocket Air", color: "text-amber-600 bg-amber-50" },
              { icon: Layers, title: "Precision Camera Guard", desc: "Raised bezels for 360° lens safety", color: "text-emerald-600 bg-emerald-50" },
              { icon: Award, title: "1000+ Device Models", desc: "Custom engineered for Apple, Samsung, etc.", color: "text-blue-600 bg-blue-50" },
            ].map((perk, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-200/60 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className={`p-3 rounded-xl ${perk.color} shrink-0`}>
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

      {/* Bento Box Promo / Ads Grid */}
      <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              EDITORIAL DROPS '26
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-gray-900 mt-2">
              Curated Collections
            </h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 font-bold text-sm text-gray-900 hover:text-violet-600 transition-colors">
            View All Series <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[620px]">
          {/* Large Promo 1 */}
          <Link to={promoBanners[0]?.link || "/categories/glass-case"} className="group relative rounded-[2.5rem] overflow-hidden md:col-span-2 aspect-square md:aspect-auto border border-gray-200 shadow-md">
            <img 
              src={promoBanners[0] ? getImageUrl(promoBanners[0].imageUrl) : "/glass.png"} 
              alt={promoBanners[0]?.title || "Lifestyle promo"} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors duration-500" />
            <div className="absolute bottom-10 left-10 right-10">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full tracking-widest uppercase mb-3 inline-block border border-white/30">
                ULTRA GLOSS GLASS
              </span>
              <h3 className="text-3xl md:text-5xl font-display font-black text-white mb-2 drop-shadow-md">{promoBanners[0]?.title || "Elevate Your Everyday"}</h3>
              <p className="text-white/90 text-sm font-semibold flex items-center gap-2">Explore Series <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" /></p>
            </div>
          </Link>

          <div className="grid grid-cols-1 gap-6 h-[620px] md:h-auto">
            {/* Promo 2 */}
            <Link to={promoBanners[1]?.link || "/categories/metal-case"} className="group relative rounded-[2.5rem] overflow-hidden h-full border border-gray-200 shadow-md">
              <img 
                src={promoBanners[1] ? getImageUrl(promoBanners[1].imageUrl) : "/metal.png"} 
                alt={promoBanners[1]?.title || "Abstract promo"} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-display font-bold text-white drop-shadow-md mb-1">{promoBanners[1]?.title || "Premium Textures"}</h3>
                <p className="text-white/90 text-xs font-semibold flex items-center gap-1">Shop Collection <ArrowRight className="h-3.5 w-3.5" /></p>
              </div>
            </Link>

            {/* Promo 3 */}
            <Link to={promoBanners[2]?.link || "/categories/dual-protection-case"} className="group relative rounded-[2.5rem] overflow-hidden h-full bg-zinc-950 border border-gray-200 shadow-md">
              <img 
                src={promoBanners[2] ? getImageUrl(promoBanners[2].imageUrl) : "/small.png"} 
                alt={promoBanners[2]?.title || "Abstract art promo"} 
                className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-6 left-6">
                <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full tracking-widest uppercase shadow-md">MAX ARMOR</span>
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-display font-bold text-white drop-shadow-md mb-1">{promoBanners[2]?.title || "Dual Protection"}</h3>
                <p className="text-white/90 text-xs font-semibold flex items-center gap-1">Shop Now <ArrowRight className="h-3.5 w-3.5" /></p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      {featured.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  TOP RATED DROP
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900 mt-2">
                  Best Sellers
                </h2>
              </div>
              <Link to="/products" className="flex items-center gap-2 font-bold text-sm text-gray-900 hover:text-violet-600 transition-colors">
                View All Products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.slice(0, 8).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Sections by Category */}
      {categories.length > 0 && (
        <>
          <CategorySection 
            categoryId={categories.find((c: any) => c.slug === "dual-protection-case")?._id}
            title="Max Protection. Zero Compromise."
            slug="dual-protection-case"
            subtitle="Explore our heavy-duty dual protection covers."
          />
          <CategorySection 
            categoryId={categories.find((c: any) => c.slug === "glass-case")?._id}
            title="Sleek Glass Covers"
            slug="glass-case"
            subtitle="Premium glossy finish for the ultimate aesthetic."
          />
          <CategorySection 
            categoryId={categories.find((c: any) => c.slug === "metal-case")?._id}
            title="Premium Metal Textures"
            slug="metal-case"
            subtitle="Industrial strength meets modern design."
          />
        </>
      )}

      {/* Visual Collections Grid */}
      {categories.length > 0 && (
        <section className="py-24 bg-zinc-950 text-white border-t border-zinc-800">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20">
                BROWSE BY STYLE
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mt-4">
                Explore All Series
              </h2>
              <p className="text-zinc-400 text-sm mt-3">From optical glass cases to desk deskpads and ceramic mugs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((cat: any) => {
                const slug = cat.slug?.toLowerCase() || "";
                let fallbackImage = null;
                if (slug.includes("coaster")) fallbackImage = "/costers.png";
                else if (slug.includes("glass")) fallbackImage = "/glass.png";
                else if (slug.includes("dual")) fallbackImage = "/small.png";
                else if (slug.includes("metal")) fallbackImage = "/metal.png";
                else if (slug.includes("mug")) fallbackImage = "/mug.png";
                
                const imgSrc = cat.image ? getImageUrl(cat.image) : fallbackImage;
                
                return (
                  <Link key={cat._id} to={`/categories/${cat.slug}`}
                    className="group relative overflow-hidden rounded-[2.5rem] aspect-[4/5] bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 shadow-2xl">
                    {imgSrc ? (
                      <img src={imgSrc} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-8 left-8 right-8">
                      <h3 className="font-display font-black text-white text-3xl drop-shadow-md mb-2">{cat.name}</h3>
                      <span className="text-white/80 font-bold text-xs flex items-center gap-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        Explore Collection <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Brands Bar */}
      {brands.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight mb-8 text-gray-900">Supported Devices & Brands</h2>
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              {brands.map((brand: any) => (
                <Link key={brand._id} to={`/products?brand=${brand._id}`}
                  className="px-6 py-3 rounded-full bg-gray-50 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all font-bold text-xs tracking-wider uppercase shadow-sm">
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customer Trust Rating Banner */}
      <section className="py-16 bg-gray-50 border-t border-gray-200/60 text-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h3 className="text-2xl font-display font-extrabold text-gray-900">Loved by 15,000+ Case Enthusiasts</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Rated 4.9/5 stars based on over 2,400 verified reviews across India.
          </p>
        </div>
      </section>

      {/* Bottom Hero CTA */}
      <section className="relative py-28 bg-black text-white text-center overflow-hidden border-t border-zinc-800">
        <div className="relative z-10 container mx-auto px-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-4 py-1.5 rounded-full border border-violet-500/20">
            MAKE YOUR STATEMENT
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-black mb-4 tracking-tight mt-4">
            Unleash Your Soul.
          </h2>
          <p className="text-gray-400 mb-10 text-lg md:text-xl font-medium tracking-tight max-w-xl mx-auto">
            High-definition 3D prints, impact protection, and optical glass clarity for your daily carry.
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-black font-extrabold hover:scale-105 transition-transform duration-300 text-base shadow-[0_0_50px_rgba(255,255,255,0.25)]">
            Explore All Designs <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
