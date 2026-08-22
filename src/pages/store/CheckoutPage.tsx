import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Plus, CreditCard, Truck, CheckCircle, Loader2, Lock } from "lucide-react"
import { addressApi, orderApi } from "../../lib/api"
import { useCart } from "../../context/CartContext"
import { formatPrice } from "../../lib/utils"

declare const Razorpay: any

export function CheckoutPage() {
  const { items, totalAmount, refreshCart } = useCart()
  const navigate = useNavigate()
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({ label: "Home", fullName: "", phone: "", street: "", city: "", state: "", pincode: "", isDefault: true })

  const shippingCharge = totalAmount >= 499 ? 0 : 49
  const grandTotal = totalAmount + shippingCharge

  const { data: addressData, refetch: refetchAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressApi.getAll(),
  })
  const addresses = addressData?.data?.data || []

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a: any) => a.isDefault) || addresses[0]
      setSelectedAddressId(def._id)
    }
  }, [addresses])

  const createAddressMutation = useMutation({
    mutationFn: (data: any) => addressApi.create(data),
    onSuccess: (res) => {
      refetchAddresses()
      setSelectedAddressId(res.data.data._id)
      setShowAddressForm(false)
    },
  })

  const placeOrderMutation = useMutation({
    mutationFn: (data: any) => orderApi.create(data),
    onSuccess: async (res) => {
      const { payu } = res.data.data

      if (payu && payu.actionUrl) {
        // Auto-create and submit PayU form
        const form = document.createElement("form")
        form.method = "POST"
        form.action = payu.actionUrl

        const params: Record<string, string> = {
          key: payu.key,
          txnid: payu.txnid,
          amount: String(payu.amount),
          productinfo: payu.productinfo,
          firstname: payu.firstname,
          email: payu.email,
          phone: payu.phone,
          surl: payu.surl,
          furl: payu.furl,
          hash: payu.hash,
        }

        Object.keys(params).forEach((k) => {
          const input = document.createElement("input")
          input.type = "hidden"
          input.name = k
          input.value = params[k]
          form.appendChild(input)
        })

        document.body.appendChild(form)
        // Fire form submission immediately so user isn't stuck waiting for cart refresh
        form.submit()
        refreshCart().catch(console.error)
      } else {
        await refreshCart()
        navigate(`/order-success/${res.data.data.order._id}`)
      }
    },
  })

  const handlePlaceOrder = () => {
    if (!selectedAddressId) { alert("Please select a shipping address"); return }
    placeOrderMutation.mutate({ shippingAddressId: selectedAddressId })
  }

  if (items.length === 0) { navigate("/cart"); return null }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-bold text-base mb-4 flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Shipping Address</h2>
            {addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-3">No saved addresses. Please add one.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {addresses.map((addr: any) => (
                  <label key={addr._id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedAddressId === addr._id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"}`}>
                    <input type="radio" name="address" value={addr._id} checked={selectedAddressId === addr._id} onChange={() => setSelectedAddressId(addr._id)} className="mt-1" />
                    <div>
                      <p className="font-semibold text-sm">{addr.label} — {addr.fullName}</p>
                      <p className="text-xs text-muted-foreground">{addr.phone}</p>
                      <p className="text-xs text-muted-foreground">{addr.street}, {addr.city}, {addr.state} — {addr.pincode}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {!showAddressForm ? (
              <button onClick={() => setShowAddressForm(true)} className="text-sm text-primary hover:underline flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add new address
              </button>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); createAddressMutation.mutate(addressForm) }} className="space-y-3 mt-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {["fullName", "phone", "street", "city", "state", "pincode"].map((field) => (
                    <input key={field} required value={(addressForm as any)[field]} onChange={(e) => setAddressForm(prev => ({ ...prev, [field]: e.target.value }))}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 col-span-2 md:col-span-1" />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={createAddressMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                    {createAddressMutation.isPending ? "Saving..." : "Save Address"}
                  </button>
                  <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 rounded-lg border text-sm">Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Payment Method - 100% Prepaid via PayU */}
          <div className="rounded-2xl border bg-card p-6 border-violet-100 bg-violet-50/20">
            <h2 className="font-bold text-base mb-3 flex items-center gap-2 text-gray-900">
              <CreditCard className="h-5 w-5 text-violet-600" /> Payment Gateway (PayU)
            </h2>
            <div className="p-4 rounded-xl border border-violet-200 bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-gray-900">Prepaid Payment (UPI, Credit/Debit Cards, Netbanking)</p>
                <p className="text-xs text-gray-500 mt-0.5">Instant confirmation & auto-dispatch to Shiprocket</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full">Secure PayU</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="font-bold text-base mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item: any) => (
                <div key={item.product._id} className="flex items-center gap-3">
                  <span className="text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shrink-0">{item.quantity}</span>
                  <span className="text-sm flex-1 line-clamp-1">{item.product.name}</span>
                  <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(totalAmount)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shippingCharge === 0 ? "text-green-600 font-medium" : ""}>{shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}</span></div>
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between font-bold text-base">
              <span>Total</span><span>{formatPrice(grandTotal)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placeOrderMutation.isPending || !selectedAddressId}
              className="w-full mt-6 py-4 rounded-xl bg-violet-600 text-white font-black hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-violet-500/20"
            >
              {placeOrderMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
              Pay {formatPrice(grandTotal)} Securely
            </button>
            <div className="mt-4 pt-4 border-t flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Guaranteed Safe Checkout</span>
              <div className="flex items-center justify-center gap-3 grayscale opacity-60">
                <div className="h-5 w-8 bg-gray-100 rounded flex items-center justify-center text-[8px] font-black text-black border border-gray-200">VISA</div>
                <div className="h-5 w-8 bg-gray-100 rounded flex items-center justify-center text-[8px] font-black text-black border border-gray-200">MC</div>
                <div className="h-5 w-8 bg-gray-100 rounded flex items-center justify-center text-[8px] font-black text-black border border-gray-200">UPI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
