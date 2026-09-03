import React from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Package, Download } from "lucide-react"
import { orderApi } from "../../lib/api"
import { formatDate, formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../../lib/utils"

export function OrdersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["my-orders-all"], queryFn: () => orderApi.getMyOrders() })
  const orders = data?.data?.data || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground text-sm mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="text-primary font-medium hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => (
            <div key={order._id} className="p-4 rounded-2xl border bg-card hover:shadow-md transition-all flex items-center justify-between gap-4">
              <Link to={`/account/orders/${order._id}`} className="flex-1 min-w-0">
                <p className="font-semibold text-sm">#{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                <p className="text-xs text-muted-foreground">{order.paymentMethod === "cod" ? "COD" : "Online"}</p>
              </Link>
              <div className="text-right flex flex-col items-end gap-1.5">
                <p className="font-bold text-sm">{formatPrice(order.totalAmount)}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <a
                    href={orderApi.getInvoiceUrl(order.orderNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`Invoice-${order.orderNumber}.pdf`}
                    title="Download Invoice (PDF)"
                    className="text-xs font-bold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" /> Invoice
                  </a>
                  <Link
                    to={`/track?query=${order.orderNumber}`}
                    className="text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Track →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
