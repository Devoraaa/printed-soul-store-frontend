import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { Filter, X, Search, SlidersHorizontal, Sparkles, Check, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { productApi, catalogApi } from "../../lib/api"
import { ProductCard } from "../../components/ui/ProductCard"
import { useCart } from "../../context/CartContext"

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const search = searchParams.get("search") || ""
  const categoryParam = searchParams.get("category") || ""
  const brandParam = searchParams.get("brand") || ""
  const page = parseInt(searchParams.get("page") || "1")

  const { data: categoriesData } = useQuery({ queryKey: ["categories"], queryFn: () => catalogApi.getCategories() })
  const { data: brandsData } = useQuery({ queryKey: ["brands"], queryFn: () => catalogApi.getBrands() })

  const categories = categoriesData?.data?.data || []
  const brands = brandsData?.data?.data || []

  // Resolve slugs to IDs for the API call
  const selectedCategoryObj = categories.find((c: any) => c.slug === categoryParam || c._id === categoryParam)
  const categoryId = selectedCategoryObj ? selectedCategoryObj._id : categoryParam

  const brandId = brandParam && brandParam !== "all"
    ? (brands.find((b: any) => b.slug === brandParam || b._id === brandParam)?._id || brandParam)
    : ""

  const isCaseCategory = selectedCategoryObj ? selectedCategoryObj.name.toLowerCase().includes("case") : true

  const params: any = { page, limit: 20 }
  if (search) params.search = search
  if (categoryId && categoryId !== "all") params.category = categoryId
  if (brandId && isCaseCategory) params.brand = brandId

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getAll(params),
    enabled: !!categoriesData && !!brandsData,
  })

  const products = productsData?.data?.data || []
  const meta = productsData?.data?.meta || {}

  const setFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value); else p.delete(key)
    
    if (key === "category") {
      const newCatObj = categories.find((c: any) => c.slug === value || c._id === value)
      const newCatIsCase = newCatObj ? newCatObj.name.toLowerCase().includes("case") : true
      if (!newCatIsCase) p.delete("brand")
    }

    p.set("page", "1")
    setSearchParams(p)
  }

  const clearFilters = () => setSearchParams(new URLSearchParams())

  const hasFilters = search || (categoryParam && categoryParam !== "all") || (brandParam && brandParam !== "all")

  return (
    <div className="bg-[#09090b] min-h-screen text-white antialiased selection:bg-white selection:text-black">
      
      {/* Header Banner */}
      <div className="bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1650px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20 inline-block mb-3">
                CATALOG 2026
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white">
                All Masterpiece Designs
              </h1>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl">
                Explore 3D optical glass, 10ft drop armor, and brushed metal covers for 1000+ devices.
              </p>
            </div>

            {meta.total && (
              <span className="text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full self-start md:self-auto">
                Showing <strong className="text-white">{meta.total}</strong> Designs
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1650px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className={`md:w-64 shrink-0 ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="sticky top-24 space-y-6 bg-zinc-950/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
              
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-xs uppercase tracking-widest text-zinc-400">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                    <X className="h-3 w-3" /> Reset
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  value={search}
                  onChange={(e) => setFilter("search", e.target.value)}
                  placeholder="Search design..."
                  className="w-full pl-10 pr-4 py-3 text-xs font-semibold rounded-2xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-3">Category</h4>
                <div className="space-y-1.5">
                  <button 
                    onClick={() => setFilter("category", "")} 
                    className={`w-full text-left text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                      !categoryParam ? "bg-white text-black shadow-md" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat: any) => (
                    <button 
                      key={cat._id} 
                      onClick={() => setFilter("category", cat.slug || cat._id)}
                      className={`w-full text-left text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                        categoryParam === cat.slug || categoryParam === cat._id 
                          ? "bg-white text-black shadow-md" 
                          : "hover:bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {isCaseCategory && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-3">Brand</h4>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => setFilter("brand", "")} 
                      className={`w-full text-left text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                        !brandParam ? "bg-white text-black shadow-md" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      All Brands
                    </button>
                    {brands.map((b: any) => (
                      <button 
                        key={b._id} 
                        onClick={() => setFilter("brand", b.slug || b._id)}
                        className={`w-full text-left text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                          brandParam === b.slug || brandParam === b._id 
                            ? "bg-white text-black shadow-md" 
                            : "hover:bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Products Grid Area */}
          <div className="flex-1 min-w-0">
            
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between mb-6 md:hidden">
              <span className="text-xs font-bold text-zinc-400">{products.length} Products</span>
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-800 bg-zinc-900 text-xs font-extrabold text-white"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-28 bg-zinc-950 rounded-[3rem] border border-zinc-800">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">No Designs Found</h3>
                <p className="text-zinc-500 text-sm">Try resetting your filters or search term.</p>
                <button onClick={clearFilters} className="mt-6 px-8 py-3 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {meta.total > 20 && (
                  <div className="flex justify-center gap-3 mt-16 mb-8">
                    {page > 1 && (
                      <button 
                        onClick={() => setFilter("page", String(page - 1))} 
                        className="px-6 py-3 rounded-full border border-zinc-800 bg-zinc-900 text-white font-bold text-xs hover:border-white transition-all cursor-pointer"
                      >
                        Previous Page
                      </button>
                    )}
                    <span className="px-6 py-3 text-xs font-bold text-zinc-400 flex items-center">
                      Page {page} of {Math.ceil(meta.total / 20)}
                    </span>
                    {page * 20 < meta.total && (
                      <button 
                        onClick={() => setFilter("page", String(page + 1))} 
                        className="px-6 py-3 rounded-full border border-zinc-800 bg-zinc-900 text-white font-bold text-xs hover:border-white transition-all cursor-pointer"
                      >
                        Next Page
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
