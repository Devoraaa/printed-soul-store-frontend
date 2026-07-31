import React from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, Sparkles, SlidersHorizontal, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { productApi, catalogApi } from "../../lib/api"
import { ProductCard } from "../../components/ui/ProductCard"

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedBrand = searchParams.get("brand") || ""
  const selectedModel = searchParams.get("model") || ""

  const handleFilterChange = (key: string, value: string) => {
    if (value) {
      searchParams.set(key, value)
    } else {
      searchParams.delete(key)
    }
    if (key === "brand") searchParams.delete("model")
    setSearchParams(searchParams)
  }

  const { data: categoryData } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => catalogApi.getCategoryBySlug(slug!),
    enabled: !!slug,
  })

  const category = categoryData?.data?.data

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => catalogApi.getBrands(),
  })
  const brands = brandsData?.data?.data || []

  const selectedBrandObj = brands.find((b: any) => b._id === selectedBrand)

  const { data: devicesData } = useQuery({
    queryKey: ["devices", selectedBrandObj?.slug],
    queryFn: () => catalogApi.getDevicesByBrand(selectedBrandObj.slug),
    enabled: !!selectedBrandObj?.slug,
  })
  const devices = devicesData?.data?.data || []

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products-category", category?._id, selectedBrand, selectedModel],
    queryFn: () => {
      const params: any = { category: category._id, limit: 40 }
      if (selectedBrand) params.brand = selectedBrand
      if (selectedModel) params.deviceModels = selectedModel
      return productApi.getAll(params)
    },
    enabled: !!category?._id,
  })

  const products = productsData?.data?.data || []

  return (
    <div className="bg-[#09090b] min-h-screen text-white antialiased selection:bg-white selection:text-black">
      
      {/* Clean SEO-friendly Category Header */}
      <div className="bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1650px] mx-auto px-4 md:px-8 py-10 md:py-16">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-white transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-amber-400 capitalize">{category?.name || slug}</span>
          </nav>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                CURATED COLLECTION
              </span>
              <span className="text-xs font-bold text-zinc-400">
                • {products.length} Designs Available
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white capitalize mb-4">
              {category?.name || slug} Cases & Covers
            </h1>
            <p className="text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed">
              {category?.description || `Explore our high-definition 3D printed ${category?.name || slug} cases & covers. Precision cutouts and 10ft drop protection for your phone.`}
            </p>
          </div>

        </div>
      </div>

      {/* Sticky Quick Filters Bar */}
      <div className="bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-800 sticky top-16 z-30 shadow-2xl">
        <div className="max-w-[1650px] mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
              Filter By:
            </span>
            
            {/* Brand Select */}
            <div className="relative w-full sm:w-52">
              <select 
                value={selectedBrand} 
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-xs font-bold rounded-2xl px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
              >
                <option value="" className="bg-zinc-900 text-zinc-400">All Brands</option>
                {brands.map((b: any) => (
                  <option key={b._id} value={b._id} className="bg-zinc-900 text-white">{b.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>

            {/* Model Select */}
            <div className="relative w-full sm:w-52">
              <select 
                value={selectedModel} 
                onChange={(e) => handleFilterChange("model", e.target.value)}
                disabled={!selectedBrand}
                className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-xs font-bold rounded-2xl px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-zinc-900 text-zinc-400">All Models</option>
                {devices.map((d: any) => (
                  <option key={d._id} value={d._id} className="bg-zinc-900 text-white">{d.displayName || d.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="text-xs text-zinc-400 font-bold">
            Showing <span className="text-white font-black">{products.length}</span> Results
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1650px] mx-auto px-4 md:px-8 py-12 md:py-16">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] bg-zinc-900 animate-pulse rounded-3xl border border-zinc-800" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-zinc-950 rounded-[3rem] border border-zinc-800">
            <div className="text-5xl mb-6">✨</div>
            <h3 className="text-3xl font-display font-bold mb-3 text-white">No Products Yet</h3>
            <p className="text-zinc-500 text-sm">We are actively adding new designs to this collection.</p>
            <Link to="/products" className="inline-block mt-6 px-8 py-3 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors">
              Explore All Designs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
