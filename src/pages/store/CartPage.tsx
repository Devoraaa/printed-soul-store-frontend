import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { getImageUrl, formatPrice } from "../../lib/utils"
import { SEO } from "../../components/ui/SEO"

export function CartPage() {
  const { items, totalAmount, updateQuantity, removeFromCart, isLoading } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const shippingCharge = totalAmount >= 499 ? 0 : 49
  const grandTotal = totalAmount + shippingCharge

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <SEO title="Shopping Bag" noindex={true} />
        <div className="w-20 h-20 rounded-full bg-white border border-black/[0.06] flex items-center justify-center mx-auto mb-5 shadow-sm">
          <ShoppingBag className="h-9 w-9 text-neutral-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-neutral-900 mb-2 font-display">Your Bag is Empty</h2>
        <p className="text-neutral-500 text-sm mb-8 max-w-sm mx-auto">Discover custom phone cases, toughened glass armor and personalized accessories crafted for you.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95">
          Explore Catalog <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <SEO title="Shopping Bag" noindex={true} />
      
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-2">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 font-display">
          Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>
        <Link to="/products" className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors">
          Continue Shopping &rarr;
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Items Column */}
        <div className="lg:col-span-8 space-y-4">

          {/* Free Shipping Progress Card */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 sm:p-5 shadow-sm">
            {totalAmount >= 499 ? (
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>🎉 You've unlocked <strong>FREE Express Delivery</strong> across India!</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-neutral-700 font-semibold mb-2 flex items-center justify-between">
                  <span>Add <strong>{formatPrice(499 - totalAmount)}</strong> more to get <strong>FREE Express Delivery</strong></span>
                  <span className="text-[11px] text-neutral-400 font-mono font-bold">{Math.round((totalAmount / 499) * 100)}%</span>
                </p>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, Math.round((totalAmount / 499) * 100))}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {items.map((item: any) => {
            const product = item.product
            return (
              <div key={product._id} className="flex gap-4 p-4 sm:p-5 rounded-3xl border border-black/[0.06] bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#F8F5F0] border border-black/[0.05] shrink-0 p-1 flex items-center justify-center">
                  <img
                    src={product.images?.[0] ? getImageUrl(product.images[0]) : "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                      {product.category?.name || "Printed Soul"}
                    </span>
                    <Link to={`/products/${product.slug}`} className="font-bold text-sm sm:text-base text-neutral-900 hover:text-neutral-600 line-clamp-1 block mt-0.5">
                      {product.name}
                    </Link>
                    <p className="text-xs font-semibold text-neutral-500 mt-1">{formatPrice(item.price)} each</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                    <div className="flex items-center border border-black/[0.08] rounded-full overflow-hidden bg-neutral-50 h-8">
                      <button 
                        onClick={() => updateQuantity(product._id, item.quantity - 1)} 
                        disabled={isLoading} 
                        className="w-8 h-full flex items-center justify-center hover:bg-white text-neutral-600 hover:text-black transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 h-full flex items-center justify-center font-black text-xs text-neutral-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(product._id, item.quantity + 1)} 
                        disabled={isLoading || item.quantity >= product.stock} 
                        className="w-8 h-full flex items-center justify-center hover:bg-white text-neutral-600 hover:text-black transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-5">
                      <span className="font-black text-base text-neutral-900 tracking-tight">{formatPrice(item.price * item.quantity)}</span>
                      <button 
                        onClick={() => removeFromCart(product._id)} 
                        disabled={isLoading} 
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-7 shadow-sm space-y-5">
            <h3 className="font-black text-sm uppercase tracking-wider text-neutral-900 border-b border-black/[0.06] pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between font-medium">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-neutral-900 font-bold">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-neutral-500">Express Delivery</span>
                <span className={shippingCharge === 0 ? "text-emerald-600 font-bold uppercase text-xs" : "text-neutral-900 font-bold"}>
                  {shippingCharge === 0 ? "Free" : formatPrice(shippingCharge)}
                </span>
              </div>
              {shippingCharge > 0 && (
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                  Add {formatPrice(499 - totalAmount)} more for Free Express Delivery
                </p>
              )}
            </div>
            
            <div className="border-t border-black/[0.06] pt-4 space-y-1">
              <div className="flex justify-between font-black text-xl text-neutral-900 font-display">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider text-right">
                GST Included • No Hidden Fees
              </p>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-4 rounded-full bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg cursor-pointer"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </button>

            <div className="pt-3 border-t border-black/[0.06] flex items-center justify-center gap-2 text-[11px] text-neutral-400 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Encrypted & Safe Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
