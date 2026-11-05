import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Star, ShoppingBag, Check, Plus, Heart } from "lucide-react"
import { getImageUrl, formatPrice } from "../../lib/utils"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useWishlist } from "../../context/WishlistContext"

interface ProductCardProps {
  product: any
  className?: string
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addToCart } = useCart()
  const { isAuthenticated, openAuthModal } = useAuth()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [isHovered, setIsHovered] = useState(false)
  const [added, setAdded] = useState(false)

  const isWishlisted = isInWishlist(product._id)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  const primaryImage = product.images?.[0] ? getImageUrl(product.images[0]) : "/placeholder.png"
  const secondaryImage = product.images?.[1] ? getImageUrl(product.images[1]) : primaryImage

  const discountPercent = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    if (product.stock > 0) {
      await addToCart(product._id)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  return (
    <div
      className={`group flex flex-col w-full transition-all duration-300 hover:-translate-y-1 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Box */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#F8F5F0] border border-black/[0.06] transition-all duration-300 group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] group-hover:border-black/15">
        <Link to={`/products/${product.slug}`} className="relative block w-full h-full overflow-hidden">
          {/* Primary Image */}
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-500 ease-out ${
              isHovered && product.images?.length > 1 ? "opacity-0 scale-105" : "opacity-100 scale-100 group-hover:scale-105"
            }`}
          />

          {/* Hover Image */}
          {product.images?.length > 1 && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            {discountPercent > 0 && (
              <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm shadow-rose-500/20">
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm shadow-amber-500/20">
                ★ Featured
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-2.5 right-2.5 z-20 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer ${
              isWishlisted
                ? "shadow-[0_2px_12px_rgba(244,63,94,0.35)] text-rose-500"
                : "text-neutral-700 hover:text-rose-600 shadow-xs"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
                isWishlisted ? "fill-rose-500 text-rose-500" : "text-neutral-700"
              }`}
            />
          </button>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm">
                Out of Stock
              </span>
            </div>
          )}

          {/* Mobile Quick Add (Floating Circle) */}
          {product.stock > 0 && (
            <button
              onClick={handleQuickAdd}
              aria-label="Quick add to cart"
              className={`md:hidden absolute bottom-2.5 right-2.5 z-20 h-8 w-8 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all cursor-pointer ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-900/90 text-[#F4EFEA] backdrop-blur-md"
              }`}
            >
              {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          )}

          {/* Desktop Quick Add Button — floating pill on hover */}
          <div className="hidden md:block absolute bottom-2.5 left-2.5 right-2.5 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <button
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              className={`w-full py-2.5 px-3 font-bold text-[10px] uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-95 ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-900/90 hover:bg-black text-[#F4EFEA] backdrop-blur-md"
              }`}
            >
              {added ? (
                <><Check className="h-3.5 w-3.5" /> Added to Cart</>
              ) : (
                <><ShoppingBag className="h-3.5 w-3.5" /> Quick Add</>
              )}
            </button>
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col pt-2 pb-1 px-0.5 gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 truncate">
          {product.category?.name || "Printed Soul"}
        </span>

        <Link
          to={`/products/${product.slug}`}
          className="font-bold text-[13px] sm:text-[14px] leading-snug text-neutral-900 line-clamp-1 hover:text-neutral-600 transition-colors"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-sm sm:text-[15px] text-neutral-900 tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-neutral-400 line-through text-[11px] sm:text-xs">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {product.ratings?.count && product.ratings.count > 0 ? (
            <div className="flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded-full shadow-2xs">
              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
              <span>{product.ratings.average.toFixed(1)}</span>
            </div>
          ) : (
            <div className="flex items-center text-[9px] font-black text-emerald-800 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-2xs">
              ★ New
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
