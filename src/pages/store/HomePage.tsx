import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Flame, ChevronRight, ShoppingBag } from "lucide-react"
import { productApi, catalogApi, bannerApi } from "../../lib/api"
import { getImageUrl } from "../../lib/utils"
import { ProductCard } from "../../components/ui/ProductCard"

export function HomePage() {
  const { data: featuredData, isLoading: isFeaturedLoading } = useQuery({ 
    queryKey: ["featured-products"], 
    queryFn: () => productApi.getFeatured() 
  })

  const { data: allProductsData, isLoading: isAllLoading } = useQuery({
    queryKey: ["all-products-home"],
    queryFn: () => productApi.getAll({ limit: 24 })
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
  const allProducts = allProductsData?.data?.data || []
  const categories = categoriesData?.data?.data || []
  const brands = brandsData?.data?.data || []
  
  const allBanners = bannersData?.data?.data || []
  const heroBanners = allBanners.filter((b: any) => b.type === "hero")
  const promoBanners = allBanners.filter((b: any) => b.type === "promo")

  const [currentHero, setCurrentHero] = useState(0)

  React.useEffect(() => {
    if (heroBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroBanners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroBanners.length])

  return (
    <div className="bg-[#FAFAFA] text-[#111111] antialiased selection:bg-black selection:text-white">
      
      {/* 1. Main Clean Hero Photo Banner */}
      <section className="relative h-[65vh] min-h-[480px] max-h-[680px] w-full bg-white overflow-hidden border-b border-gray-200/80">
        {heroBanners.length > 0 ? (
          heroBanners.map((banner: any, idx: number) => (
            <motion.div
              key={banner._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: idx === currentHero ? 1 : 0 }}
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
            <img src="/hero.png" alt="Printed Soul Clean Hero" className="w-full h-full object-cover object-center" />
          </div>
        )}

        {/* Floating Slide Counter */}
        {heroBanners.length > 1 && (
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200 shadow-md">
            {heroBanners.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentHero(idx)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === currentHero ? "bg-black w-7" : "bg-gray-300 hover:bg-gray-500 w-2"}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Brand Visual Selector Bar (Photos & Icons) */}
      {brands.length > 0 && (
        <section className="py-6 bg-white border-b border-gray-200/80 shadow-xs">
          <div className="max-w-[1650px] mx-auto px-4">
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400 shrink-0">
                BRANDS:
              </span>
              {brands.map((brand: any) => (
                <Link
                  key={brand._id}
                  to={`/products?brand=${brand._id}`}
                  className="px-6 py-2.5 rounded-2xl bg-gray-50 hover:bg-black hover:text-white border border-gray-200/80 transition-all font-extrabold text-xs tracking-wider uppercase shrink-0 shadow-xs flex items-center gap-2"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. PHOTO GRID 1: Trending Best Sellers (Product Photos Focus) */}
      <section className="py-14 max-w-[1650px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-rose-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-0.5 rounded-full border border-rose-100">
                TRENDING DROPS
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900">
              Featured Designs
            </h2>
          </div>
          <Link to="/products" className="flex items-center gap-1.5 text-xs font-black text-black hover:text-violet-600 transition-colors uppercase tracking-wider">
            View All ({featured.length}) <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {isFeaturedLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-3xl bg-gray-100 animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
            {featured.slice(0, 8).map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. VISUAL PROMO PHOTO BANNERS GRID */}
      {promoBanners.length > 0 && (
        <section className="py-8 max-w-[1650px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promoBanners.slice(0, 3).map((banner: any, idx: number) => (
              <Link 
                key={banner._id || idx} 
                to={banner.link || "/products"} 
                className="group relative rounded-[2rem] overflow-hidden aspect-[16/9] md:aspect-[4/3] border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <img 
                  src={getImageUrl(banner.imageUrl)} 
                  alt={banner.title || "Promo Photo"} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-display font-black text-white mb-1 drop-shadow-md">
                    {banner.title}
                  </h3>
                  <span className="text-white/90 text-xs font-bold flex items-center gap-1">
                    Shop Now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. VISUAL CATEGORIES PHOTO GRID (Category Cards with Real Category Photos) */}
      {categories.length > 0 && (
        <section className="py-14 max-w-[1650px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-0.5 rounded-full border border-violet-100">
                BROWSE BY MATERIAL
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900 mt-1">
                Shop Collections
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat: any) => {
              const slug = cat.slug?.toLowerCase() || "";
              let fallbackImage = "/placeholder.png";
              if (slug.includes("coaster")) fallbackImage = "/costers.png";
              else if (slug.includes("glass")) fallbackImage = "/glass.png";
              else if (slug.includes("dual")) fallbackImage = "/small.png";
              else if (slug.includes("metal")) fallbackImage = "/metal.png";
              else if (slug.includes("mug")) fallbackImage = "/mug.png";

              const imgSrc = cat.image ? getImageUrl(cat.image) : fallbackImage;

              return (
                <Link 
                  key={cat._id} 
                  to={`/categories/${cat.slug}`}
                  className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] bg-white border border-gray-200/80 shadow-md hover:shadow-2xl transition-all duration-500"
                >
                  <img 
                    src={imgSrc} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-display font-black text-white mb-1 drop-shadow-md">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                      Explore Collection <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* 6. MAIN PRODUCT PHOTOS CATALOG GRID (All Real Products) */}
      <section className="py-14 bg-white border-t border-gray-200/80">
        <div className="max-w-[1650px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-100">
                ALL DESIGNS
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-gray-900 mt-1">
                Explore Store Gallery
              </h2>
            </div>
            <Link to="/products" className="text-xs font-black text-black uppercase tracking-wider hover:underline">
              View All Products
            </Link>
          </div>

          {isAllLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-gray-100 animate-pulse border border-gray-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
              {allProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-xl"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
