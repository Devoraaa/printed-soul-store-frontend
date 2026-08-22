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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => {
            const product = item.product
            return (
              <div key={product._id} className="flex gap-4 p-4 rounded-2xl border bg-card">
                <img
                  src={product.images?.[0] ? getImageUrl(product.images[0]) : "/placeholder.png"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-muted shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product.slug}`} className="font-semibold text-sm hover:text-primary line-clamp-1">{product.name}</Link>
                  <p className="text-sm text-muted-foreground mt-0.5">{formatPrice(item.price)} each</p>
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(product._id, item.quantity - 1)} disabled={isLoading} className="px-2.5 py-1.5 hover:bg-muted text-sm">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1.5 font-semibold text-sm border-x">{item.quantity}</span>
                      <button onClick={() => updateQuantity(product._id, item.quantity + 1)} disabled={isLoading || item.quantity >= product.stock} className="px-2.5 py-1.5 hover:bg-muted text-sm">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => removeFromCart(product._id)} disabled={isLoading} className="text-muted-foreground hover:text-destructive transition-colors">
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
          <div className="lg:sticky lg:top-24 rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="font-bold text-lg">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shippingCharge === 0 ? "text-green-600 font-medium" : ""}>{shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}</span>
              </div>
              {shippingCharge > 0 && (
                <p className="text-xs text-muted-foreground">Add {formatPrice(499 - totalAmount)} more for free shipping</p>
              )}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
            <button
              onClick={() => isAuthenticated ? navigate("/checkout") : navigate("/login")}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"} <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/products" className="block text-center text-sm text-muted-foreground hover:text-foreground">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
