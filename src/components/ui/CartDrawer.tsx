import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { productApi } from "../../lib/api"
import { useCart } from "../../context/CartContext"
import { getImageUrl, formatPrice } from "../../lib/utils"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items: cart, removeFromCart, updateQuantity, totalItems, totalAmount: totalPrice, addToCart } = useCart()
  const navigate = useNavigate()
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  // Intelligent Related Products in Cart
  const cartProductIds = cart.map((i: any) => i.product?._id).filter(Boolean)
  const firstCategory = cart[0]?.product?.category?._id || cart[0]?.product?.category

  const { data: upsellData } = useQuery({
    queryKey: ["cart-intelligent-upsell", firstCategory],
    queryFn: () => productApi.getAll({ 
      category: typeof firstCategory === "string" ? firstCategory : undefined,
      limit: 10 
    }),
    enabled: cart.length > 0,
    staleTime: 60 * 1000,
  })

  const allProducts = upsellData?.data?.data || []
  const relatedProducts = allProducts
    .filter((p: any) => !cartProductIds.includes(p._id) && p.images && p.images.length > 0)
    .slice(0, 3)

  const handleCheckout = () => {
    onClose()
    navigate("/checkout") // we can route them directly to checkout or cart page
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06] bg-[#FAF7F2]">
              <h2 className="text-base sm:text-lg font-black text-neutral-900 flex items-center gap-2 uppercase tracking-wide font-display">
                <ShoppingBag className="h-5 w-5" /> Your Bag ({totalItems})
              </h2>
              <button 
                onClick={onClose}
                aria-label="Close cart drawer"
                className="p-2 -mr-2 rounded-full hover:bg-black/[0.05] text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            {cart.length > 0 && (
              <div className="bg-[#FAF7F2] border-b border-black/[0.06] px-6 py-3.5">
                {totalPrice >= 499 ? (
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>🎉 You've unlocked <strong>FREE Express Delivery</strong>!</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-neutral-700 font-semibold mb-1.5 flex items-center justify-between">
                      <span>Add <strong>{formatPrice(499 - totalPrice)}</strong> more for <strong>FREE Delivery</strong></span>
                      <span className="text-[10px] text-neutral-500 font-mono font-bold">{Math.round((totalPrice / 499) * 100)}%</span>
                    </p>
                    <div className="w-full h-1.5 bg-neutral-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(100, Math.round((totalPrice / 499) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                  <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" strokeWidth={1} />
                  <p className="text-lg font-bold text-neutral-900 mb-1">Your cart is empty</p>
                  <p className="text-xs text-neutral-500 mb-6">Looks like you haven't added anything yet.</p>
                  <button 
                    onClick={() => { onClose(); navigate("/products"); }}
                    className="px-6 py-3 rounded-full bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors cursor-pointer shadow-md active:scale-95"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item: any) => (
                    <div key={item.product._id} className="flex gap-3.5 p-3 rounded-2xl bg-white border border-black/[0.06] shadow-xs group">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F8F5F0] border border-black/[0.05] shrink-0 relative cursor-pointer" onClick={() => {onClose(); navigate(`/products/${item.product.slug}`)}}>
                        <img 
                          src={item.product.images?.[0] ? getImageUrl(item.product.images[0]) : "/placeholder.png"} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="cursor-pointer min-w-0" onClick={() => {onClose(); navigate(`/products/${item.product.slug}`)}}>
                            <h3 className="font-bold text-xs sm:text-[13px] text-neutral-900 leading-tight line-clamp-2 hover:text-neutral-600 transition-colors">
                              {item.product.name}
                            </h3>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5 truncate">{item.product.category?.name || "Accessory"}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.product._id)}
                            className="text-neutral-400 hover:text-rose-600 p-1 transition-colors cursor-pointer shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        
                        <div className="flex items-end justify-between mt-2">
                          {/* Quantity */}
                          <div className="flex items-center bg-neutral-100 rounded-full p-0.5 border border-black/[0.05]">
                            <button 
                              onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white hover:text-black rounded-full transition-all cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-neutral-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white hover:text-black rounded-full transition-all cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <p className="font-black text-sm text-neutral-900">{formatPrice(item.product.price * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Intelligent Related Products Section */}
                  {relatedProducts.length > 0 && (
                    <div className="pt-5 border-t border-black/[0.06] mt-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2.5">
                        You might also like
                      </h4>
                      <div className="space-y-2">
                        {relatedProducts.map((p: any) => (
                          <div 
                            key={p._id} 
                            className="flex items-center gap-3 p-2 rounded-2xl border border-black/[0.05] bg-neutral-50/70 hover:bg-white transition-all shadow-2xs"
                          >
                            <div 
                              className="w-11 h-11 rounded-xl overflow-hidden bg-[#F8F5F0] border border-black/[0.05] shadow-xs shrink-0 cursor-pointer"
                              onClick={() => { onClose(); navigate(`/products/${p.slug}`) }}
                            >
                              <img 
                                src={p.images?.[0] ? getImageUrl(p.images[0]) : "/placeholder.png"} 
                                alt={p.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p 
                                className="text-xs font-bold text-neutral-900 truncate cursor-pointer hover:text-neutral-600 transition-colors"
                                onClick={() => { onClose(); navigate(`/products/${p.slug}`) }}
                              >
                                {p.name}
                              </p>
                              <p className="text-[11px] font-black text-neutral-900 mt-0.5">{formatPrice(p.price)}</p>
                            </div>
                            <button 
                              onClick={() => addToCart(p._id, 1)}
                              className="px-3 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-all active:scale-95 shrink-0 shadow-xs cursor-pointer"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-black/[0.06] p-6 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
                <div className="space-y-2.5 mb-5 text-xs">
                  <div className="flex justify-between text-neutral-500 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-neutral-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 font-medium">
                    <span>Express Delivery</span>
                    <span className="font-bold text-neutral-900">
                      {totalPrice >= 499 ? (
                        <span className="font-bold text-emerald-600 uppercase text-[11px] tracking-wider">Free</span>
                      ) : (
                        formatPrice(49)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2.5 border-t border-black/[0.06]">
                    <span className="text-sm font-black text-neutral-900 uppercase tracking-wide">Total</span>
                    <div className="text-right">
                      <span className="text-xl font-black text-neutral-900 block leading-none">
                        {formatPrice(totalPrice + (totalPrice >= 499 ? 0 : 49))}
                      </span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5 font-medium">All taxes included</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-6 rounded-full bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
