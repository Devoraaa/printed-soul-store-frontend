import React from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, Sparkles } from "lucide-react"
import { productApi, catalogApi } from "../../lib/api"
import { ProductCard } from "../../components/ui/ProductCard"
import { SEO } from "../../components/ui/SEO"

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

  const isPhoneCategory = category?.slug?.match(/case|cover|glass|armor|silicone|phone/i) || category?.name?.match(/case|cover|glass|armor|silicone|phone/i);
  const catTitle = category?.name || slug || "Collection"

  const categoryStructuredData = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://printedsoul.in/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Collections",
          "item": "https://printedsoul.in/products"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": catTitle,
          "item": `https://printedsoul.in/categories/${slug}`
        }
      ]
    },
    {
      "@type": "CollectionPage",
      "name": `${catTitle} Collection`,
      "description": category?.description || `Explore our premium ${catTitle} at Printed Soul.`,
      "url": `https://printedsoul.in/categories/${slug}`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": products.slice(0, 12).map((p: any, idx: number) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "url": `https://printedsoul.in/products/${p.slug || p._id}`,
          "name": p.name
        }))
      }
    }
  ]

  return (
    <div className="bg-[#F4EFEA] min-h-screen text-neutral-900 antialiased selection:bg-black selection:text-white pb-16">
      <SEO
        title={`${catTitle} Collection`}
        description={category?.description || `Explore our premium ${catTitle} collection at Printed Soul. Expertly crafted with precision and style. Free shipping above ₹499.`}
        keywords={[catTitle, `${catTitle} online`, "custom phone cases", "Printed Soul", "buy online india"]}
        canonicalUrl={`https://printedsoul.in/categories/${slug}`}
        structuredData={categoryStructuredData}
      />
      
      {/* Clean SEO-friendly Category Header */}
      <div className="bg-white/80 border-b border-black/[0.05] backdrop-blur-md">
        <div className="max-w-[1650px] mx-auto px-4 md:px-8 py-8 md:py-12">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-5">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-black transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-neutral-900 font-bold capitalize">{category?.name || slug}</span>
          </nav>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-600 uppercase bg-neutral-100 px-3 py-1 rounded-full border border-black/[0.05]">
                Curated Collection
              </span>
              <span className="text-xs font-semibold text-neutral-500">
                • {products.length} Designs Available
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-neutral-900 capitalize mb-3">
              {category?.name || slug} {!isPhoneCategory && !category?.name?.toLowerCase().includes("collection") ? "Collection" : ""}
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              {category?.description || `Explore our premium ${category?.name || slug}. Expertly crafted with precision and style.`}
            </p>
          </div>

        </div>
      </div>

      {/* Sticky Quick Filters Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-black/[0.05] sticky top-16 z-30 shadow-xs">
        <div className="max-w-[1650px] mx-auto px-4 md:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {isPhoneCategory ? (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                Filter:
              </span>
              
              {/* Brand Select */}
              <div className="relative w-full sm:w-48">
                <select 
                  value={selectedBrand} 
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="w-full appearance-none bg-neutral-100/70 border border-black/[0.06] text-xs font-semibold rounded-full px-4 py-2 pr-9 text-neutral-900 focus:outline-none focus:border-black transition-colors cursor-pointer"
                >
                  <option value="">All Brands</option>
                  {brands.map((b: any) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
              </div>

              {/* Model Select */}
              <div className="relative w-full sm:w-48">
                <select 
                  value={selectedModel} 
                  onChange={(e) => handleFilterChange("model", e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full appearance-none bg-neutral-100/70 border border-black/[0.06] text-xs font-semibold rounded-full px-4 py-2 pr-9 text-neutral-900 focus:outline-none focus:border-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Models</option>
                  {devices.map((d: any) => (
                    <option key={d._id} value={d._id}>{d.displayName || d.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Viewing Entire Collection
              </span>
            </div>
          )}
          
          <div className="text-xs text-neutral-500 font-medium">
            Showing <span className="text-neutral-900 font-bold">{products.length}</span> Results
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1650px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-neutral-200/50 animate-pulse rounded-2xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-28 bg-white rounded-3xl border border-black/[0.05] shadow-sm max-w-2xl mx-auto p-8">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-display font-bold mb-2 text-neutral-900">No Products Yet</h3>
            <p className="text-neutral-500 text-xs mb-6">We are actively adding new designs to this collection.</p>
            <Link to="/products" className="inline-block px-7 py-3 rounded-full bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors shadow-sm">
              Explore All Designs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
