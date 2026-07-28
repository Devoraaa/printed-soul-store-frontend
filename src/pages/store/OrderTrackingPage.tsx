import React, { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { orderApi } from "../../lib/api"
import { formatPrice, formatDate, getImageUrl } from "../../lib/utils"
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ExternalLink, AlertCircle, ArrowLeft } from "lucide-react"

const TRACKING_STEPS = [
  { id: "pending", label: "Order Placed", desc: "We have received your order" },
  { id: "processing", label: "Processing", desc: "Your design is being printed" },
  { id: "packed", label: "Packed", desc: "Quality checked & packaged" },
  { id: "shipped", label: "Shipped / Dispatched", desc: "Handed over to courier partner" },
  { id: "delivered", label: "Delivered", desc: "Package delivered safely" },
]

export function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get("query") || searchParams.get("orderId") || ""
  const [queryInput, setQueryInput] = useState(initialQuery)
  const [activeQuery, setActiveQuery] = useState(initialQuery)

  useEffect(() => {
    if (initialQuery) {
      setQueryInput(initialQuery)
      setActiveQuery(initialQuery)
    }
  }, [initialQuery])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["track-order", activeQuery],
    queryFn: () => orderApi.trackOrder(activeQuery),
    enabled: !!activeQuery.trim(),
    retry: false,
  })

  const order = data?.data?.data

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!queryInput.trim()) return
    setActiveQuery(queryInput.trim())
    setSearchParams({ query: queryInput.trim() })
  }

  const getStepStatus = (stepId: string, currentStatus: string) => {
    const orderSequence = ["pending", "processing", "packed", "shipped", "delivered"]
    const currentIndex = orderSequence.indexOf(currentStatus)
    const stepIndex = orderSequence.indexOf(stepId)

    if (currentStatus === "cancelled") return "cancelled"
    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "current"
    return "upcoming"
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header & Back link */}
        <div>
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Shop
          </Link>
          <h1 className="text-3xl font-display font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your Order ID (e.g. PSS-000001) or AWB Tracking Number to check real-time status.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Enter Order ID or AWB Tracking #"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-black text-white font-medium text-sm rounded-2xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm animate-pulse">
            <Package className="h-10 w-10 text-gray-300 mx-auto mb-3 animate-bounce" />
            <p className="text-gray-500 font-medium">Fetching real-time tracking updates...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center text-red-700">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 text-red-500" />
            <h3 className="font-bold text-lg">No Order Found</h3>
            <p className="text-sm text-red-600 mt-1">
              {(error as any)?.response?.data?.message || "Please check your Order Number / AWB and try again."}
            </p>
          </div>
        )}

        {/* Tracking Details */}
        {order && (
          <div className="space-y-6">
            
            {/* Summary Banner */}
            <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Order Number</span>
                  <h2 className="text-2xl font-mono font-bold mt-0.5">{order.orderNumber}</h2>
                </div>
                <div className="flex flex-wrap gap-2 sm:text-right">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-gray-300 uppercase tracking-wider">Status</p>
                    <p className="text-sm font-bold capitalize text-emerald-400">{order.status}</p>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-gray-300 uppercase tracking-wider">Est. Delivery</p>
                      <p className="text-sm font-bold">{formatDate(order.estimatedDelivery)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Courier & AWB Banner */}
              {order.trackingNumber && (
                <div className="mt-6 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Partner: <span className="text-white font-semibold">{order.courierPartner || "Courier"}</span></p>
                      <p className="text-sm font-mono font-bold">AWB: {order.trackingNumber}</p>
                    </div>
                  </div>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
                    >
                      Track on Courier Site <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Stepper Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-6">Delivery Progress</h3>

              {order.status === "cancelled" ? (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-red-700 text-sm">
                  <p className="font-bold">This order has been cancelled.</p>
                  {order.cancelReason && <p className="text-xs mt-1">Reason: {order.cancelReason}</p>}
                </div>
              ) : (
                <div className="relative">
                  <div className="space-y-8">
                    {TRACKING_STEPS.map((step, idx) => {
                      const state = getStepStatus(step.id, order.status)
                      const isLast = idx === TRACKING_STEPS.length - 1

                      return (
                        <div key={step.id} className="relative flex items-start gap-4">
                          {!isLast && (
                            <div
                              className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-px transition-colors ${
                                state === "completed" ? "bg-black" : "bg-gray-200"
                              }`}
                            />
                          )}
                          
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-sm transition-colors ${
                              state === "completed"
                                ? "bg-black text-white"
                                : state === "current"
                                ? "bg-emerald-500 text-black ring-4 ring-emerald-100 animate-pulse"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {state === "completed" ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-bold text-sm ${state === "upcoming" ? "text-gray-400" : "text-gray-900"}`}>
                                {step.label}
                              </h4>
                              {state === "current" && (
                                <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                  Current Status
                                </span>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 ${state === "upcoming" ? "text-gray-300" : "text-gray-500"}`}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items & Address Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Items */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-sm mb-4">Package Contents</h3>
                <div className="space-y-3">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                        {item.product?.coverImage || item.product?.images?.[0] ? (
                          <img src={getImageUrl(item.product?.coverImage || item.product?.images?.[0])} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-300 m-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" /> Delivery Address
                </h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="pt-2 text-gray-400">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}
