import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams, Link } from "react-router-dom"
import { Filter, X, Search, SlidersHorizontal, ChevronDown, ChevronRight } from "lucide-react"
import { productApi, catalogApi } from "../../lib/api"
import { ProductCard } from "../../components/ui/ProductCard"
import { formatPrice } from "../../lib/utils"

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // --- URL Params ---
  const search = searchParams.get("search") || ""
  const categoryParam = searchParams.get("category") || ""
  const subCategoryParam = searchParams.get("subCategory") || ""
  const brandParam = searchParams.get("brand") || ""
  const deviceModelParam = searchParams.get("deviceModel") || ""
  const minPriceParam = searchParams.get("minPrice") || ""
  const maxPriceParam = searchParams.get("maxPrice") || ""
  const page = parseInt(searchParams.get("page") || "1")

  // Local state for price range inputs (avoid re-fetching on every keypress)
  const [localMinPrice, setLocalMinPrice] = useState(minPriceParam)
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPriceParam)

  // Accordion state for sidebar sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true, subCategory: true, brand: true, deviceModel: true, price: true
  })
  const toggleSection = (key: string) => setOpenSections(s => ({ ...s, [key]: !s[key] }))

  // --- Data Fetching ---
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.getCategories(),
    staleTime: 60 * 60 * 1000,
  })

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => catalogApi.getBrands(),
    staleTime: 60 * 60 * 1000,
  })

  const allCategories: any[] = categoriesData?.data?.data || []
  const brands: any[] = brandsData?.data?.data || []

  // Top-level categories (no parent)
  const topLevelCategories = allCategories.filter((c: any) => !c.parentCategory)

  // Find selected category object (top-level)
  const selectedCatObj = topLevelCategories.find((c: any) => c.slug === categoryParam || c._id === categoryParam)

  // Sub-categories of selected top-level category
  const subCategories = selectedCatObj
    ? allCategories.filter((c: any) => {
        const parentId = typeof c.parentCategory === "object" ? c.parentCategory?._id : c.parentCategory
        return parentId === selectedCatObj._id
      })
    : []

  // Smart filter logic:
  // Show Brand + Device Model filters ONLY for categories that have sub-types (like Phone Cover)
  // or when no category is selected (show all filters by default)
  // For simple categories like Mug, hide irrelevant brand/device model filters
  const selectedCatHasSubcategories = subCategories.length > 0
  
  // Also check if the selected category IS itself a sub-category (its parent has subCategories)
  const selectedCatIsSubCategory = selectedCatObj
    ? !!(typeof selectedCatObj.parentCategory === "object"
        ? selectedCatObj.parentCategory?._id
        : selectedCatObj.parentCategory)
    : false

  // Show advanced filters (brand, device model) if:
  // 1. No category selected (all products), OR
  // 2. The selected category HAS sub-categories (it's a cover-type parent), OR  
  // 3. The selected category IS a sub-category (Dual Case, Glass Cover etc.)
  const showAdvancedFilters = !categoryParam || selectedCatHasSubcategories || selectedCatIsSubCategory

  // Device models — only fetch when advanced filters should show
  const { data: deviceModelsData } = useQuery({
    queryKey: ["deviceModels", brandParam],
    queryFn: () => brandParam
      ? catalogApi.getDevicesByBrand(brandParam)
      : catalogApi.getDevices({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
    enabled: showAdvancedFilters,
  })
  const deviceModels: any[] = deviceModelsData?.data?.data || []

  // --- Build API params ---
  const activeCategory = subCategoryParam || categoryParam
  const params: any = { page, limit: 20 }
  if (search) params.search = search
  if (activeCategory) params.category = activeCategory
  if (brandParam) params.brand = brandParam
  if (deviceModelParam) params.deviceModel = deviceModelParam
  if (minPriceParam) params.minPrice = minPriceParam
  if (maxPriceParam) params.maxPrice = maxPriceParam

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getAll(params),
    enabled: !!categoriesData,
  })

  const products: any[] = productsData?.data?.data || []
  const meta: any = productsData?.data?.meta || {}

  // --- Filter Helpers ---
  const setFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value); else p.delete(key)
    // Reset dependent filters
    if (key === "category") { p.delete("subCategory"); p.delete("deviceModel") }
    if (key === "brand") { p.delete("deviceModel") }
    p.set("page", "1")
    setSearchParams(p)
  }

  const clearFilters = () => {
    setLocalMinPrice("")
    setLocalMaxPrice("")
    setSearchParams(new URLSearchParams())
  }

  const applyPriceFilter = () => {
    const p = new URLSearchParams(searchParams)
    if (localMinPrice) p.set("minPrice", localMinPrice); else p.delete("minPrice")
    if (localMaxPrice) p.set("maxPrice", localMaxPrice); else p.delete("maxPrice")
    p.set("page", "1")
    setSearchParams(p)
  }

  const hasFilters = search || categoryParam || brandParam || deviceModelParam || minPriceParam || maxPriceParam

  // Page title logic
  const pageTitle = selectedCatObj
    ? selectedCatObj.name
    : categoryParam
    ? categoryParam.replace(/-/g, " ")
    : "All Designs"

  // Sidebar content component (shared between desktop and mobile drawer)
  const SidebarContent = () => (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-black text-sm uppercase tracking-widest text-gray-900 flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1 cursor-pointer">
            <X className="h-3 w-3" /> Reset All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Search design..."
            className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold  border border-gray-200 bg-gray-50 focus:outline-none focus:border-black transition-all"
          />
        </div>
      </div>

      {/* ── Category ── */}
      <div className="border-t border-gray-100 pt-3">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full mb-2 cursor-pointer"
        >
          <h4 className="font-black text-[11px] uppercase tracking-wider text-gray-500">Category</h4>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${openSections.category ? "rotate-180" : ""}`} />
        </button>
        {openSections.category && (
          <div className="space-y-1">
            <button
              onClick={() => setFilter("category", "")}
              className={`w-full text-left text-xs font-bold px-3 py-2  transition-all cursor-pointer ${
                !categoryParam ? "bg-black text-white" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              All Categories
            </button>
            {topLevelCategories.map((cat: any) => (
              <button
                key={cat._id}
                onClick={() => setFilter("category", cat.slug || cat._id)}
                className={`w-full text-left text-xs font-bold px-3 py-2  transition-all cursor-pointer ${
                  categoryParam === cat.slug || categoryParam === cat._id
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Sub-Category (only if a category with children is selected) ── */}
      {subCategories.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => toggleSection("subCategory")}
            className="flex items-center justify-between w-full mb-2 cursor-pointer"
          >
            <h4 className="font-black text-[11px] uppercase tracking-wider text-gray-500">Cover Type</h4>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${openSections.subCategory ? "rotate-180" : ""}`} />
          </button>
          {openSections.subCategory && (
            <div className="space-y-1">
              <button
                onClick={() => setFilter("subCategory", "")}
                className={`w-full text-left text-xs font-bold px-3 py-2  transition-all cursor-pointer ${
                  !subCategoryParam ? "bg-violet-600 text-white" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                All {selectedCatObj?.name}
              </button>
              {subCategories.map((sub: any) => (
                <button
                  key={sub._id}
                  onClick={() => setFilter("subCategory", sub.slug || sub._id)}
                  className={`w-full text-left text-xs font-bold px-3 py-2  transition-all cursor-pointer flex items-center gap-2 ${
                    subCategoryParam === sub.slug || subCategoryParam === sub._id
                      ? "bg-violet-600 text-white"
                      : "hover:bg-violet-50 text-gray-600"
                  }`}
                >
                  <ChevronRight className="h-3 w-3 shrink-0" />
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Brand ── */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => toggleSection("brand")}
            className="flex items-center justify-between w-full mb-2 cursor-pointer"
          >
            <h4 className="font-black text-[11px] uppercase tracking-wider text-gray-500">Brand</h4>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${openSections.brand ? "rotate-180" : ""}`} />
          </button>
          {openSections.brand && (
            <div className="space-y-1">
              <button
                onClick={() => setFilter("brand", "")}
                className={`w-full text-left text-xs font-bold px-3 py-2  transition-all cursor-pointer ${
                  !brandParam ? "bg-black text-white" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                All Brands
              </button>
              {brands.map((b: any) => (
                <button
                  key={b._id}
                  onClick={() => setFilter("brand", b.slug || b._id)}
                  className={`w-full text-left text-xs font-bold px-3 py-2  transition-all cursor-pointer ${
                    brandParam === b.slug || brandParam === b._id
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Device Model ── */}
      {showAdvancedFilters && deviceModels.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => toggleSection("deviceModel")}
            className="flex items-center justify-between w-full mb-2 cursor-pointer"
          >
            <h4 className="font-black text-[11px] uppercase tracking-wider text-gray-500">
              Model {brandParam ? `(${brands.find((b: any) => b.slug === brandParam || b._id === brandParam)?.name || ""})` : ""}
            </h4>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${openSections.deviceModel ? "rotate-180" : ""}`} />
          </button>
          {openSections.deviceModel && (
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
              <button
                onClick={() => setFilter("deviceModel", "")}
                className={`w-full text-left text-xs font-bold px-3 py-2  transition-all cursor-pointer ${
                  !deviceModelParam ? "bg-black text-white" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                All Models
              </button>
              {deviceModels.map((dm: any) => (
                <button
                  key={dm._id}
                  onClick={() => setFilter("deviceModel", dm._id)}
                  className={`w-full text-left text-xs font-bold px-3 py-2  transition-all cursor-pointer ${
                    deviceModelParam === dm._id
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {dm.displayName || dm.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Price Range ── */}
      <div className="border-t border-gray-100 pt-3">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full mb-3 cursor-pointer"
        >
          <h4 className="font-black text-[11px] uppercase tracking-wider text-gray-500">Price Range</h4>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${openSections.price ? "rotate-180" : ""}`} />
        </button>
        {openSections.price && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 mb-1 block">Min (₹)</label>
                <input
                  type="number"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs font-bold  border border-gray-200 bg-gray-50 focus:outline-none focus:border-black"
                />
              </div>
              <div className="text-gray-300 font-bold mt-4">—</div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 mb-1 block">Max (₹)</label>
                <input
                  type="number"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  placeholder="∞"
                  className="w-full px-3 py-2 text-xs font-bold  border border-gray-200 bg-gray-50 focus:outline-none focus:border-black"
                />
              </div>
            </div>
            {/* Quick price pills */}
            <div className="flex flex-wrap gap-1.5">
              {[["Under ₹299", "", "299"], ["₹299–₹499", "299", "499"], ["₹500+", "500", ""]].map(([label, min, max]) => (
                <button
                  key={label}
                  onClick={() => {
                    setLocalMinPrice(min)
                    setLocalMaxPrice(max)
                    const p = new URLSearchParams(searchParams)
                    if (min) p.set("minPrice", min); else p.delete("minPrice")
                    if (max) p.set("maxPrice", max); else p.delete("maxPrice")
                    p.set("page", "1")
                    setSearchParams(p)
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                    minPriceParam === min && maxPriceParam === max
                      ? "bg-black text-white border-black"
                      : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={applyPriceFilter}
              className="w-full py-2  bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Apply Price
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-gray-900 antialiased selection:bg-black selection:text-white">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1700px] mx-auto px-3 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <nav className="flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold mb-1">
                <Link to="/" className="hover:text-black">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <Link to="/products" className="hover:text-black">All Products</Link>
                {selectedCatObj && (
                  <>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-black">{selectedCatObj.name}</span>
                  </>
                )}
              </nav>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 capitalize">
                {pageTitle}
              </h1>
              {selectedCatObj?.description && (
                <p className="text-gray-500 text-xs mt-1 max-w-lg">{selectedCatObj.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {meta.total && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1.5">
                  <strong className="text-black">{meta.total}</strong> designs
                </span>
              )}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white text-xs font-bold cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="relative ml-auto w-[85vw] max-w-sm bg-white h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-black text-sm">Filters</span>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="max-w-[1700px] mx-auto px-3 md:px-6 py-4">
        <div className="flex gap-4">

          {/* Desktop Sidebar — Sticky */}
          <aside className="hidden md:block w-52 shrink-0">
            <div className="sticky top-16 bg-white p-4 border border-gray-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <SidebarContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">

            {/* Active filters chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {categoryParam && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white text-[11px] font-bold">
                    {selectedCatObj?.name || categoryParam}
                    <button onClick={() => setFilter("category", "")} className="hover:text-gray-300 cursor-pointer"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {subCategoryParam && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-600 text-white text-[11px] font-bold">
                    {allCategories.find((c: any) => c.slug === subCategoryParam || c._id === subCategoryParam)?.name || subCategoryParam}
                    <button onClick={() => setFilter("subCategory", "")} className="hover:text-violet-200 cursor-pointer"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {brandParam && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white text-[11px] font-bold">
                    {brands.find((b: any) => b.slug === brandParam || b._id === brandParam)?.name || brandParam}
                    <button onClick={() => setFilter("brand", "")} className="hover:text-gray-300 cursor-pointer"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {deviceModelParam && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white text-[11px] font-bold">
                    {deviceModels.find((d: any) => d._id === deviceModelParam)?.displayName || "Model"}
                    <button onClick={() => setFilter("deviceModel", "")} className="hover:text-gray-300 cursor-pointer"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {(minPriceParam || maxPriceParam) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold">
                    {minPriceParam ? `₹${minPriceParam}` : "Any"} — {maxPriceParam ? `₹${maxPriceParam}` : "Any"}
                    <button onClick={() => { setLocalMinPrice(""); setLocalMaxPrice(""); const p = new URLSearchParams(searchParams); p.delete("minPrice"); p.delete("maxPrice"); setSearchParams(p) }} className="hover:text-emerald-200 cursor-pointer"><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-200">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Designs Found</h3>
                <p className="text-gray-500 text-sm">Try resetting your filters or search term.</p>
                <button onClick={clearFilters} className="mt-5 px-6 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {meta.total > 20 && (
                  <div className="flex justify-center gap-2 mt-8 mb-4">
                    {page > 1 && (
                      <button
                        onClick={() => setFilter("page", String(page - 1))}
                        className="px-4 py-2 border border-gray-200 bg-white text-gray-900 font-bold text-xs hover:border-black transition-all cursor-pointer"
                      >
                        ← Prev
                      </button>
                    )}
                    <span className="px-4 py-2 text-xs font-semibold text-gray-500 flex items-center">
                      {page} / {Math.ceil(meta.total / 20)}
                    </span>
                    {page * 20 < meta.total && (
                      <button
                        onClick={() => setFilter("page", String(page + 1))}
                        className="px-4 py-2 border border-gray-200 bg-white text-gray-900 font-bold text-xs hover:border-black transition-all cursor-pointer"
                      >
                        Next →
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
