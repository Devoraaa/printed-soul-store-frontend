import React from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, Sparkles, Flame, Shield, Compass, ChevronRight } from "lucide-react"
import { productApi } from "../../lib/api"
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
  // Fetch latest products across store (cached for 5 minutes)
  const { data: productsData } = useQuery({
    queryKey: ["navbar-latest-products"],
    queryFn: () => productApi.getAll({ limit: 60, sort: "-createdAt" }),
    staleTime: 5 * 60 * 1000,
  })

  const allProducts: any[] = productsData?.data?.data || []

  if (!isOpen || !activeCategory) return null

  // Filter products for the active category
  const getFilteredProducts = () => {
    if (!allProducts.length) return []

    if (activeCategory.type === "new") {
      return allProducts.slice(0, 4)
    }

    if (activeCategory.type === "all") {
      // Top 4 featured or newest
      const featured = allProducts.filter((p: any) => p.isFeatured)
      return (featured.length >= 4 ? featured : allProducts).slice(0, 4)
    }

    const catId = String(activeCategory._id || "").toLowerCase()
    const catSlug = String(activeCategory.slug || "").toLowerCase()
    const catName = String(activeCategory.name || "").toLowerCase()

    const matches = allProducts.filter((p: any) => {
      const pCatId = String(p.category?._id || p.category || "").toLowerCase()
      const pParentCatId = (
        typeof p.category?.parentCategory === "object"
          ? String(p.category?.parentCategory?._id || "")
          : String(p.category?.parentCategory || "")
      ).toLowerCase()
      const pCatSlug = String(p.category?.slug || "").toLowerCase()
      const pCatName = String(p.category?.name || "").toLowerCase()
      const pCaseType = String(p.caseType || "").toLowerCase()

      // 1. Direct ID or slug or name match
      if (pCatId === catId || pCatSlug === catSlug || pCatName === catName) {
        return true
      }

      // 2. Covers parent category match
      if (catSlug === "covers" || catName.includes("cover")) {
        if (pParentCatId === catId) return true
        if (["dual-case", "metal-case", "glass-case", "hard-case", "soft-case"].includes(pCaseType)) {
          return true
        }
      }

      // 3. Fallbacks for coasters, mugs, tumblers, frames
      if (catSlug.includes("coaster") && (pCaseType.includes("coaster") || pCatSlug.includes("coaster"))) return true
      if (catSlug.includes("mug") && (pCaseType.includes("mug") || pCatSlug.includes("mug"))) return true
      if (catSlug.includes("tumbler") && (pCaseType.includes("tumbler") || pCatSlug.includes("tumbler"))) return true
      if (catSlug.includes("frame") && (pCaseType.includes("frame") || pCatSlug.includes("frame"))) return true

      return false
    })

    return matches.slice(0, 4)
  }

  const categoryProducts = getFilteredProducts()

  // Category Target Link
  const getCategoryLink = () => {
    if (activeCategory.type === "new") return "/products?sort=new"
    if (activeCategory.type === "all") return "/products"
    return `/products?category=${activeCategory.slug || activeCategory._id}`
  }

  // Quick Pills / Subcategories (e.g. for covers: Glass, Metal, Dual)
  const getQuickPills = () => {
    const slug = activeCategory.slug?.toLowerCase() || ""
    if (slug === "covers") {
      return [
        { label: "Glass Cases", href: "/products?category=glass-case" },
        { label: "Metal Cases", href: "/products?category=metal-case" },
        { label: "Dual Armor Cases", href: "/products?category=dual-case" },
        { label: "All Covers", href: "/products?category=covers" },
      ]
    }
    if (activeCategory.type === "new") {
      return [
        { label: "Phone Cases", href: "/products?category=covers&sort=new" },
        { label: "Drinkware", href: "/products?category=tumblers&sort=new" },
        { label: "Coffee Mugs", href: "/products?category=mugs&sort=new" },
        { label: "All New Arrivals", href: "/products?sort=new" },
      ]
    }
    return null
  }

  const quickPills = getQuickPills()

  return (
    <AnimatePresence>
      {/* ── 1. DARK BACKDROP OVERLAY (Stops menu from camouflaging with white page) ── */}
      <motion.div
        key="hover-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 top-[65px] bg-black/60 backdrop-blur-xs z-30 pointer-events-auto"
        onClick={onClose}
      />

      {/* ── 2. FLYOUT MENU PANEL (Sharp contrast & deep shadow) ── */}
      <motion.div
        key="hover-panel"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="absolute top-full left-0 right-0 w-full bg-white border-b border-neutral-300 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] z-40 overflow-hidden"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="max-w-[1700px] mx-auto px-4 md:px-8 py-7">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white text-xs font-bold shadow-xs">
                {activeCategory.type === "new" ? (
                  <Sparkles className="h-4 w-4 text-amber-400" />
                ) : (
                  <Flame className="h-4 w-4 text-rose-400" />
                )}
              </span>
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>{activeCategory.name}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-gray-700 tracking-wider">
                    Latest Photos & Products
                  </span>
                </h3>
                <p className="text-xs text-gray-500">
                  {activeCategory.type === "new"
                    ? "Freshly printed and added to our premium inventory"
                    : `Explore the newest designs and materials in our ${activeCategory.name} collection`}
                </p>
              </div>
            </div>

            {/* Quick Pills */}
            {quickPills && (
              <div className="hidden lg:flex items-center gap-1.5">
                {quickPills.map((pill) => (
                  <Link
                    key={pill.label}
                    to={pill.href}
                    onClick={onClose}
                    className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 hover:bg-black hover:text-white transition-all text-gray-700"
                  >
                    {pill.label}
                  </Link>
                ))}
              </div>
            )}

            {/* View Full Category CTA */}
            <Link
              to={getCategoryLink()}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-black hover:text-violet-700 uppercase tracking-wide group shrink-0"
            >
              <span>Explore All {activeCategory.name}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* ── Latest Products Photos Grid ── */}
          <div className="pt-6">
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {categoryProducts.map((product: any) => {
                  const hasDiscount = product.comparePrice && product.comparePrice > product.price
                  const discountPercent = hasDiscount
                    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                    : 0

                  const imageUrl =
                    product.images && product.images.length > 0
                      ? getImageUrl(product.images[0])
                      : "/small.png"

                  return (
                    <Link
                      key={product._id || product.id}
                      to={`/products/${product.slug || product._id}`}
                      onClick={onClose}
                      className="group flex flex-col bg-white rounded-2xl border border-neutral-200 hover:border-black p-3 hover:shadow-xl transition-all duration-300 relative"
                    >
                      {/* Product Photo Container — object-contain so covers are never zoomed/cropped */}
                      <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-xl overflow-hidden bg-[#F6F6F7] mb-3 border border-neutral-100 p-2.5 flex items-center justify-center">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/small.png"
                          }}
                        />

                        {/* Floating Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {hasDiscount && (
                            <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                              {discountPercent}% OFF
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Hover Overlay Button */}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                          <span className="w-full py-1.5 rounded-lg bg-white/95 text-black font-bold text-[11px] text-center shadow-md backdrop-blur-xs flex items-center justify-center gap-1">
                            <span>View Product</span>
                            <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-col flex-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 line-clamp-1">
                          {product.category?.name || activeCategory.name}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-black line-clamp-1 mb-1.5 transition-colors">
                          {product.name}
                        </h4>

                        <div className="mt-auto flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.comparePrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              /* Fallback banner if category products are still loading or empty */
              <div className="py-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                <Compass className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-bounce" />
                <p className="font-bold text-sm text-gray-800">Fresh Designs Incoming!</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  New custom products for {activeCategory.name} are being printed daily.
                </p>
                <Link
                  to={getCategoryLink()}
                  onClick={onClose}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-all"
                >
                  <span>Browse {activeCategory.name} Collection</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
