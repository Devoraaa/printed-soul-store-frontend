import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
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
    if (product.stock > 0) {
      await addToCart(product._id)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-30px" }} 
      transition={{ duration: 0.4 }}
      className={`group relative flex flex-col ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with luxury border and hover zoom */}
      <div className="relative overflow-hidden rounded-[2.2rem] bg-gray-50 p-2 border border-gray-200/80 shadow-sm transition-all duration-500 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] group-hover:border-gray-300">
        <Link to={`/products/${product.slug}`} className="relative block overflow-hidden rounded-[1.8rem] aspect-[4/5] bg-white">
          {/* Primary Image */}
          <img
            src={primaryImage}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered && product.images?.length > 1 ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* Secondary Image (Hover view) */}
          {product.images?.length > 1 && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Luxury Floating Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
            {discountPercent > 0 ? (
              <span className="bg-black/90 backdrop-blur-md text-white text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-widest shadow-md">
                -{discountPercent}% OFF
              </span>
            ) : <span />}

            {product.isFeatured && (
              <span className="bg-amber-400 text-black text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider shadow-md">
                ★ FEATURED
              </span>
            )}
          </div>

          {/* Sold Out Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
              <span className="bg-white text-black text-xs uppercase font-black px-5 py-2.5 rounded-full tracking-widest shadow-2xl">
                Sold Out
              </span>
            </div>
          )}

          {/* Quick Action Floating Bar on Hover */}
          <div className={`absolute bottom-3 left-3 right-3 flex items-center gap-2 transition-all duration-300 z-20 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
          }`}>
            <button
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xl cursor-pointer ${
                added 
                  ? "bg-emerald-600 text-white" 
                  : "bg-black text-white hover:bg-gray-800 active:scale-95"
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

      {/* Info Details */}
      <div className="flex flex-col flex-1 px-1.5 pt-3.5 pb-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Link 
            to={`/products/${product.slug}`} 
            className="font-display font-bold text-[15px] text-gray-900 tracking-tight line-clamp-1 hover:text-violet-600 transition-colors"
          >
            {product.name}
          </Link>
        </div>

        {/* Rating stars & verified badge */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < Math.round(product.ratings?.average || 5) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} 
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-500 font-semibold tracking-tight">
            ({product.ratings?.count || 14})
          </span>
          <span className="text-[9px] text-emerald-700 font-black bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 ml-auto">
            ✓ Verified
          </span>
        </div>

        {/* Price & Savings */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-display font-black text-lg text-gray-900 tracking-tight">
            ₹{formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-gray-400 line-through text-xs font-semibold tracking-tight">
              ₹{formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
