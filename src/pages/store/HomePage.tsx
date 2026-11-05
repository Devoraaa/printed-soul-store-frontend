import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  ArrowRight, ChevronRight, ChevronLeft, Filter, Search, SlidersHorizontal
} from "lucide-react"
import { productApi, catalogApi, bannerApi, socialPostApi } from "../../lib/api"
import { getImageUrl } from "../../lib/utils"
import { ProductCard } from "../../components/ui/ProductCard"
import { SEO } from "../../components/ui/SEO"

export function HomePage() {
  const navigate = useNavigate()
  const [homeSearch, setHomeSearch] = useState("")

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

  // Category photo resolver — matches actual products in catalog for rich, distinct category thumbnails
  const getCategoryPhoto = (cat: any) => {
    if (cat.image) return getImageUrl(cat.image)

    const slug = (cat.slug || "").toLowerCase()
    const name = (cat.name || "").toLowerCase()

    // Find actual matching product from loaded catalog
    const match = allProducts.find((p: any) => {
      const pCatSlug = p.category?.slug?.toLowerCase() || ""
      const pCatId = p.category?._id || p.category
      const pName = p.name?.toLowerCase() || ""
      return (
        pCatSlug === slug ||
        pCatId === cat._id ||
        (slug.includes("coaster") && pName.includes("coaster")) ||
        (slug.includes("mouse") && (pName.includes("mouse") || pName.includes("pad"))) ||
        (slug.includes("tote") && (pName.includes("tote") || pName.includes("bag"))) ||
        (slug.includes("frame") && pName.includes("frame")) ||
        (slug.includes("mug") && (pName.includes("mug") || pName.includes("cup"))) ||
        (slug.includes("tumbler") && (pName.includes("tumbler") || pName.includes("sipper"))) ||
        (slug.includes("cover") && (pName.includes("case") || pName.includes("cover")))
      )
    })

    if (match?.images?.[0]) {
      return getImageUrl(match.images[0])
    }

    if (slug.includes("coaster")) return "/costers.webp"
    if (slug.includes("glass")) return "/glass.webp"
    if (slug.includes("dual")) return "/small.webp"
    if (slug.includes("metal")) return "/metal.webp"
    if (slug.includes("mug")) return "/mug.webp"
    return "/hero.webp"
  }

  const homeStructuredData = [
    {
      "@type": "WebSite",
      "@id": "https://printedsoul.in/#website",
      "name": "Printed Soul",
      "url": "https://printedsoul.in",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://printedsoul.in/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "ItemList",
      "name": "Featured Mobile Covers & Accessories",
      "itemListElement": featured.slice(0, 10).map((prod: any, idx: number) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://printedsoul.in/products/${prod.slug || prod._id}`,
        "name": prod.name,
        "image": getImageUrl(prod.images?.[0]) || "https://printedsoul.in/hero.webp"
      }))
    }
  ]

  return (
    <div className="bg-[#F4EFEA] text-neutral-900 antialiased min-h-screen">
      <SEO
        title="Buy Custom Phone Cases, Glass & Metal Covers Online India"
        description="Shop India's most protective custom phone cases, 9H toughened glass covers, dual protection shockproof cases, and metal armor cases for Apple, Samsung, Vivo, Oppo & more at Printed Soul. Free shipping above ₹499."
        keywords={[
          "Printed Soul",
          "buy phone covers online india",
          "custom phone cases india",
          "toughened glass phone case",
          "dual protection shockproof cover",
          "metal armor mobile cover",
          "aesthetic phone covers",
          "anime phone case india",
          "designer mobile covers",
          "custom printed mugs",
          "wall frames india"
        ]}
        canonicalUrl="https://printedsoul.in/"
        structuredData={homeStructuredData}
      />

      <h1 className="sr-only">
        Printed Soul — Buy Custom Phone Cases, Toughened Glass &amp; Metal Armor Covers Online India
      </h1>

      {/* ═══════════════════════════════════════════
          1. HERO SLIDER — Full Bleed Edge-to-Edge (Capped at 100dvh full display)
      ═══════════════════════════════════════════ */}
      <section className="w-full m-0 p-0 overflow-hidden max-h-[100dvh]">
        <div className="relative w-full group overflow-hidden bg-neutral-950 max-h-[100dvh]">
        {heroBanners.length > 0 ? (
          <div className="relative w-full max-h-[100dvh]">
            {heroBanners.map((banner: any, idx: number) => {
              const isActive = idx === currentHero
              return (
                <div
                  key={banner._id || idx}
                  className={`w-full max-h-[100dvh] transition-opacity duration-500 ease-in-out ${
                    isActive ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                >
                  {banner.link ? (
                    <Link to={banner.link} className="block w-full max-h-[100dvh]">
                      <img
                        src={getImageUrl(banner.imageUrl)}
                        alt={banner.title || "Printed Soul Banner"}
                        loading={idx === 0 ? "eager" : "lazy"}
                        decoding={idx === 0 ? "sync" : "async"}
                        fetchPriority={idx === 0 ? "high" : "low"}
                        className="w-full h-auto max-h-[100dvh] block object-cover object-center"
                      />
                    </Link>
                  ) : (
                    <img
                      src={getImageUrl(banner.imageUrl)}
                      alt={banner.title || "Printed Soul Banner"}
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding={idx === 0 ? "sync" : "async"}
                      fetchPriority={idx === 0 ? "high" : "low"}
                      className="w-full h-auto max-h-[100dvh] block object-cover object-center"
                    />
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="w-full pt-36 pb-24 md:pt-48 md:pb-36 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex flex-col items-center justify-center text-center px-6">
            <span className="text-amber-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Official Store</span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 uppercase font-display">PRINTED SOUL</h1>
            <p className="text-neutral-400 text-sm md:text-base mb-8 max-w-md">Premium custom phone cases & personalized accessories.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-md">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {heroBanners.length > 1 && (
          <>
            <button onClick={prevHero} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/40 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg backdrop-blur-sm">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={nextHero} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/40 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg backdrop-blur-sm">
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
              {heroBanners.map((_: any, idx: number) => (
                <button key={idx} onClick={() => setCurrentHero(idx)} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentHero ? "bg-white w-6" : "bg-white/40 w-1.5"}`} />
              ))}
            </div>
          </>
        )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. CATEGORY STRIP — Luxury Lifestyle Collection Cards
      ═══════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="py-7 max-w-[1700px] mx-auto px-3 md:px-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-500">Curated Collections</p>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-neutral-950 font-display">Shop by Category</h2>
            </div>
            <Link to="/products" className="group text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-black transition-colors flex items-center gap-1.5 bg-white border border-black/[0.08] px-4 py-2 rounded-full shadow-xs hover:shadow-sm">
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-3.5 md:gap-4">
            {categories.map((cat: any) => {
              const imgSrc = getCategoryPhoto(cat)
              return (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat.slug || cat._id}`}
                  className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-3xl bg-[#FAF7F2] border border-black/[0.06] hover:border-black/25 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1"
                >
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/hero.webp"
                    }}
                  />
                  {/* Subtle luxury vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Floating Frosted Glass Label Pill */}
                  <div className="absolute inset-x-2.5 bottom-2.5 flex justify-center">
                    <span className="w-full text-center py-2 px-2.5 rounded-2xl bg-white/95 group-hover:bg-neutral-950 text-neutral-900 group-hover:text-white backdrop-blur-md text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-300 truncate">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          2.5 QUICK FILTERS (Navigates directly to Shop All)
      ═══════════════════════════════════════════ */}
      <section className="py-4 max-w-[1700px] mx-auto px-3 md:px-6">
        <div className="bg-white border border-black/[0.05] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          {/* Top Row: Title, Filters Icon & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-full bg-neutral-900 text-white shadow-sm">
                <Filter className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Quick Filters
                </h3>
                <p className="text-[11px] text-neutral-500">Search designs, choose a category or phone brand</p>
              </div>
            </div>

            {/* Quick Search Box */}
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (homeSearch.trim()) {
                  navigate(`/products?search=${encodeURIComponent(homeSearch.trim())}`)
                }
              }}
              className="relative w-full sm:w-80"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
                placeholder="Search design, anime, aesthetic..."
                className="w-full pl-9 pr-20 py-2.5 text-xs font-medium border border-neutral-200/80 bg-neutral-50/70 rounded-full focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full hover:bg-black transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Categories Filter Strip */}
          <div className="pt-3 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 shrink-0">Category:</span>
            <Link
              to="/products"
              className="px-3.5 py-1.5 text-xs font-bold bg-neutral-900 text-white rounded-full shrink-0 hover:bg-black transition-all shadow-sm"
            >
              All Categories
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug || cat._id}`}
                className="px-3.5 py-1.5 text-xs font-medium bg-neutral-50 border border-neutral-200/80 text-neutral-700 hover:bg-black hover:text-white hover:border-black rounded-full transition-all shrink-0"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Brands & Price Filter Strip */}
          <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
            {brands.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 shrink-0">Brand:</span>
                <Link
                  to="/products"
                  className="px-3 py-1 text-[11px] font-bold bg-neutral-200 text-neutral-800 hover:bg-black hover:text-white rounded-full transition-all shrink-0"
                >
                  All Brands
                </Link>
                {brands.map((brand: any) => (
                  <Link
                    key={brand._id}
                    to={`/products?brand=${brand.slug || brand._id}`}
                    className="px-3 py-1 text-[11px] font-medium bg-white border border-neutral-200/80 text-neutral-700 hover:border-black hover:text-black rounded-full transition-all shrink-0"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Quick Price Links */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mr-1">Price:</span>
              {[
                { label: "Under ₹299", min: "", max: "299" },
                { label: "₹299–₹499", min: "299", max: "499" },
                { label: "₹500+", min: "500", max: "" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={`/products?${item.min ? `minPrice=${item.min}&` : ""}${item.max ? `maxPrice=${item.max}` : ""}`}
                  className="px-3 py-1 text-[10px] font-bold text-neutral-600 border border-neutral-200/80 hover:border-black hover:text-black rounded-full transition-all bg-white shadow-xs"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. PROMO BANNERS GRID — Editorial Lookbook
      ═══════════════════════════════════════════ */}
      {promoBanners.length > 0 && (
        <section className="py-5 max-w-[1700px] mx-auto px-3 md:px-6">
          <div className={`grid gap-3 sm:gap-4 ${
            promoBanners.length === 1 ? "grid-cols-1"
            : promoBanners.length === 2 ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-3"
          }`}>
            {promoBanners.slice(0, 3).map((banner: any, i: number) => {
              const content = (
                <div className="relative overflow-hidden group aspect-[16/9] md:aspect-[16/10] bg-[#161513] rounded-3xl border border-black/[0.06] shadow-sm hover:shadow-xl transition-all duration-300">
                  <img
                    src={getImageUrl(banner.imageUrl)}
                    alt={banner.title || "Promo"}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-5 sm:p-6 flex flex-col justify-end">
                    {banner.title && <h3 className="text-white font-black text-lg sm:text-xl leading-tight mb-2 drop-shadow-sm">{banner.title}</h3>}
                    <div className="flex items-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 group-hover:bg-amber-400 text-neutral-900 group-hover:text-neutral-950 backdrop-blur-md text-[11px] font-black uppercase tracking-wider shadow-sm transition-all duration-300">
                        Shop Now <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
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
          5. NEW ARRIVALS — Larger products, tight gaps
      ═══════════════════════════════════════════ */}
      {allProducts.length > 0 && (
        <section className="py-8 max-w-[1700px] mx-auto px-3 md:px-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-500">Trending Drops</p>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-neutral-950 font-display">New Arrivals</h2>
            </div>
            <Link to="/products?sort=new" className="group text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-black transition-colors flex items-center gap-1.5 bg-white border border-black/[0.08] px-4 py-2 rounded-full shadow-xs hover:shadow-sm">
              <span>Explore All</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {isAllLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-2.5 md:gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-200/50 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-2.5 md:gap-3">
              {allProducts.slice(0, 10).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════
          6. FEATURED PRODUCTS — Dark Luxury Ambient Card
      ═══════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="py-8 max-w-[1700px] mx-auto px-3 md:px-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1917] via-[#141311] to-[#0A0908] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-amber-500/15">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400">Hand-Picked Selection</p>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white font-display">Featured Best Sellers</h2>
              </div>
              <Link to="/products?featured=true" className="group text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 rounded-full shadow-sm">
                <span>View All</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="relative grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-3 md:gap-3.5">
              {featured.slice(0, 8).map((product: any) => (
                <ProductCard key={product._id} product={product} />
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
          <section key={sec.id} className="py-8 border-t border-black/[0.05] max-w-[1700px] mx-auto px-3 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                    {sec.tag}
                  </span>
                  {sec.badge && (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${sec.badgeColor}`}>
                      {sec.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
                  {sec.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
                  {sec.subtitle}
                </p>
              </div>
              <Link
                to={sec.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-black transition-all shrink-0 bg-white hover:bg-neutral-100 border border-black/[0.08] px-4 py-2 rounded-full shadow-sm"
              >
                View All {sec.title.split("&")[0].trim()} <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3">
              {sec.products.slice(0, 8).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )
      })}

      <div className="py-10 text-center border-t border-black/[0.05] bg-transparent">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
        >
          Explore Full Store Catalog <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ═══════════════════════════════════════════
          8. SOCIAL FEED
      ═══════════════════════════════════════════ */}
      {socialPosts.length > 0 && (
        <section className="py-10 max-w-[1700px] mx-auto px-3 md:px-6">
          <div className="bg-[#161513] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5">
            <div className="text-center mb-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold mb-1">@PrintedSoulStore</p>
              <h2 className="text-2xl font-black tracking-tight text-white font-display">Trending on Social 🔥</h2>
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
                  <div key={post._id} className="min-w-[280px] md:min-w-0 w-full max-w-[320px] md:max-w-none h-[420px] relative snap-center mx-auto rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
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
          9. CTA BANNER — High-Impact Brand Statement
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1700px] mx-auto px-3 md:px-6 my-10">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1B18] via-[#12110F] to-[#0A0908] rounded-3xl py-16 px-6 sm:px-12 text-center border border-white/10 shadow-2xl">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-xl mx-auto space-y-4">
            <span className="inline-block px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.25em] rounded-full bg-white/10 text-amber-300 border border-amber-300/20">
              The Printed Soul Difference
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display">
              Wear Your Soul.<br />Shield Your Device.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Military-grade drop defense tailored with personalized HD artwork. 100% precision fit guaranteed.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Shop All Collections <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/track"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/15 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Track Your Order
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
