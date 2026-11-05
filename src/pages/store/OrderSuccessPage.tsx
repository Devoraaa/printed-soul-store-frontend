import React from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle, Package, ArrowRight, Download } from "lucide-react"
import { orderApi } from "../../lib/api"
import { useCart } from "../../context/CartContext"
import { formatPrice, formatDate, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../../lib/utils"
import { motion } from "framer-motion"
import { SEO } from "../../components/ui/SEO"

export function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>() // This is actually the orderNumber now
  const { clearCart, refreshCart } = useCart()
  const { data } = useQuery({ queryKey: ["order", id], queryFn: () => orderApi.trackOrder(id!) })
  const order = data?.data?.data

  React.useEffect(() => {
    // Clear cart immediately upon successful order landing
    clearCart().catch(() => {})
    refreshCart().catch(() => {})
  }, [])

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-xl text-center">
        <SEO title="Order Confirmed" noindex={true} />
        
        {/* Animated Check */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}>
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/10">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight font-display mb-2">
          Order Placed Successfully! 🎉
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm max-w-md mx-auto mb-8">
          Thank you for trusting Printed Soul. We have received your order and our production team is already getting it ready.
        </p>

        {order && (
          <div className="bg-white rounded-3xl border border-black/[0.06] p-6 sm:p-8 text-left shadow-[0_12px_40px_rgba(0,0,0,0.04)] mb-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Order Reference</p>
                <span className="font-black text-lg text-neutral-900">#{order.orderNumber}</span>
              </div>
              <span className={`text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs ${ORDER_STATUS_COLORS[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>

            <div className="space-y-3 mb-5">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-neutral-600 font-medium truncate max-w-[70%]">
                    {item.name} <strong className="text-neutral-900">× {item.quantity}</strong>
                  </span>
                  <span className="font-bold text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 pt-4 flex justify-between items-center font-black text-base text-neutral-900">
              <span>Total Paid</span>
              <span className="text-lg tracking-tight">{formatPrice(order.totalAmount)}</span>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-4 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-black/[0.04]">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-0.5">Payment Method</span>
                <p className="font-bold text-neutral-800">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Prepaid"}</p>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-black/[0.04]">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-0.5">Status</span>
                <p className="font-bold text-emerald-700 capitalize">{order.paymentStatus}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {order && (
            <a
              href={orderApi.getInvoiceUrl(order.orderNumber)}
              target="_blank"
              rel="noopener noreferrer"
              download={`Invoice-${order.orderNumber}.pdf`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all shadow-md cursor-pointer active:scale-95"
            >
              <Download className="h-4 w-4" /> Download Invoice
            </a>
          )}
          <Link
            to="/account/orders"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white border border-black/[0.1] text-neutral-800 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-all shadow-xs"
          >
            <Package className="h-4 w-4" /> Track Order
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-neutral-600 hover:text-black text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
