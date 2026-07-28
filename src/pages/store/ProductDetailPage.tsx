import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ShoppingCart, Star, ChevronLeft, Minus, Plus, Package, CheckCircle } from "lucide-react"
import { productApi, reviewApi } from "../../lib/api"
import { getImageUrl, formatPrice } from "../../lib/utils"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { motion } from "framer-motion"

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart, isLoading: cartLoading } = useCart()
  const { isAuthenticated } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productApi.getBySlug(slug!),
    enabled: !!slug,
  })

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", data?.data?.data?._id],
    queryFn: () => reviewApi.getForProduct(data?.data?.data?._id),
    enabled: !!data?.data?.data?._id,
  })

  const product = data?.data?.data
  const reviews = reviewsData?.data?.data || []

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate("/login"); return }
    await addToCart(product._id, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-6 w-1/4 rounded" />
            <div className="skeleton h-24 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h2 className="text-2xl font-bold mb-4">Product not found</h2>
      <Link to="/products" className="text-primary hover:underline">← Back to products</Link>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <motion.div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 shadow-sm group" layoutId={`product-${product._id}`}>
            <img
              src={product.images?.[activeImageIdx] ? getImageUrl(product.images[activeImageIdx]) : "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.images?.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow hover:bg-white text-gray-800 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setActiveImageIdx((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow hover:bg-white text-gray-800 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                >
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </button>
              </>
            )}
          </motion.div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
              {product.images.map((imgId: string, i: number) => (
                <button key={imgId} onClick={() => setActiveImageIdx(i)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === activeImageIdx ? "border-violet-600 ring-2 ring-violet-200 shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={getImageUrl(imgId)} alt="" className="w-full h-full object-cover bg-gray-50" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to={`/products?brand=${product.brand?._id}`} className="text-xs text-muted-foreground hover:text-primary">{product.brand?.name}</Link>
              <span className="text-muted-foreground">·</span>
              <Link to={`/categories/${product.category?.slug}`} className="text-xs text-muted-foreground hover:text-primary">{product.category?.name}</Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.ratings?.average || 0) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.ratings?.average?.toFixed(1) || "0"} ({product.ratings?.count || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-black">{formatPrice(product.price)}</span>
              {product.comparePrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stock */}
          <div className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            <Package className="h-3.5 w-3.5" />
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </div>

          {/* Compatible devices */}
          {product.deviceModels?.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Compatible with:</p>
              <div className="flex flex-wrap gap-2">
                {product.deviceModels.map((d: any) => (
                  <span key={d._id} className="text-xs px-2.5 py-1 rounded-full border bg-muted">{d.displayName}</span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-muted transition-colors"><Minus className="h-4 w-4" /></button>
                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 hover:bg-muted transition-colors"><Plus className="h-4 w-4" /></button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${addedToCart ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
              >
                {addedToCart ? <><CheckCircle className="h-4 w-4" /> Added!</> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
              </button>
            </div>
          )}

          {/* Description */}
          <div className="border-t pt-5">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((review: any) => (
              <div key={review._id} className="p-4 rounded-2xl border bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                    {review.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.user?.name}</p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {review.title && <p className="text-sm font-semibold mb-1">{review.title}</p>}
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
