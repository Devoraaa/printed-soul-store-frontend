import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { getImageUrl, formatPrice } from "../../lib/utils"

export function CartPage() {
  const { items, totalAmount, updateQuantity, removeFromCart, isLoading } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const shippingCharge = totalAmount >= 499 ? 0 : 49
  const grandTotal = totalAmount + shippingCharge

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
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
      <h1 className="text-2xl font-black uppercase tracking-widest mb-6">Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item: any) => {
            const product = item.product
            return (
              <div key={product._id} className="flex gap-4 p-4 rounded-sm border bg-white shadow-sm">
                <img
                  src={product.images?.[0] ? getImageUrl(product.images[0]) : "/placeholder.png"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-sm bg-gray-50 border border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product.slug}`} className="font-bold text-sm text-gray-900 hover:text-black line-clamp-1">
                    {product.name}
                  </Link>
                  <p className="text-xs font-medium text-gray-500 mt-1">{formatPrice(item.price)} each</p>
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden bg-white h-8">
                      <button onClick={() => updateQuantity(product._id, item.quantity - 1)} disabled={isLoading} className="w-8 h-full flex items-center justify-center hover:bg-gray-50 border-r border-gray-300 transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 h-full flex items-center justify-center font-bold text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(product._id, item.quantity + 1)} disabled={isLoading || item.quantity >= product.stock} className="w-8 h-full flex items-center justify-center hover:bg-gray-50 border-l border-gray-300 transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-sm text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => removeFromCart(product._id)} disabled={isLoading} className="text-gray-400 hover:text-red-600 transition-colors">
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
          <div className="lg:sticky lg:top-20 rounded-sm border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-black text-sm uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900 font-bold">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Shipping</span>
                <span className={shippingCharge === 0 ? "text-emerald-600 font-bold" : "text-gray-900 font-bold"}>
                  {shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}
                </span>
              </div>
              {shippingCharge > 0 && (
                <p className="text-[10px] uppercase font-bold text-gray-400">Add {formatPrice(499 - totalAmount)} more for free shipping</p>
              )}
            </div>
            
            <div className="border-t border-gray-100 pt-4 space-y-1">
              <div className="flex justify-between font-black text-lg text-gray-900">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest text-right">
                GST Included
              </p>
            </div>

            <button
              onClick={() => isAuthenticated ? navigate("/checkout") : navigate("/login")}
              className="w-full py-3.5 rounded-sm bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"} <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/products" className="block text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
