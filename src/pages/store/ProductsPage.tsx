import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { Filter, X, Search, SlidersHorizontal } from "lucide-react"
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

  // Only consider phone cases for brand filtering
  const isCaseCategory = selectedCategoryObj ? selectedCategoryObj.name.toLowerCase().includes("case") : true

  const params: any = { page, limit: 20 }
  if (search) params.search = search
  if (categoryId && categoryId !== "all") params.category = categoryId
  if (brandId && isCaseCategory) params.brand = brandId

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getAll(params),
    // Wait until categories/brands are loaded to resolve slugs
    enabled: !!categoriesData && !!brandsData,
  })

  const products = productsData?.data?.data || []
  const meta = productsData?.data?.meta || {}

  const setFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value); else p.delete(key)
    
    // If switching to a non-case category, clear the brand filter
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`md:w-56 shrink-0 ${showFilters ? "block" : "hidden md:block"}`}>
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-gray-500">Filters</h3>
              {hasFilters && <button onClick={clearFilters} className="text-xs text-black font-semibold hover:underline flex items-center gap-1"><X className="h-3 w-3" />Clear</button>}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setFilter("search", e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all shadow-sm"
              />
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-medium text-sm mb-2">Category</h4>
              <div className="space-y-1">
                <button onClick={() => setFilter("category", "")} className={`w-full text-left text-sm px-4 py-2 rounded-xl transition-all ${!categoryParam ? "bg-black text-white font-medium shadow-md" : "hover:bg-gray-100 text-gray-600"}`}>
                  All Categories
                </button>
                {categories.map((cat: any) => (
                  <button key={cat._id} onClick={() => setFilter("category", cat.slug || cat._id)}
                    className={`w-full text-left text-sm px-4 py-2 rounded-xl transition-all ${categoryParam === cat.slug || categoryParam === cat._id ? "bg-black text-white font-medium shadow-md" : "hover:bg-gray-100 text-gray-600"}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            {isCaseCategory && (
              <div>
                <h4 className="font-medium text-sm mb-2">Brand</h4>
                <div className="space-y-1">
                  <button onClick={() => setFilter("brand", "")} className={`w-full text-left text-sm px-4 py-2 rounded-xl transition-all ${!brandParam ? "bg-black text-white font-medium shadow-md" : "hover:bg-gray-100 text-gray-600"}`}>
                    All Brands
                  </button>
                  {brands.map((b: any) => (
                    <button key={b._id} onClick={() => setFilter("brand", b.slug || b._id)}
                      className={`w-full text-left text-sm px-4 py-2 rounded-xl transition-all ${brandParam === b.slug || brandParam === b._id ? "bg-black text-white font-medium shadow-md" : "hover:bg-gray-100 text-gray-600"}`}>
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">All Products</h1>
              {meta.total && <p className="text-sm text-gray-500">{meta.total} products found</p>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-4 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try changing your filters</p>
              <button onClick={clearFilters} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {meta.total > 20 && (
                <div className="flex justify-center gap-3 mt-12 mb-8">
                  {page > 1 && <button onClick={() => setFilter("page", String(page - 1))} className="px-5 py-2.5 rounded-full border border-gray-200 hover:border-black font-medium transition-all text-sm">Previous</button>}
                  <span className="px-5 py-2.5 font-medium text-sm flex items-center">Page {page}</span>
                  {page * 20 < meta.total && <button onClick={() => setFilter("page", String(page + 1))} className="px-5 py-2.5 rounded-full border border-gray-200 hover:border-black font-medium transition-all text-sm">Next</button>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
