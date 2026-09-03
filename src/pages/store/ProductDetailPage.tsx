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
import { productApi, reviewApi, catalogApi } from "../../lib/api"
import { getImageUrl, formatPrice } from "../../lib/utils"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { motion } from "framer-motion"
import { ProductCard } from "../../components/ui/ProductCard"

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

  const product = data?.data?.data
  const productCatId = typeof product?.category === "object" ? product?.category?._id : product?.category

  React.useEffect(() => {
    setActiveImageIdx(0)
    if (product?.deviceModels?.length > 0) {
      setSelectedDeviceModel(product.deviceModels[0]._id)
    }
  }, [slug, product])

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", product?._id],
    queryFn: () => reviewApi.getForProduct(product?._id),
    enabled: !!product?._id,
  })

  const { data: similarData } = useQuery({
    queryKey: ["similar-products", productCatId],
    queryFn: () => productApi.getAll({ category: productCatId, limit: 12 }),
    enabled: !!productCatId,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.getCategories(),
  })

  const { data: designVariantsData } = useQuery({
    queryKey: ["design-variants", product?.designSlug],
    queryFn: () => productApi.getDesignVariants(product?.designSlug),
    enabled: !!product?.designSlug,
  })

  const { data: allProductsData } = useQuery({
    queryKey: ["all-products-pdp"],
    queryFn: () => productApi.getAll({ limit: 40 }),
  })

  const reviews = reviewsData?.data?.data || []
  const similarProducts = (similarData?.data?.data || [])
    .filter((p: any) => p._id !== product?._id && p.images && p.images.length > 0)
    .slice(0, 5)
  
  const allCategories = categoriesData?.data?.data || []
  const allProducts = allProductsData?.data?.data || []
  
  const designVariantsInfo = designVariantsData?.data?.data || { showSwitcher: false, variants: [] }
  const { showSwitcher, variants: designVariants } = designVariantsInfo

  // Get all categories except the current one
  const remainingCategories = allCategories.filter((c: any) => c._id !== (product?.category?._id || product?.category))
  
  // Only select up to 3 categories that actually have products in our allProducts list
  const otherCategories = remainingCategories.filter((cat: any) => {
    return allProducts.some((p: any) => {
      const pCatId = typeof p.category === 'object' ? p.category?._id : p.category
      return pCatId === cat._id
    })
  }).slice(0, 3)

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

      <div className="max-w-[1700px] mx-auto px-3 md:px-6 py-4 md:py-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Gallery */}
          <div className="space-y-3 md:sticky md:top-20">
            <motion.div 
              className="relative aspect-square overflow-hidden rounded-sm bg-white border border-gray-200 group"
              layoutId={`product-${product._id}`}
            >
              <img
                src={product.images?.[activeImageIdx] ? getImageUrl(product.images[activeImageIdx]) : "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-contain p-3 md:p-6 transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                {discountPercent > 0 && (
                  <span className="bg-red-600 text-white text-[10px] uppercase font-black px-2 py-1 rounded-sm shadow-sm">
                    -{discountPercent}% OFF
                  </span>
                )}
                {product.stock > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] uppercase font-black px-2 py-1 rounded-sm shadow-sm">
                    IN STOCK
                  </span>
                )}
              </div>

              {/* Carousel Next/Prev controls */}
              {product.images?.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 border border-gray-200 shadow-sm hover:bg-white text-gray-900 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer rounded-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setActiveImageIdx((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 border border-gray-200 shadow-sm hover:bg-white text-gray-900 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer rounded-sm"
                  >
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnail Selector */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((imgId: string, i: number) => (
                  <button 
                    key={imgId} 
                    onClick={() => setActiveImageIdx(i)}
                    className={`shrink-0 w-16 md:w-20 aspect-square rounded-sm overflow-hidden border transition-all duration-300 cursor-pointer bg-white ${
                      i === activeImageIdx 
                        ? "border-black shadow-sm" 
                        : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
                    }`}
                  >
                    <img src={getImageUrl(imgId)} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: E-Commerce Buy Actions & Specs */}
          <div className="space-y-4">
            
            {/* Title & Brand Header */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                {product.brand && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-700 bg-violet-100 px-2 py-0.5 rounded-sm">
                    {product.brand.name}
                  </span>
                )}
                {product.category && (
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {product.category.name}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-2">
                {product.name}
              </h1>

              {/* Rating stars & verified badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3.5 w-3.5 ${i < Math.round(product.ratings?.average || 5) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-900">
                  {product.ratings?.average?.toFixed(1) || "4.9"}
                </span>
                <span className="text-xs text-gray-500">
                  ({product.ratings?.count || 18} Reviews)
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice > product.price && (
                    <span className="text-sm text-gray-400 line-through font-semibold">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> GST Included & Free Delivery
                </p>
              </div>

              {discountPercent > 0 && (
                <div className="text-right bg-red-50 border border-red-100 px-2 py-1 rounded-sm">
                  <span className="text-[11px] font-black text-red-700 uppercase tracking-wider block">
                    Save {discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Live Social Proof (like original website) */}
            <div className="space-y-1.5 py-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <span className="text-red-500">🔥</span>
                <span><strong className="text-black">17 sold</strong> in last 20 hours</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-gray-100 border border-gray-200 text-xs font-medium text-gray-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span><strong>15 peoples</strong> are viewing this right now</span>
              </div>
            </div>

            {/* Case Type Switcher */}
            {showSwitcher && designVariants.length > 0 && (
              <div className="p-4 rounded-sm bg-white border border-gray-200 space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 block">
                  Select Case Type:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {designVariants.map((v: any) => {
                    const CASE_LABELS: any = {
                      "dual-case": "Dual Case",
                      "metal-case": "Metal Case",
                      "glass-case": "Glass Case",
                      "hard-case": "Hard Case",
                      "soft-case": "Soft Case",
                      "wallet-case": "Wallet Case"
                    }
                    const label = CASE_LABELS[v.caseType] || v.caseType
                    const isSelected = v._id === product._id

                    return (
                      <button
                        key={v._id}
                        type="button"
                        onClick={() => {
                          if (!isSelected) {
                            setActiveImageIdx(0)
                            navigate(`/products/${v.slug}`)
                          }
                        }}
                        className={`py-2.5 px-2 text-center rounded-sm transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-black text-white border-black shadow-sm"
                            : "bg-white text-gray-800 border-gray-300 hover:border-black hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-xs font-bold leading-tight">{label}</div>
                        {v.price && (
                          <div className={`text-[11px] mt-0.5 font-semibold ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                            ₹{v.price}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Mobile Model Selection (like original website) */}
            {product.deviceModels?.length > 0 && (
              <div className="p-3.5 rounded-sm bg-white border border-gray-200 space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 block">
                  Mobile Model:
                </label>
                <div className="relative">
                  <select 
                    value={selectedDeviceModel || product.deviceModels[0]?._id}
                    onChange={(e) => setSelectedDeviceModel(e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-sm bg-gray-50 border border-gray-300 font-semibold text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black appearance-none cursor-pointer"
                  >
                    {product.deviceModels.map((m: any) => (
                      <option key={m._id} value={m._id}>
                        {(m.displayName || m.name).toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart / Buy Now */}
            {product.stock > 0 ? (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <span>🔥</span> Hurry up! Only <span className="text-red-600 font-black">10 item(s)</span> left in stock
                </div>
                <div className="flex items-center gap-2">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-300 bg-white rounded-sm h-11 shrink-0">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer border-r border-gray-300"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
                      className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer border-l border-gray-300"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    className={`flex-1 h-11 px-4 rounded-sm font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider ${
                      addedToCart 
                        ? "bg-emerald-600 text-white border border-emerald-600" 
                        : "bg-white text-black border-2 border-black hover:bg-gray-50 active:scale-95"
                    }`}
                  >
                    {addedToCart ? (
                      <><CheckCircle className="h-4 w-4 animate-bounce" /> Added</>
                    ) : (
                      <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
                    )}
                  </button>
                </div>

                {/* 1-Click Express Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full h-11 px-4 rounded-sm bg-black hover:bg-gray-900 text-white font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Zap className="h-4 w-4 fill-white" />
                  Buy Now
                </button>

                {/* Secure Checkout Badges */}
                <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between text-gray-500">
                  <div className="flex items-center gap-1" title="100% Secure Checkout">
                    <ShieldCheck className="h-3.5 w-3.5" /> <span className="text-[9px] font-black uppercase tracking-widest">Secure</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <div className="flex items-center gap-1" title="Free Delivery over ₹499">
                    <Truck className="h-3.5 w-3.5" /> <span className="text-[9px] font-black uppercase tracking-widest">Free Del</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <div className="flex items-center gap-1" title="Premium Quality">
                    <Award className="h-3.5 w-3.5" /> <span className="text-[9px] font-black uppercase tracking-widest">Premium</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-4 rounded-sm bg-gray-100 text-gray-500 border border-gray-200 text-center font-bold text-xs uppercase tracking-widest">
                Out of Stock
              </div>
            )}

            {/* Accordion / Feature Specs */}
            <div className="border border-gray-200 rounded-sm bg-white overflow-hidden divide-y divide-gray-200">
              {/* Description & Features */}
              <div className="p-3.5">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === "features" ? null : "features")}
                  className="w-full flex items-center justify-between font-black text-xs uppercase tracking-wider text-gray-900 text-left cursor-pointer"
                >
                  <span>Description & Features</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeAccordion === "features" ? "rotate-180" : ""}`} />
                </button>
                {activeAccordion === "features" && (
                  <div className="mt-3 text-xs text-gray-600 leading-relaxed space-y-2 pt-3 border-t border-gray-100">
                    {product.description?.includes("<") ? (
                      <div 
                        className="prose prose-xs max-w-none text-xs text-gray-600 leading-relaxed space-y-1 overflow-hidden" 
                        dangerouslySetInnerHTML={{ __html: product.description }} 
                      />
                    ) : (
                      <p>{product.description}</p>
                    )}
                    <ul className="list-disc pl-4 space-y-1 font-medium text-gray-700">
                      <li>Premium quality material with excellent durability.</li>
                      <li>Precise cutouts for all ports and buttons.</li>
                      <li>Shock-absorbing edges for drop protection.</li>
                      <li>Vibrant, fade-resistant print.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Shipping & Delivery */}
              <div className="p-3.5">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")}
                  className="w-full flex items-center justify-between font-black text-xs uppercase tracking-wider text-gray-900 text-left cursor-pointer"
                >
                  <span>Shipping & Delivery</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeAccordion === "shipping" ? "rotate-180" : ""}`} />
                </button>
                {activeAccordion === "shipping" && (
                  <div className="mt-3 text-xs text-gray-600 leading-relaxed space-y-1 pt-3 border-t border-gray-100 font-medium">
                    <p>• Dispatched within 24-48 hours.</p>
                    <p>• Delivered in 3-5 business days across India.</p>
                    <p>• Tracking link provided via email/SMS.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Similar Recommended Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-4">Recommended For You</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
              {similarProducts.map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">
              Reviews ({reviews.length})
            </h2>
            <button 
              onClick={() => {
                if (!isAuthenticated) openAuthModal()
                else document.getElementById("review-form")?.classList.toggle("hidden")
              }}
              className="px-4 py-2 bg-black text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Hidden by default Write Review Form */}
          <div id="review-form" className="hidden mb-8 p-4 border border-gray-200 rounded-sm bg-gray-50">
            <h3 className="font-black text-xs uppercase tracking-widest mb-3">Submit your review</h3>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const rating = parseInt(form.rating.value)
              const title = form.reviewTitle.value
              const comment = form.comment.value
              
              try {
                await reviewApi.create({ product: product._id, rating, title, comment })
                alert("Review submitted successfully! It will appear after moderation.")
                form.reset()
                document.getElementById("review-form")?.classList.add("hidden")
              } catch (error: any) {
                alert(error.response?.data?.message || "Failed to submit review")
              }
            }}>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Rating (1-5)</label>
                  <select name="rating" required className="w-full sm:w-48 p-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-black">
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Title</label>
                  <input type="text" name="reviewTitle" placeholder="Summary of your experience" className="w-full p-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Review</label>
                  <textarea name="comment" required placeholder="Tell others what you think..." rows={3} className="w-full p-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-black"></textarea>
                </div>
                <button type="submit" className="px-6 py-2.5 bg-black text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors">
                  Submit Review
                </button>
              </div>
            </form>
          </div>

          {reviews.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {reviews.map((review: any) => (
                <div key={review._id} className="p-4 rounded-sm bg-white border border-gray-200 space-y-2 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-sm bg-black text-white font-bold text-[10px] flex items-center justify-center">
                        {review.user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <h4 className="font-bold text-[11px] text-gray-900">{review.user?.name || "Verified Buyer"}</h4>
                    </div>
                    <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-100">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-2.5 w-2.5 ${i < review.rating ? "fill-amber-400" : "fill-gray-200 text-gray-200"}`} />
                    ))}
                  </div>
                  {review.title && <p className="text-[11px] font-black text-gray-900 pt-1">{review.title}</p>}
                  <p className="text-[11px] text-gray-600 italic flex-1">"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border border-gray-200 rounded-sm bg-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No reviews yet. Be the first!</p>
            </div>
          )}
        </div>

        {/* Explore Other Categories Section */}
        {otherCategories.length > 0 && (
          <div className="mt-10 space-y-10">
            {otherCategories.map((cat: any) => {
              const catProducts = allProducts.filter((p: any) => {
                const pCatId = typeof p.category === 'object' ? p.category?._id : p.category
                return pCatId === cat._id
              }).slice(0, 5) // Show 5 for the grid
              
              if (catProducts.length === 0) return null

              return (
                <div key={cat._id} className="pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">More {cat.name}</h2>
                    <Link to={`/products?category=${cat.slug || cat._id}`} className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors border-b border-gray-300 hover:border-black">
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                    {catProducts.map((p: any) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      {product.stock > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-2 flex items-center gap-2 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
          <div className="flex-1 bg-gray-50 rounded-sm p-1.5 px-3 border border-gray-200">
            <span className="text-[9px] text-gray-500 font-black block uppercase tracking-widest">Price</span>
            <span className="text-sm font-black text-gray-900">{formatPrice(product.price)}</span>
          </div>

          <button
            onClick={handleBuyNow}
            className="flex-[2] py-2.5 rounded-sm bg-black hover:bg-gray-900 text-white font-black text-[11px] uppercase tracking-widest active:scale-95 shadow-sm flex items-center justify-center gap-1.5"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            Buy Now
          </button>
        </div>
      )}

    </div>
  )
}
