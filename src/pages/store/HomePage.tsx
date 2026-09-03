import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  ArrowRight, ChevronRight, ChevronLeft
} from "lucide-react"
import { productApi, catalogApi, bannerApi, socialPostApi } from "../../lib/api"
import { getImageUrl } from "../../lib/utils"
import { ProductCard } from "../../components/ui/ProductCard"

export function HomePage() {
  const { data: featuredData } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productApi.getFeatured(),
  })

  const { data: allProductsData, isLoading: isAllLoading } = useQuery({
    queryKey: ["all-products-home"],
    queryFn: () => productApi.getAll({ limit: 500 }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.getCategories(),
  })

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => catalogApi.getBrands(),
  })

  const { data: bannersData } = useQuery({
    queryKey: ["banners"],
    queryFn: () => bannerApi.getAll(),
  })

  const { data: socialPostsData } = useQuery({
    queryKey: ["social-posts"],
    queryFn: () => socialPostApi.getActive(),
  })

  const featured = featuredData?.data?.data || []
  const allProducts = allProductsData?.data?.data || []
  const categories = (categoriesData?.data?.data || []).filter((c: any) => !c.parentCategory)
  const brands = brandsData?.data?.data || []
  const allBanners = bannersData?.data?.data || []
  const socialPosts = socialPostsData?.data?.data || []

  // Group products into comprehensive collections for homepage
  const coverProducts = allProducts.filter((p: any) => 
    (p.caseType && p.caseType !== "other") || 
    ["covers", "dual-case", "metal-case", "glass-case"].includes(p.category?.slug)
  )
  const frameProducts = allProducts.filter((p: any) => 
    p.category?.slug === "frames" || p.name?.toLowerCase().includes("frame")
  )
  const mugProducts = allProducts.filter((p: any) => 
    p.category?.slug === "mugs" || p.name?.toLowerCase().includes("mug") || p.name?.toLowerCase().includes("cup")
  )
  const tumblerProducts = allProducts.filter((p: any) => 
    p.category?.slug === "tumblers" || p.name?.toLowerCase().includes("tumbler") || p.name?.toLowerCase().includes("sipper")
  )
  const mousepadProducts = allProducts.filter((p: any) => 
    p.category?.slug === "mousepads" || p.name?.toLowerCase().includes("pad") || p.name?.toLowerCase().includes("mouse")
  )
  const toteBagProducts = allProducts.filter((p: any) => 
    p.category?.slug === "tote-bags" || p.name?.toLowerCase().includes("tote") || p.name?.toLowerCase().includes("bag")
  )
  const coasterProducts = allProducts.filter((p: any) => 
    p.category?.slug === "coasters" || p.name?.toLowerCase().includes("coaster")
  )

  const showcaseSections = [
    {
      id: "covers",
      tag: "Dual, Glass & Metal",
      title: "Phone Covers & Cases",
      subtitle: "Engineered shock protection for Apple, Samsung & more with precision artwork",
      link: "/products?category=covers",
      products: coverProducts.slice(0, 12),
      badge: "Trending",
      badgeColor: "bg-red-500 text-white"
    },
    {
      id: "frames",
      tag: "Wall Decor & Art",
      title: "Frames & Acrylic Wall Art",
      subtitle: "High-definition acrylic & metal artwork for your bedroom, setup, or living room",
      link: "/products?category=frames",
      products: frameProducts.slice(0, 6),
      badge: "Best Value",
      badgeColor: "bg-amber-500 text-white"
    },
    {
      id: "mugs",
      tag: "Ceramic & Magic",
      title: "Coffee Mugs & Cups",
      subtitle: "11oz premium ceramic coffee mugs with vibrant anime, gaming & personalized prints",
      link: "/products?category=mugs",
      products: mugProducts.slice(0, 6),
      badge: "Popular Gift",
      badgeColor: "bg-emerald-600 text-white"
    },
    {
      id: "tumblers",
      tag: "Insulated Drinkware",
      title: "Tumblers & Sippers",
      subtitle: "Stainless steel skinny tumblers & leak-proof bottles for hot and cold sips",
      link: "/products?category=tumblers",
      products: tumblerProducts.slice(0, 6),
      badge: "Hot Sellers",
      badgeColor: "bg-blue-600 text-white"
    },
    {
      id: "mousepads",
      tag: "4MM Pro Desk Mats",
      title: "Gaming Mousepads & Desk Mats",
      subtitle: "Ultra-smooth micro-weave cloth with anti-slip rubber base for speed & precision",
      link: "/products?category=mousepads",
      products: mousepadProducts.slice(0, 6),
      badge: "Gamers Choice",
      badgeColor: "bg-purple-600 text-white"
    },
    {
      id: "tote-bags",
      tag: "100% Organic Canvas",
      title: "Aesthetic Canvas Tote Bags",
      subtitle: "Eco-friendly heavy-duty tote bags for everyday shopping, college, and casual outings",
      link: "/products?category=tote-bags",
      products: toteBagProducts.slice(0, 6),
      badge: "Eco Friendly",
      badgeColor: "bg-teal-600 text-white"
    },
    {
      id: "coasters",
      tag: "Tabletop Essentials",
      title: "Designer Coaster Sets",
      subtitle: "Glossy waterproof coasters in sets of 4 with anti-scratch bottom padding",
      link: "/products?category=coasters",
      products: coasterProducts.slice(0, 5),
      badge: "Set of 4",
      badgeColor: "bg-pink-600 text-white"
    },
  ]

  const heroBanners = allBanners
    .filter((b: any) => b.type === "hero" && b.isActive !== false)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

  const promoBanners = allBanners
    .filter((b: any) => b.type === "promo" && b.isActive !== false)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

  const [currentHero, setCurrentHero] = useState(0)

  useEffect(() => {
    if (heroBanners.length <= 1) return
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroBanners.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [heroBanners.length])

  const nextHero = () => setCurrentHero((prev) => (prev + 1) % heroBanners.length)
  const prevHero = () => setCurrentHero((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)

  // Category fallback images
  const getCatFallback = (slug: string) => {
    if (slug.includes("coaster")) return "/costers.png"
    if (slug.includes("glass") || slug.includes("iphone") || slug.includes("case")) return "/glass.png"
    if (slug.includes("dual")) return "/small.png"
    if (slug.includes("metal")) return "/metal.png"
    if (slug.includes("mug")) return "/mug.png"
    return "/hero.png"
  }

  return (
    <div className="bg-white text-neutral-900 antialiased">

      {/* ═══════════════════════════════════════════
          1. HERO SLIDER
      ═══════════════════════════════════════════ */}
      <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] bg-neutral-950 overflow-hidden group">
        {heroBanners.length > 0 ? (
          heroBanners.map((banner: any, idx: number) => (
            <motion.div
              key={banner._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: idx === currentHero ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
              style={{ pointerEvents: idx === currentHero ? "auto" : "none" }}
            >
              {banner.link ? (
                <Link to={banner.link} className="block w-full h-full">
                  <img src={getImageUrl(banner.imageUrl)} alt={banner.title || "Banner"} className="w-full h-full object-cover" />
                </Link>
              ) : (
                <img src={getImageUrl(banner.imageUrl)} alt={banner.title || "Banner"} className="w-full h-full object-cover" />
              )}
            </motion.div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex flex-col items-center justify-center text-center px-6">
            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Official Store</span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 uppercase">PRINTED SOUL</h1>
            <p className="text-neutral-400 text-sm md:text-base mb-8 max-w-md">Premium custom phone cases & personalized accessories.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {heroBanners.length > 1 && (
          <>
            <button onClick={prevHero} aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/50 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={nextHero} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/50 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {heroBanners.map((_: any, idx: number) => (
                <button key={idx} onClick={() => setCurrentHero(idx)} className={`h-1 rounded-none transition-all duration-300 cursor-pointer ${idx === currentHero ? "bg-white w-6" : "bg-white/40 w-2"}`} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          2. CATEGORY STRIP — Full bleed image tiles
      ═══════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="py-5 max-w-[1700px] mx-auto px-3 md:px-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-700">Shop by Category</h2>
            <Link to="/products" className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors flex items-center gap-1">
              All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
            {categories.map((cat: any) => {
              const slug = cat.slug?.toLowerCase() || ""
              const imgSrc = cat.image ? getImageUrl(cat.image) : getCatFallback(slug)
              return (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat.slug || cat._id}`}
                  className="group relative aspect-square overflow-hidden rounded-sm bg-neutral-100 border border-neutral-200 hover:border-neutral-900 transition-all duration-200"
                >
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = getCatFallback(slug) }}
                  />
                  {/* Dark gradient + name */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <span className="absolute bottom-1.5 left-0 right-0 text-center text-white text-[10px] font-bold uppercase tracking-wide px-1 leading-tight drop-shadow">
                    {cat.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          3. BRANDS STRIP
      ═══════════════════════════════════════════ */}
      {brands.length > 0 && (
        <div className="border-t border-b border-neutral-100 bg-neutral-50 py-2.5 px-3 md:px-6">
          <div className="max-w-[1700px] mx-auto flex items-center gap-3 overflow-x-auto hide-scrollbar">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 shrink-0">Brand:</span>
            <Link to="/products" className="px-3 py-1 text-[11px] font-bold bg-black text-white rounded-sm shrink-0">All</Link>
            {brands.map((brand: any) => (
              <Link
                key={brand._id}
                to={`/products?brand=${brand.slug || brand._id}`}
                className="px-3 py-1 text-[11px] font-semibold bg-white border border-neutral-200 text-neutral-700 hover:bg-black hover:text-white hover:border-black rounded-sm transition-colors shrink-0"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          4. PROMO BANNERS GRID
      ═══════════════════════════════════════════ */}
      {promoBanners.length > 0 && (
        <section className="py-4 max-w-[1700px] mx-auto px-3 md:px-6">
          <div className={`grid gap-2 md:gap-3 ${
            promoBanners.length === 1 ? "grid-cols-1"
            : promoBanners.length === 2 ? "grid-cols-2"
            : "grid-cols-1 md:grid-cols-3"
          }`}>
            {promoBanners.slice(0, 3).map((banner: any, i: number) => {
              const content = (
                <div className="relative overflow-hidden group aspect-[16/9] md:aspect-[4/3] bg-neutral-100 rounded-sm">
                  <img
                    src={getImageUrl(banner.imageUrl)}
                    alt={banner.title || "Promo"}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 flex flex-col justify-end">
                    {banner.title && <h3 className="text-white font-bold text-base leading-tight mb-1">{banner.title}</h3>}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                      Shop Now <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              )
              return banner.link
                ? <Link key={banner._id || i} to={banner.link}>{content}</Link>
                : <div key={banner._id || i}>{content}</div>
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          5. NEW ARRIVALS — 5 column dense grid
      ═══════════════════════════════════════════ */}
      {allProducts.length > 0 && (
        <section className="py-5 max-w-[1700px] mx-auto px-3 md:px-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">Trending Drops</p>
              <h2 className="text-lg font-black tracking-tight text-neutral-900">New Arrivals</h2>
            </div>
            <Link to="/products" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors flex items-center gap-1">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isAllLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
              {allProducts.slice(0, 10).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════
          6. FEATURED PRODUCTS
      ═══════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="py-5 bg-neutral-950 text-white">
          <div className="max-w-[1700px] mx-auto px-3 md:px-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400">Hand-Picked</p>
                <h2 className="text-lg font-black tracking-tight text-white">Featured Best Sellers</h2>
              </div>
              <Link to="/products?featured=true" className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
              {featured.slice(0, 6).map((product: any) => (
                <div key={product._id} className="bg-white rounded-sm">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          7. DYNAMIC CATEGORY SHOWCASE SECTIONS (7 CATEGORIES)
      ═══════════════════════════════════════════ */}
      {showcaseSections.map((sec) => {
        if (sec.products.length === 0) return null

        return (
          <section key={sec.id} className="py-7 border-t border-neutral-100 max-w-[1700px] mx-auto px-3 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                    {sec.tag}
                  </span>
                  {sec.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${sec.badgeColor}`}>
                      {sec.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-neutral-900 uppercase">
                  {sec.title}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5 max-w-xl">
                  {sec.subtitle}
                </p>
              </div>
              <Link
                to={sec.link}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-amber-600 transition-colors shrink-0 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-sm"
              >
                View All {sec.title.split("&")[0].trim()} <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
              {sec.products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )
      })}

      <div className="py-8 text-center border-t border-neutral-100 bg-neutral-50">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-sm"
        >
          Explore Full Store Catalog <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ═══════════════════════════════════════════
          8. SOCIAL FEED
      ═══════════════════════════════════════════ */}
      {socialPosts.length > 0 && (
        <section className="py-8 bg-neutral-950 text-white">
          <div className="max-w-[1400px] mx-auto px-3 md:px-6">
            <div className="text-center mb-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold mb-1">@PrintedSoulStore</p>
              <h2 className="text-xl font-black tracking-tight text-white">Trending on Social 🔥</h2>
              <p className="text-neutral-400 text-xs mt-1">Tag #PrintedSoul to get featured</p>
            </div>
            <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 snap-x snap-mandatory hide-scrollbar pb-2">
              {socialPosts.slice(0, 3).map((post: any) => {
                let embedUrl = post.url
                if (post.url.includes("instagram.com")) {
                  embedUrl = `${post.url.split("?")[0].replace(/\/$/, "")}/embed/captioned`
                } else if (post.url.includes("facebook.com")) {
                  const isReel = post.type === "reel" || post.url.includes("/reel/") || post.url.includes("/video")
                  embedUrl = isReel
                    ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(post.url)}&show_text=false&width=320&autoplay=true&mute=true`
                    : `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(post.url)}&show_text=true&width=320`
                }
                return (
                  <div key={post._id} className="min-w-[280px] md:min-w-0 w-full max-w-[320px] md:max-w-none h-[420px] relative snap-center mx-auto rounded-sm overflow-hidden bg-neutral-900 border border-neutral-800">
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="100%"
                      className="border-none w-full h-full absolute inset-0"
                      scrolling="no"
                      loading="lazy"
                      allow="encrypted-media; autoplay; clipboard-write; picture-in-picture"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          9. CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="bg-neutral-900 py-12 text-center px-6 border-t border-neutral-800">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight leading-tight">
            Wear Your Soul.<br />Shield Your Phone.
          </h2>
          <p className="text-neutral-400 text-sm mb-6">Premium drop protection meets bold artistic expression.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all"
          >
            Explore Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}
