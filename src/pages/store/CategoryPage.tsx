import React from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useParams, useSearchParams } from "react-router-dom"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { productApi, catalogApi } from "../../lib/api"
import { getImageUrl } from "../../lib/utils"
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
    // If brand changes, reset model
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

  // Find selected brand slug for fetching devices
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
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Editorial Category Header */}
      <section className="relative h-[60vh] min-h-[400px] w-full bg-black overflow-hidden flex items-end justify-start pb-16 px-4 md:px-16">
        <Link to="/products" className="absolute top-8 left-4 md:left-16 z-20 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition-colors text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" /> All Collections
        </Link>
        
        {/* Massive Background Image */}
        <div className="absolute inset-0">
          {category?.image ? (
            <img 
              src={getImageUrl(category.image)} 
              alt={category?.name || "Category"} 
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
          )}
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold tracking-widest text-[10px] uppercase mb-6 border border-white/20">
            {products.length} Products
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-4 tracking-tighter text-white">
            {category?.name || "Collection"}
          </h1>
          {category?.description && (
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl font-medium tracking-tight">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Top Level Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">Filter By:</span>
            
            <div className="relative w-full md:w-48">
              <select 
                value={selectedBrand} 
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-black/5 hover:border-gray-300 transition-colors"
              >
                <option value="">All Brands</option>
                {brands.map((brand: any) => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative w-full md:w-48">
              <select 
                value={selectedModel} 
                onChange={(e) => handleFilterChange("model", e.target.value)}
                disabled={!selectedBrand}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-black/5 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Models</option>
                {devices.map((device: any) => (
                  <option key={device._id} value={device._id}>{device.displayName}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="text-sm text-gray-500 font-medium">
            Showing <span className="text-black">{products.length}</span> results
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-[9/16] rounded-[2rem]" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100">
            <div className="text-5xl mb-6">✨</div>
            <h3 className="text-3xl font-display font-bold mb-3">No products yet</h3>
            <p className="text-gray-500 text-lg">We are crafting new designs for this collection.</p>
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16"
          >
            {products.map((product: any) => (
              <motion.div 
                key={product._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 10 } }
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
