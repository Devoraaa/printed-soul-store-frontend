import React from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, Shield, Layers, Smartphone, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react"
import { productApi, catalogApi } from "../../lib/api"
import { getImageUrl, formatPrice } from "../../lib/utils"

export interface HoverCategoryItem {
  type: "category" | "new" | "all"
  _id?: string
  name: string
  slug?: string
  description?: string
  subcategories?: { name: string; slug: string }[]
}

interface CategoryHoverMenuProps {
  isOpen: boolean
  activeCategory: HoverCategoryItem | null
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClose: () => void
}

export function CategoryHoverMenu({
  isOpen,
  activeCategory,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: CategoryHoverMenuProps) {
  // Fetch latest products
  const { data: productsData } = useQuery({
    queryKey: ["navbar-latest-products"],
    queryFn: () => productApi.getAll({ limit: 40, sort: "-createdAt" }),
    staleTime: 5 * 60 * 1000,
  })

  // Fetch brands
  const { data: brandsData } = useQuery({
    queryKey: ["catalog-brands"],
    queryFn: () => catalogApi.getBrands(),
    staleTime: 60 * 60 * 1000,
  })

  const allProducts: any[] = productsData?.data?.data || []
  const brands: any[] = brandsData?.data?.data || [
    { _id: "1", name: "Apple", slug: "apple" },
    { _id: "2", name: "Samsung", slug: "samsung" },
    { _id: "3", name: "Vivo", slug: "vivo" },
    { _id: "4", name: "Oppo", slug: "oppo" },
    { _id: "5", name: "Xiaomi", slug: "xiaomi" },
  ]

  if (!isOpen || !activeCategory) return null

  const isCovers =
    activeCategory.slug === "covers" ||
    activeCategory.name?.toLowerCase().includes("cover")

  // Filter 1-2 products for visual preview
  const getFilteredProducts = () => {
    if (!allProducts.length) return []
    const catId = String(activeCategory._id || "").toLowerCase()
    const catSlug = String(activeCategory.slug || "").toLowerCase()

    if (activeCategory.type === "new" || catSlug === "new") {
      return allProducts.slice(0, 3)
    }
    if (activeCategory.type === "all" || catSlug === "all") {
      return allProducts.slice(0, 3)
    }

    if (isCovers) {
      const covers = allProducts.filter((p: any) => {
        const pSlug = String(p.category?.slug || p.category?.name || p.caseType || "").toLowerCase()
        return (
          pSlug.includes("cover") ||
          pSlug.includes("dual") ||
          pSlug.includes("glass") ||
          pSlug.includes("metal")
        )
      })
      return (covers.length ? covers : allProducts).slice(0, 2)
    }

    const matches = allProducts.filter((p: any) => {
      const pCatId = String(p.category?._id || p.category || "").toLowerCase()
      const pCatSlug = String(p.category?.slug || "").toLowerCase()
      const pCatName = String(p.category?.name || "").toLowerCase()
      return pCatId === catId || pCatSlug === catSlug || pCatName === catSlug
    })

    return (matches.length ? matches : allProducts).slice(0, 3)
  }

  const previewProducts = getFilteredProducts()

  return (
    <AnimatePresence>
      <motion.div
        key="hover-panel"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute top-full left-0 right-0 z-40 px-4 pt-1 pointer-events-auto"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Transparent click-away layer (no black screen dimming) */}
        <div className="fixed inset-0 top-[60px] -z-10" onClick={onClose} />

        {/* ── Compact Floating Card (Max width ~880px, NOT 100vw full screen) ── */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border-2 border-black shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-5 overflow-hidden">
          {isCovers ? (
            /* ══════════════════════════════════════════════════════════════════
               COMPACT COVERS DROPDOWN (Materials + Brands + Mini Preview)
               ══════════════════════════════════════════════════════════════════ */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Column 1: Materials / Series (5 cols) */}
              <div className="md:col-span-5 pr-2 md:border-r border-gray-100">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                    Case Series
                  </span>
                  <span className="text-xs font-bold text-gray-800">Materials & Types</span>
                </div>

                <div className="space-y-1.5">
                  <Link
                    to="/products?category=covers&subCategory=dual-case"
                    onClick={onClose}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900 group-hover:text-emerald-700 flex items-center gap-1">
                        <span>Dual Protection</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">10FT DROP</span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1">Shock-absorbing core & raised bezels</p>
                    </div>
                  </Link>

                  <Link
                    to="/products?category=covers&subCategory=glass-case"
                    onClick={onClose}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900 group-hover:text-amber-700 flex items-center gap-1">
                        <span>Toughened Glass</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">9H GLOSS</span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1">Scratch-proof optical glass with vibrant 3D pop</p>
                    </div>
                  </Link>

                  <Link
                    to="/products?category=covers&subCategory=metal-case"
                    onClick={onClose}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900 group-hover:text-blue-700 flex items-center gap-1">
                        <span>Metal Armor</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">MATTE</span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1">Brushed metallic finish with polycarbonate back</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Column 2: Popular Brands (4 cols) */}
              <div className="md:col-span-4 pr-2 md:border-r border-gray-100">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-black bg-neutral-100 px-2 py-0.5 rounded-md">
                    Brands
                  </span>
                  <span className="text-xs font-bold text-gray-800">Shop By Device</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {brands.map((brand: any) => (
                    <Link
                      key={brand._id || brand.slug}
                      to={`/products?category=covers&brand=${brand.slug || brand.name.toLowerCase()}`}
                      onClick={onClose}
                      className="p-2 rounded-lg border border-gray-100 hover:border-black hover:bg-black hover:text-white transition-all text-xs font-bold text-gray-700 flex items-center justify-between group"
                    >
                      <span>{brand.name}</span>
                      <ChevronRight className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Link
                    to="/covers-hub"
                    onClick={onClose}
                    className="text-[11px] font-extrabold text-violet-600 hover:underline flex items-center gap-1"
                  >
                    <span>View Materials & Protection Hub</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Column 3: Featured Preview Card (3 cols) */}
              <div className="md:col-span-3 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                    Trending Design
                  </div>
                  {previewProducts[0] ? (
                    <Link
                      to={`/products/${previewProducts[0].slug || previewProducts[0]._id}`}
                      onClick={onClose}
                      className="block group rounded-xl border border-gray-200 p-2 hover:border-black transition-all bg-[#FAFAFA]"
                    >
                      <div className="aspect-square rounded-lg bg-white overflow-hidden p-1 mb-2 flex items-center justify-center border border-gray-100">
                        <img
                          src={getImageUrl(previewProducts[0].images?.[0]) || "/small.webp"}
                          alt={previewProducts[0].name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/small.webp"
                          }}
                        />
                      </div>
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {previewProducts[0].name}
                      </div>
                      <div className="text-xs font-black text-black">
                        {formatPrice(previewProducts[0].price || 499)}
                      </div>
                    </Link>
                  ) : null}
                </div>

                <Link
                  to="/products?category=covers"
                  onClick={onClose}
                  className="mt-3 w-full py-2 bg-black text-white text-[11px] font-black rounded-lg text-center hover:bg-neutral-800 transition-all flex items-center justify-center gap-1"
                >
                  <span>Explore All Covers</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════════════
               COMPACT FLYOUT FOR OTHER CATEGORIES (Frames, Mugs, Tumblers, etc.)
               ══════════════════════════════════════════════════════════════════ */
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-900 tracking-tight">
                    {activeCategory.name} Collection
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">
                    Latest additions
                  </span>
                </div>
                <Link
                  to={
                    activeCategory.type === "new" || activeCategory.slug === "new"
                      ? "/products?sort=new"
                      : activeCategory.type === "all" || activeCategory.slug === "all"
                      ? "/products"
                      : `/products?category=${activeCategory.slug || activeCategory._id}`
                  }
                  onClick={onClose}
                  className="text-xs font-black text-black hover:text-violet-600 flex items-center gap-1 uppercase"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {previewProducts.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {previewProducts.map((p: any) => (
                    <Link
                      key={p._id || p.id}
                      to={`/products/${p.slug || p._id}`}
                      onClick={onClose}
                      className="group flex items-center gap-2.5 p-2 rounded-xl border border-gray-100 hover:border-black transition-all bg-[#FAFAFA]"
                    >
                      <div className="h-12 w-12 rounded-lg bg-white p-1 border border-gray-100 shrink-0 flex items-center justify-center">
                        <img
                          src={getImageUrl(p.images?.[0]) || "/small.webp"}
                          alt={p.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/small.webp"
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-gray-900 truncate group-hover:text-violet-600">
                          {p.name}
                        </div>
                        <div className="text-[11px] font-black text-black">
                          {formatPrice(p.price)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-gray-500 mb-2">Explore custom designs in this category</p>
                  <Link
                    to={`/products?category=${activeCategory.slug || activeCategory._id}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <span>Browse {activeCategory.name}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
