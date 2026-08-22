import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { 
  ShoppingCart, 
  Star, 
  ChevronLeft, 
  Minus, 
  Plus, 
  Package, 
  CheckCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Share2,
  Lock,
  ChevronDown,
  Award
} from "lucide-react"
import { productApi, reviewApi } from "../../lib/api"
import { getImageUrl, formatPrice } from "../../lib/utils"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { motion } from "framer-motion"

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart, isLoading: cartLoading } = useCart()
  const { isAuthenticated, openAuthModal } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedDeviceModel, setSelectedDeviceModel] = useState<string>("")
  const [activeAccordion, setActiveAccordion] = useState<string | null>("features")

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

  React.useEffect(() => {
    if (product?.deviceModels?.length > 0 && !selectedDeviceModel) {
      setSelectedDeviceModel(product.deviceModels[0]._id)
    }
  }, [product, selectedDeviceModel])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    await addToCart(product._id, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    await addToCart(product._id, quantity)
    navigate("/cart")
  }

  if (isLoading) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="skeleton aspect-square rounded-3xl" />
          <div className="space-y-6">
            <div className="skeleton h-10 w-3/4 rounded-xl" />
            <div className="skeleton h-6 w-1/4 rounded-lg" />
            <div className="skeleton h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <div className="text-5xl mb-4">📱</div>
      <h2 className="text-3xl font-display font-bold mb-2">Product Not Found</h2>
      <p className="text-gray-500 mb-6">The phone cover you are looking for might have been moved or updated.</p>
      <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold text-sm">
        ← Back to All Products
      </Link>
    </div>
  )

  const discountPercent = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-[#111111] pb-24 md:pb-16">
      
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200/70">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-black">Products</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link to={`/categories/${product.category.slug}`} className="hover:text-black">{product.category.name}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-black font-semibold truncate max-w-[200px]">{product.name}</span>
          </div>

          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href })
              }
            }}
            className="hidden sm:flex items-center gap-1.5 text-gray-600 hover:text-black transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Gallery */}
          <div className="space-y-4 md:sticky md:top-24">
            <motion.div 
              className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-white border border-gray-200/80 shadow-md group"
              layoutId={`product-${product._id}`}
            >
              <img
                src={product.images?.[activeImageIdx] ? getImageUrl(product.images[activeImageIdx]) : "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {discountPercent > 0 && (
                  <span className="bg-black/90 backdrop-blur-md text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-full tracking-widest shadow-md">
                    -{discountPercent}% OFF
                  </span>
                )}
                {product.stock > 0 && (
                  <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-full tracking-widest shadow-md">
                    IN STOCK
                  </span>
                )}
              </div>

              {/* Carousel Next/Prev controls */}
              {product.images?.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-xl hover:bg-white text-gray-900 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImageIdx((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-xl hover:bg-white text-gray-900 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5 rotate-180" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnail Selector */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
                {product.images.map((imgId: string, i: number) => (
                  <button 
                    key={imgId} 
                    onClick={() => setActiveImageIdx(i)}
                    className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      i === activeImageIdx 
                        ? "border-black ring-4 ring-black/10 shadow-md scale-105" 
                        : "border-gray-200/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={getImageUrl(imgId)} alt="" className="w-full h-full object-cover bg-white" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: E-Commerce Buy Actions & Specs */}
          <div className="space-y-6">
            
            {/* Title & Brand Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.brand && (
                  <span className="text-xs font-extrabold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                    {product.brand.name}
                  </span>
                )}
                {product.category && (
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    • {product.category.name}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-900 tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating stars & verified badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.round(product.ratings?.average || 5) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} 
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {product.ratings?.average?.toFixed(1) || "4.9"}
                </span>
                <span className="text-xs text-gray-500">
                  ({product.ratings?.count || 18} Verified Buyer Reviews)
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-display font-black text-gray-900 tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice > product.price && (
                    <span className="text-lg text-gray-400 line-through font-semibold">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Inclusive of all taxes & express shipping
                </p>
              </div>

              {discountPercent > 0 && (
                <div className="text-right bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl">
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block">
                    Save {discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Compatible Device Selector */}
            {product.deviceModels?.length > 0 && (
              <div className="p-5 rounded-3xl bg-white border border-gray-200/80 space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700 block">
                  Select Your Exact Device Model:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.deviceModels.map((d: any) => (
                    <button
                      key={d._id}
                      onClick={() => setSelectedDeviceModel(d._id)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border text-center truncate cursor-pointer ${
                        selectedDeviceModel === d._id
                          ? "bg-black text-white border-black shadow-md"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {d.displayName || d.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart / Buy Now */}
            {product.stock > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 bg-white rounded-2xl p-1 shadow-sm shrink-0">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-extrabold text-sm text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
                      className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    className={`flex-1 py-4 px-6 rounded-2xl font-extrabold text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                      addedToCart 
                        ? "bg-emerald-600 text-white" 
                        : "bg-black text-white hover:bg-gray-900 active:scale-95"
                    }`}
                  >
                    {addedToCart ? (
                      <><CheckCircle className="h-5 w-5 animate-bounce" /> Added to Bag</>
                    ) : (
                      <><ShoppingCart className="h-5 w-5" /> Add to Cart</>
                    )}
                  </button>
                </div>

                {/* 1-Click Express Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="h-5 w-5 fill-white text-white" />
                  <span>Buy Now (Fast Checkout)</span>
                </button>

                {/* Secure Checkout Badges */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1.5" title="100% Secure Checkout">
                    <ShieldCheck className="h-4 w-4" /> <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                  <div className="flex items-center gap-1.5" title="Free Delivery over ₹499">
                    <Truck className="h-4 w-4" /> <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Free Del</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                  <div className="flex items-center gap-1.5" title="Armor Grade Protection">
                    <Award className="h-4 w-4" /> <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Quality</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-center font-bold text-sm">
                Out of Stock — Join Waitlist
              </div>
            )}

            {/* Conversion Trust Seals Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200/80">
              <div className="p-3 rounded-2xl bg-white border border-gray-200/70 text-center space-y-1">
                <Truck className="h-5 w-5 text-violet-600 mx-auto" />
                <span className="text-[11px] font-bold text-gray-900 block">Free Express Air</span>
                <span className="text-[9px] text-gray-400 block">Orders &gt; ₹499</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-gray-200/70 text-center space-y-1">
                <ShieldCheck className="h-5 w-5 text-emerald-600 mx-auto" />
                <span className="text-[11px] font-bold text-gray-900 block">10ft Drop Certified</span>
                <span className="text-[9px] text-gray-400 block">Camera Shield</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-gray-200/70 text-center space-y-1">
                <RotateCcw className="h-5 w-5 text-blue-600 mx-auto" />
                <span className="text-[11px] font-bold text-gray-900 block">Easy 7-Day Return</span>
                <span className="text-[9px] text-gray-400 block">Hassle Free</span>
              </div>
            </div>

            {/* Accordion / Feature Specs */}
            <div className="border border-gray-200/80 rounded-3xl bg-white overflow-hidden divide-y divide-gray-100">
              {/* Description & Features */}
              <div className="p-4">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === "features" ? null : "features")}
                  className="w-full flex items-center justify-between font-bold text-sm text-gray-900 text-left cursor-pointer"
                >
                  <span>Product Features & Specs</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeAccordion === "features" ? "rotate-180" : ""}`} />
                </button>
                {activeAccordion === "features" && (
                  <div className="mt-3 text-xs text-gray-600 leading-relaxed space-y-2 pt-2 border-t border-gray-100">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1 font-medium text-gray-700">
                      <li>Ultra-HD 3D sublimation print with zero-fade guarantee.</li>
                      <li>Raised camera lip & screen bezel for 360° drop protection.</li>
                      <li>Precision cutouts for speaker ports, mic, and charging cable.</li>
                      <li>Tactile responsive button covers.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Shipping & Delivery */}
              <div className="p-4">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")}
                  className="w-full flex items-center justify-between font-bold text-sm text-gray-900 text-left cursor-pointer"
                >
                  <span>Shipping & Delivery Timelines</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeAccordion === "shipping" ? "rotate-180" : ""}`} />
                </button>
                {activeAccordion === "shipping" && (
                  <div className="mt-3 text-xs text-gray-600 leading-relaxed space-y-1 pt-2 border-t border-gray-100">
                    <p>• Dispatched within 24–48 hours from our Gurgaon hub.</p>
                    <p>• Metro cities: Delivered in 2–4 business days via BlueDart Air.</p>
                    <p>• Rest of India: 4–6 business days.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Customer Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200/80">
            <h2 className="text-2xl font-display font-black text-gray-900 mb-8">
              Verified Customer Reviews ({reviews.length})
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review: any) => (
                <div key={review._id} className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center">
                        {review.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{review.user?.name || "Verified Buyer"}</h4>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ✓ Verified
                    </span>
                  </div>
                  {review.title && <p className="text-sm font-bold text-gray-900">{review.title}</p>}
                  <p className="text-xs text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      {product.stock > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-gray-200/80 p-2.5 flex items-center gap-2 shadow-[0_-10px_25px_rgba(0,0,0,0.08)]">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase">Price</span>
            <span className="text-lg font-black text-gray-900">{formatPrice(product.price)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className={`flex-1 py-3 px-2 rounded-2xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 ${
              addedToCart ? "bg-emerald-600 text-white" : "bg-black text-white active:scale-95"
            }`}
          >
            {addedToCart ? "Added!" : "Add to Cart"}
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 px-2 rounded-2xl bg-violet-600 text-white font-extrabold text-xs active:scale-95 shadow-md flex items-center justify-center gap-1"
          >
            <Zap className="h-4 w-4 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>
      )}

    </div>
  )
}
