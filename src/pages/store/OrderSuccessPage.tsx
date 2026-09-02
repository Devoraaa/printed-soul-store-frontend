import React from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { orderApi } from "../../lib/api"
import { formatPrice, formatDate, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../../lib/utils"
import { motion } from "framer-motion"

export function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>() // This is actually the orderNumber now
  const { data } = useQuery({ queryKey: ["order", id], queryFn: () => orderApi.trackOrder(id!) })
  const order = data?.data?.data

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5 }}>
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </motion.div>
      <h1 className="text-3xl font-black mb-2">Order Placed! 🎉</h1>
      <p className="text-muted-foreground mb-8">Thank you for your order. We'll send you an email confirmation shortly.</p>

      {order && (
        <div className="rounded-2xl border bg-card p-6 text-left mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-lg">#{order.orderNumber}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Payment</span><p className="font-medium">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (PayU)"}</p></div>
            <div><span className="text-muted-foreground">Payment Status</span><p className="font-medium capitalize">{order.paymentStatus}</p></div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/account/orders" className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold">
          <Package className="h-4 w-4" /> Track Order
        </Link>
        <Link to="/products" className="flex items-center gap-2 px-6 py-3 rounded-full border font-semibold">
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
