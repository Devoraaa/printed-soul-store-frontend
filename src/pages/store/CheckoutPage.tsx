import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Lock, Loader2, ArrowRight } from "lucide-react"
import { orderApi } from "../../lib/api"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { formatPrice } from "../../lib/utils"

export function CheckoutPage() {
  const { items, totalAmount } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  })

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart")
    }
  }, [items, navigate])

  const shippingCharge = totalAmount >= 499 ? 0 : 49
  const grandTotal = totalAmount + shippingCharge

  const createOrderMutation = useMutation({
    mutationFn: (data: any) => orderApi.create(data),
    onSuccess: (res) => {
      const payu = res.data.data.payu
      if (payu) {
        // Create a hidden form to submit to PayU
        const form = document.createElement("form")
        form.setAttribute("method", "POST")
        form.setAttribute("action", payu.actionUrl)

        const fields = ["key", "txnid", "amount", "productinfo", "firstname", "email", "phone", "surl", "furl", "hash"]
        fields.forEach(key => {
          const input = document.createElement("input")
          input.setAttribute("type", "hidden")
          input.setAttribute("name", key)
          input.setAttribute("value", payu[key])
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
      }
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to initiate checkout")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      items: items.map(i => ({ productId: i.product._id, quantity: i.quantity, productObj: i.product })),
      guestEmail: form.email,
      guestName: form.fullName,
      guestPhone: form.phone,
      shippingAddress: {
        label: "Home",
        fullName: form.fullName,
        phone: form.phone,
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: "India",
        isDefault: true
      }
    }

    createOrderMutation.mutate(payload)
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Address Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-black uppercase tracking-wide text-gray-900 mb-6 flex items-center gap-2">
                <span className="h-8 w-1 bg-black rounded-full block"></span>
                Shipping Details
              </h2>
              
              {!isAuthenticated && (
                <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                  Checking out as a Guest. We will send your order details to your email.
                </div>
              )}

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                    <input required type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="john@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="+91 9876543210" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Complete Address</label>
                  <textarea required value={form.street} onChange={e => setForm({...form, street: e.target.value})} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none" placeholder="House/Flat No., Building Name, Street" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">City</label>
                    <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="Mumbai" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">State</label>
                    <input required type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="MH" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">PIN Code</label>
                    <input required type="text" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="400001" />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Order Summary & Pay */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-black uppercase tracking-wide text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {item.product.images?.[0]?.url ? (
                        <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-300">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-black text-gray-900 mt-1">{formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-gray-100 mt-3">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={createOrderMutation.isPending}
                className="w-full py-4 rounded-xl bg-black text-white font-extrabold uppercase tracking-wide text-sm hover:bg-gray-900 active:scale-95 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
              >
                {createOrderMutation.isPending ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                  <><Lock className="h-4 w-4" /> Pay Securely via PayU</>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>100% Secure Payments</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
