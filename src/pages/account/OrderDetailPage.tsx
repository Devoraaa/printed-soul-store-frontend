import React from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, MapPin, Package, CreditCard, X } from "lucide-react"
import { orderApi } from "../../lib/api"
import { formatDate, formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../../lib/utils"

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["my-order", id],
    queryFn: () => orderApi.getMyOrderById(id!),
    enabled: !!id,
  })
  const order = data?.data?.data

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => orderApi.cancelOrder(id!, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-order", id] }),
  })

  if (isLoading) return <div className="container mx-auto px-4 py-8 max-w-2xl"><div className="skeleton h-96 rounded-2xl" /></div>
  if (!order) return null

  const canCancel = ["pending", "processing"].includes(order.status)

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link to="/account/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">#{order.orderNumber}</h1>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Items */}
      <div className="rounded-2xl border bg-card p-5 mb-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Package className="h-4 w-4" /> Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.itemsTotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingCharge)}</span></div>
          <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
        </div>
      </div>

      {/* Shipping */}
      <div className="rounded-2xl border bg-card p-5 mb-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</h3>
        <p className="text-sm font-medium">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
        <p className="text-sm text-muted-foreground">
          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
        </p>
      </div>

      {/* Payment */}
      <div className="rounded-2xl border bg-card p-5 mb-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-muted-foreground">Method</span><p className="font-medium">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (PayU)"}</p></div>
          <div><span className="text-muted-foreground">Status</span><p className={`font-medium capitalize ${order.paymentStatus === "paid" ? "text-green-600" : ""}`}>{order.paymentStatus}</p></div>
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory?.length > 0 && (
        <div className="rounded-2xl border bg-card p-5 mb-6">
          <h3 className="font-semibold mb-3">Order Timeline</h3>
          <div className="space-y-3">
            {[...order.statusHistory].reverse().map((h: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${i === 0 ? "bg-primary" : "bg-muted-foreground"}`} />
                <div>
                  <p className="text-sm font-medium">{ORDER_STATUS_LABELS[h.status]}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(h.timestamp)}</p>
                  {h.note && <p className="text-xs text-muted-foreground">{h.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {canCancel && (
        <button
          onClick={() => { if (confirm("Cancel this order?")) cancelMutation.mutate("Cancelled by customer") }}
          disabled={cancelMutation.isPending}
          className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 font-medium"
        >
          <X className="h-4 w-4" /> Cancel Order
        </button>
      )}
    </div>
  )
}
