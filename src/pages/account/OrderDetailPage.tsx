import React from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, MapPin, Package, CreditCard, X, Download } from "lucide-react"
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

  const [showCancelModal, setShowCancelModal] = React.useState(false)
  const [cancelCategory, setCancelCategory] = React.useState("")
  const [cancelFeedback, setCancelFeedback] = React.useState("")

  const cancelMutation = useMutation({
    mutationFn: (data: any) => orderApi.cancelOrder(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-order", id] })
      setShowCancelModal(false)
    },
  })

  const CANCEL_REASONS = [
    { id: "wrong_model", label: "Selected wrong phone model / device variant", desc: "e.g. ordered iPhone 15 instead of 16 Pro" },
    { id: "wrong_case_type", label: "Selected wrong case material", desc: "e.g. wanted Glass Case instead of Metal or Dual Case" },
    { id: "address_change", label: "Need to change delivery address or phone number", desc: "Delivery details need correction" },
    { id: "better_design", label: "Found another design / changed mind", desc: "Want to order a different product or graphic" },
    { id: "delivery_delay", label: "Delivery time is too long", desc: "Need it sooner than expected" },
    { id: "mistake", label: "Placed order by mistake", desc: "Accidental tap / duplicate order" },
    { id: "other", label: "Other reason", desc: "Please specify below" },
  ]

  const handleConfirmCancel = () => {
    if (!cancelCategory) return
    const chosen = CANCEL_REASONS.find(r => r.id === cancelCategory)
    cancelMutation.mutate({
      category: chosen?.label || cancelCategory,
      reason: chosen?.label || cancelCategory,
      feedback: cancelFeedback.trim(),
    })
  }

  if (isLoading) return <div className="container mx-auto px-4 py-8 max-w-2xl"><div className="skeleton h-96 rounded-2xl" /></div>
  if (!order) return null

  const canCancel = ["pending", "processing"].includes(order.status)

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link to="/account/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">#{order.orderNumber}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={orderApi.getInvoiceUrl(order.orderNumber)}
            target="_blank"
            rel="noopener noreferrer"
            download={`Invoice-${order.orderNumber}.pdf`}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border border-gray-300 hover:bg-gray-100 transition-colors text-gray-700 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Invoice PDF
          </a>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      {/* Cancellation Notice if Cancelled */}
      {order.status === "cancelled" && (
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 mb-4 text-sm">
          <p className="font-semibold text-red-800 mb-1">Order Cancelled</p>
          {order.cancelReason && <p className="text-xs text-red-700">Reason: {order.cancelReason}</p>}
          {order.paymentStatus === "paid" && (
            <p className="text-xs text-amber-800 mt-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              💳 <strong>Refund Status:</strong> Your PayU payment of {formatPrice(order.totalAmount)} will be refunded back to your original payment method within 5–7 business days.
            </p>
          )}
          {order.paymentStatus === "refunded" && (
            <p className="text-xs text-emerald-800 mt-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">
              ✅ <strong>Refund Processed:</strong> The refund of {formatPrice(order.totalAmount)} has been initiated to your source account.
            </p>
          )}
        </div>
      )}

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
          <div><span className="text-muted-foreground">Status</span><p className={`font-medium capitalize ${order.paymentStatus === "paid" ? "text-green-600" : order.paymentStatus === "refunded" ? "text-emerald-600" : ""}`}>{order.paymentStatus}</p></div>
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
          onClick={() => setShowCancelModal(true)}
          disabled={cancelMutation.isPending}
          className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 font-semibold px-4 py-2 border border-destructive/20 rounded-xl hover:bg-destructive/5 transition-colors"
        >
          <X className="h-4 w-4" /> Cancel Order
        </button>
      )}

      {/* ── INTERACTIVE CANCELLATION QUESTIONNAIRE MODAL ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Cancel Order #{order.orderNumber}</h3>
                <p className="text-xs text-gray-500">Please help us understand why you want to cancel</p>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="py-4 border-b">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Item(s) in this order</span>
              <div className="space-y-2">
                {order.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border text-xs">
                    <div className="w-8 h-8 rounded bg-gray-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{it.name}</p>
                      <p className="text-gray-500">Qty: {it.quantity} · {formatPrice(it.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reasons Questionnaire */}
            <div className="py-4 space-y-3">
              <label className="text-xs font-semibold text-gray-700 block">Why do you want to cancel? <span className="text-red-500">*</span></label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {CANCEL_REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      cancelCategory === r.id
                        ? "border-violet-600 bg-violet-50/50 text-violet-900 font-medium"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      checked={cancelCategory === r.id}
                      onChange={() => setCancelCategory(r.id)}
                      className="mt-0.5 text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <p className="font-medium leading-tight">{r.label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Extra Feedback */}
              <div className="pt-2">
                <label className="text-xs font-medium text-gray-700 block mb-1">Anything specific you'd like to share? (Optional)</label>
                <textarea
                  value={cancelFeedback}
                  onChange={(e) => setCancelFeedback(e.target.value)}
                  placeholder="e.g., I meant to order the Matte finish, or want to re-order next week..."
                  rows={2}
                  className="w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
                />
              </div>
            </div>

            {/* Refund Info Banner */}
            {order.paymentStatus === "paid" && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-1 mb-4">
                <p className="font-semibold flex items-center gap-1.5">
                  <span>💳</span> Refund Notice ({formatPrice(order.totalAmount)})
                </p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Your payment was completed online via PayU. Upon cancellation, our system will automatically halt shipping and process a full refund to your original payment method in 5–7 working days.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Nevermind, Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={!cancelCategory || cancelMutation.isPending}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50 transition-colors shadow-sm"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
