import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight, Truck } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { getImageUrl, formatPrice } from "../../lib/utils"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items: cart, removeFromCart, updateQuantity, totalItems, totalAmount: totalPrice } = useCart()
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

  const freeShippingThreshold = 499
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - totalPrice)
  const progressPercentage = Math.min(100, (totalPrice / freeShippingThreshold) * 100)

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
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-display font-black text-gray-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Your Cart ({totalItems})
              </h2>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {totalItems > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className={`h-4 w-4 ${amountToFreeShipping === 0 ? 'text-emerald-600' : 'text-violet-600'}`} />
                  <p className="text-xs font-bold text-gray-700">
                    {amountToFreeShipping === 0 
                      ? <span className="text-emerald-600">You've unlocked Free Shipping! 🎉</span>
                      : <span>Add <span className="font-black text-violet-600">{formatPrice(amountToFreeShipping)}</span> more to get Free Shipping!</span>
                    }
                  </p>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${amountToFreeShipping === 0 ? 'bg-emerald-500' : 'bg-violet-600'}`}
                  />
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" strokeWidth={1} />
                  <p className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                  <button 
                    onClick={() => { onClose(); navigate("/products"); }}
                    className="px-6 py-3 rounded-full bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item: any) => (
                    <div key={item.product._id} className="flex gap-4 group">
                      {/* Image */}
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 relative cursor-pointer" onClick={() => {onClose(); navigate(`/product/${item.product.slug}`)}}>
                        <img 
                          src={item.product.images?.[0] ? getImageUrl(item.product.images[0]) : "/placeholder.png"} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <div className="cursor-pointer" onClick={() => {onClose(); navigate(`/product/${item.product.slug}`)}}>
                            <h3 className="font-bold text-sm text-gray-900 leading-tight line-clamp-2 hover:text-violet-600 transition-colors">
                              {item.product.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">{item.product.category?.name || "Accessory"}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.product._id)}
                            className="text-gray-400 hover:text-red-500 p-1 md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-end justify-between mt-3">
                          {/* Quantity */}
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                            <button 
                              onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black rounded-md hover:shadow-sm transition-all cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black rounded-md hover:shadow-sm transition-all cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <p className="font-black text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Upsell Section */}
                  <div className="pt-6 border-t border-gray-100 mt-6">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-3">You might also like</h4>
                    <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 bg-gray-50/50">
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-2xl shrink-0">
                        🛡️
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900">Tempered Glass</p>
                        <p className="text-[10px] text-gray-500 font-medium">Add armor protection</p>
                      </div>
                      <button className="px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-bold text-gray-900 hover:border-black transition-colors cursor-pointer active:scale-95">
                        + ₹199
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Shipping</span>
                    {amountToFreeShipping === 0 ? (
                      <span className="font-bold text-emerald-600 uppercase text-xs tracking-wider">Free</span>
                    ) : (
                      <span className="font-semibold text-gray-900">Calculated</span>
                    )}
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-gray-900 block leading-none">{formatPrice(totalPrice)}</span>
                      <span className="text-[10px] text-gray-400 block mt-1 font-medium">Taxes included</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 px-6 rounded-2xl bg-black text-white font-extrabold text-sm hover:bg-gray-900 active:scale-95 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Checkout securely <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
