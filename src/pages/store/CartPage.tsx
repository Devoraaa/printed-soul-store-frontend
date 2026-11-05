import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
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
      <div className="container mx-auto px-4 py-24 text-center">
        <SEO title="Shopping Cart" noindex={true} />
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some amazing phone cases to your cart</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold">
          Shop Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <SEO title="Shopping Cart" noindex={true} />
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-6">Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item: any) => {
            const product = item.product
            return (
              <div key={product._id} className="flex gap-4 p-4 sm:p-5 rounded-2xl border border-black/[0.05] bg-white shadow-sm">
                <img
                  src={product.images?.[0] ? getImageUrl(product.images[0]) : "/placeholder.png"}
                  alt={product.name}
                  className="w-20 h-20 object-contain rounded-xl bg-neutral-50 border border-black/[0.05] shrink-0 p-1"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product.slug}`} className="font-bold text-sm text-neutral-900 hover:text-black line-clamp-1">
                    {product.name}
                  </Link>
                  <p className="text-xs font-medium text-neutral-500 mt-1">{formatPrice(item.price)} each</p>
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    <div className="flex items-center border border-black/[0.1] rounded-full overflow-hidden bg-white h-8">
                      <button onClick={() => updateQuantity(product._id, item.quantity - 1)} disabled={isLoading} className="w-8 h-full flex items-center justify-center hover:bg-neutral-50 border-r border-black/[0.1] transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 h-full flex items-center justify-center font-bold text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(product._id, item.quantity + 1)} disabled={isLoading || item.quantity >= product.stock} className="w-8 h-full flex items-center justify-center hover:bg-neutral-50 border-l border-black/[0.1] transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-sm text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => removeFromCart(product._id)} disabled={isLoading} className="text-neutral-400 hover:text-rose-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20 rounded-3xl border border-black/[0.05] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 border-b border-black/[0.05] pb-3">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-medium">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-neutral-900 font-bold">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-neutral-500">Shipping</span>
                <span className={shippingCharge === 0 ? "text-emerald-600 font-bold" : "text-neutral-900 font-bold"}>
                  {shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}
                </span>
              </div>
              {shippingCharge > 0 && (
                <p className="text-[10px] uppercase font-bold text-neutral-400">Add {formatPrice(499 - totalAmount)} more for free shipping</p>
              )}
            </div>
            
            <div className="border-t border-black/[0.05] pt-4 space-y-1">
              <div className="flex justify-between font-black text-lg text-neutral-900 font-display">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider text-right">
                GST Included
              </p>
            </div>

            <button
              onClick={() => isAuthenticated ? navigate("/checkout") : navigate("/login")}
              className="w-full py-3.5 rounded-full bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 shadow-sm"
            >
              {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"} <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/products" className="block text-center text-[11px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-900 transition-colors pt-1">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
