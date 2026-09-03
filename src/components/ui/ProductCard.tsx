import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Star, ShoppingBag, Check } from "lucide-react"
import { getImageUrl, formatPrice } from "../../lib/utils"
import { useCart } from "../../context/CartContext"

interface ProductCardProps {
  product: any
  className?: string
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [added, setAdded] = useState(false)

  const primaryImage = product.images?.[0] ? getImageUrl(product.images[0]) : "/placeholder.png"
  const secondaryImage = product.images?.[1] ? getImageUrl(product.images[1]) : primaryImage

  const discountPercent = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock > 0) {
      await addToCart(product._id)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  return (
    <div
      className={`group flex flex-col w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Box */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F9F9F9] border border-neutral-200/60 transition-all duration-200 group-hover:shadow-md flex items-center justify-center">
        <Link to={`/products/${product.slug}`} className="relative block w-full h-full p-2.5 flex items-center justify-center">
          {/* Primary Image */}
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-contain transition-all duration-300 ${
              isHovered && product.images?.length > 1 ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
          />

          {/* Hover Image */}
          {product.images?.length > 1 && (
            <img
              src={secondaryImage}
              alt={`${product.name} alt`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-contain p-2.5 transition-all duration-300 ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
            {discountPercent > 0 && (
              <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm shadow">
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-amber-400 text-black text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm shadow">
                ★ Featured
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-20">
              <span className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Add Button — appears on hover */}
          <div className="hidden md:block absolute bottom-0 left-0 right-0 z-20 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <button
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              className={`w-full py-2.5 font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              {added ? (
                <><Check className="h-3.5 w-3.5" /> Added</>
              ) : (
                <><ShoppingBag className="h-3.5 w-3.5" /> Quick Add</>
              )}
            </button>
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col pt-2 pb-1 gap-0.5">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400 truncate">
          {product.category?.name || ""}
        </span>

        <Link
          to={`/products/${product.slug}`}
          className="font-semibold text-[12px] leading-tight text-neutral-900 line-clamp-2 hover:text-neutral-600 transition-colors"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-neutral-400 line-through text-[11px]">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 text-[10px] font-semibold text-neutral-500">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            <span>{(product.ratings?.average || 4.9).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
