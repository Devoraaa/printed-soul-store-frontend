import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  Lock, Loader2, ArrowRight, Home, Building2, Briefcase, 
  MapPin, Plus, Check, CheckCircle2, Pencil, Trash2, X, Mail 
} from "lucide-react"
import { orderApi, addressApi } from "../../lib/api"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { formatPrice, getImageUrl, INDIAN_STATES } from "../../lib/utils"

const PRESET_LABELS = [
  { id: "Home", label: "Home", icon: Home },
  { id: "Office", label: "Office", icon: Building2 },
  { id: "Work", label: "Work", icon: Briefcase },
  { id: "Other", label: "Other", icon: MapPin },
]

export function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Saved Addresses
  const { data: addressesData, isLoading: loadingAddresses } = useQuery({
    queryKey: ["checkout-addresses"],
    queryFn: () => addressApi.getAll(),
    enabled: !!isAuthenticated,
  })
  const savedAddresses = addressesData?.data?.data || []

  // Modes: "select" (pick from saved cards), "edit" (editing a card), "new" (entering new)
  const [addressMode, setAddressMode] = useState<"select" | "edit" | "new">("select")
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  const [addressLabel, setAddressLabel] = useState<string>("Home")
  const [customLabel, setCustomLabel] = useState<string>("")
  const [saveAddressToAccount, setSaveAddressToAccount] = useState<boolean>(true)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: (user?.phone || "").replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10),
    street: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  })

  // Pre-fill user profile info if logged in
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: user.email || prev.email,
        phone: prev.phone ? prev.phone.replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10) : (user.phone || "").replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10),
      }))
    }
  }, [user])

  // Select default saved address on initial load
  useEffect(() => {
    if (savedAddresses.length > 0) {
      if (!selectedAddressId || !savedAddresses.some((a: any) => a._id === selectedAddressId)) {
        const defaultAddr = savedAddresses.find((a: any) => a.isDefault) || savedAddresses[0]
        if (defaultAddr) {
          selectAddress(defaultAddr)
        }
      }
    } else if (isAuthenticated) {
      // No saved addresses -> directly show new form
      setAddressMode("new")
    }
  }, [savedAddresses, isAuthenticated])

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart")
    }
  }, [items, navigate])

  const selectAddress = (addr: any) => {
    setSelectedAddressId(addr._id)
    setAddressLabel(addr.label || "Home")
    setAddressMode("select")
    setEditingAddressId(null)
    setForm(prev => ({
      ...prev,
      fullName: addr.fullName || prev.fullName,
      phone: (addr.phone || "").replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10),
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "Maharashtra",
      pincode: addr.pincode || "",
    }))
  }

  const handleStartEditAddress = (e: React.MouseEvent, addr: any) => {
    e.stopPropagation()
    setEditingAddressId(addr._id)
    setSelectedAddressId(addr._id)
    const isPreset = PRESET_LABELS.some(p => p.id === addr.label)
    if (isPreset) {
      setAddressLabel(addr.label || "Home")
      setCustomLabel("")
    } else {
      setAddressLabel("Other")
      setCustomLabel(addr.label || "")
    }
    setForm(prev => ({
      ...prev,
      fullName: addr.fullName || prev.fullName,
      phone: (addr.phone || "").replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10),
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "Maharashtra",
      pincode: addr.pincode || "",
    }))
    setAddressMode("edit")
  }

  const handleAddNewAddressClick = () => {
    setSelectedAddressId("")
    setEditingAddressId(null)
    setAddressLabel("Home")
    setCustomLabel("")
    setForm(prev => ({
      ...prev,
      street: "",
      city: "",
      state: "Maharashtra",
      pincode: "",
    }))
    setAddressMode("new")
  }

  const effectiveLabel = addressLabel === "Other" && customLabel.trim() ? customLabel.trim() : addressLabel

  // Validation function
  const validateAddressInputs = (): boolean => {
    if (!form.fullName.trim()) {
      alert("Please enter full name.")
      return false
    }

    if (!isAuthenticated && !form.email.trim()) {
      alert("Please enter email address.")
      return false
    }

    const cleanPhone = form.phone.replace(/\D/g, "")
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).")
      return false
    }

    if (!form.street.trim()) {
      alert("Please enter complete street address.")
      return false
    }

    if (!form.city.trim()) {
      alert("Please enter city name.")
      return false
    }

    if (!form.state.trim()) {
      alert("Please select your state.")
      return false
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      alert("Please enter a valid 6-digit PIN code.")
      return false
    }

    return true
  }

  // Mutations
  const createAddressMutation = useMutation({
    mutationFn: (data: any) => addressApi.create(data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["checkout-addresses"] })
      const newAddr = res.data?.data
      if (newAddr?._id) {
        selectAddress(newAddr)
      } else {
        setAddressMode("select")
      }
      setSaveSuccessMsg(`New address saved as "${effectiveLabel}"!`)
      setTimeout(() => setSaveSuccessMsg(null), 3000)
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to save address")
    },
  })

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => addressApi.update(id, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["checkout-addresses"] })
      const updatedAddr = res.data?.data
      if (updatedAddr) {
        selectAddress(updatedAddr)
      } else {
        setAddressMode("select")
      }
      setSaveSuccessMsg("Address updated successfully!")
      setTimeout(() => setSaveSuccessMsg(null), 3000)
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to update address")
    }
  })

  const deleteAddressMutation = useMutation({
    mutationFn: (id: string) => addressApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkout-addresses"] })
    },
  })

  const handleSaveOrUpdateAddressForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAddressInputs()) return

    const payload = {
      label: effectiveLabel,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      country: "India",
    }

    if (addressMode === "edit" && editingAddressId) {
      updateAddressMutation.mutate({ id: editingAddressId, data: payload })
    } else {
      createAddressMutation.mutate({ ...payload, isDefault: savedAddresses.length === 0 })
    }
  }

  const shippingCharge = totalAmount >= 499 ? 0 : 49
  const grandTotal = totalAmount + shippingCharge

  const createOrderMutation = useMutation({
    mutationFn: (data: any) => orderApi.create(data),
    onSuccess: (res) => {
      // If customer requested to save new address to account upon checkout
      if (isAuthenticated && addressMode === "new" && saveAddressToAccount && form.street) {
        addressApi.create({
          label: effectiveLabel,
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          country: "India",
        }).catch(() => {})
      }

      // Clear cart immediately upon order placement
      clearCart().catch(() => {})
      
      const payu = res.data.data.payu
      if (payu) {
        // Create a hidden form to submit to PayU
        const formEl = document.createElement("form")
        formEl.setAttribute("method", "POST")
        formEl.setAttribute("action", payu.actionUrl)

        const fields = ["key", "txnid", "amount", "productinfo", "firstname", "email", "phone", "surl", "furl", "hash"]
        fields.forEach(key => {
          const input = document.createElement("input")
          input.setAttribute("type", "hidden")
          input.setAttribute("name", key)
          input.setAttribute("value", payu[key])
          formEl.appendChild(input)
        })

        document.body.appendChild(formEl)
        formEl.submit()
      }
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to initiate checkout")
    }
  })

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateAddressInputs()) return
    
    // Verified user email is used for logged-in users; guest email is used for guest checkout
    const orderEmail = isAuthenticated && user?.email ? user.email : form.email

    const payload = {
      items: items.map(i => ({ productId: i.product._id, quantity: i.quantity, productObj: i.product })),
      guestEmail: orderEmail,
      guestName: form.fullName.trim(),
      guestPhone: form.phone.trim(),
      shippingAddressId: selectedAddressId && addressMode === "select" ? selectedAddressId : undefined,
      shippingAddress: {
        label: effectiveLabel,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        country: "India",
        isDefault: addressMode === "select" ? false : true,
      }
    }

    createOrderMutation.mutate(payload)
  }

  if (items.length === 0) return null

  const selectedAddress = savedAddresses.find((a: any) => a._id === selectedAddressId)

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Address Selection & Form */}
          <div className="lg:w-2/3 space-y-6">

            {saveSuccessMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* ── LOGGED-IN ACCOUNT EMAIL BANNER ── */}
            {isAuthenticated && user && (
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-gray-500 block text-[10px] font-bold uppercase tracking-wider">Account Email (Verified)</span>
                    <span className="font-bold text-gray-900 text-xs">{user.email}</span>
                  </div>
                </div>
                <span className="text-[11px] text-gray-500 font-medium sm:text-right">
                  Tax invoice & order confirmation will be sent here
                </span>
              </div>
            )}

            {/* ── SAVED ADDRESSES SECTION (When user is logged in & has saved addresses) ── */}
            {isAuthenticated && savedAddresses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black uppercase tracking-wide text-gray-900 flex items-center gap-2">
                    <span className="h-6 w-1 bg-black rounded-full block"></span>
                    Select Delivery Address ({savedAddresses.length})
                  </h2>
                  <button
                    type="button"
                    onClick={handleAddNewAddressClick}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
                      addressMode === "new"
                        ? "bg-black text-white border-black shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add New Address
                  </button>
                </div>

                {/* Address Cards Grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr: any) => {
                    const isSelected = selectedAddressId === addr._id && addressMode === "select"
                    const LabelIcon = addr.label?.toLowerCase() === "office" 
                      ? Building2 
                      : addr.label?.toLowerCase() === "work" 
                        ? Briefcase 
                        : Home

                    return (
                      <div
                        key={addr._id}
                        onClick={() => selectAddress(addr)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between group ${
                          isSelected
                            ? "border-black bg-gray-50/80 shadow-sm ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-400 bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-200 text-gray-800">
                              <LabelIcon className="h-3 w-3" />
                              {addr.label || "Home"}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {isSelected && (
                                <span className="h-5 w-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] shadow-sm">
                                  <Check className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className="font-bold text-sm text-gray-900">{addr.fullName}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">+91 {addr.phone}</p>
                          <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                            {addr.street}, {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                        </div>

                        {/* Card Actions: Edit & Delete */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={(e) => handleStartEditAddress(e, addr)}
                            className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <Pencil className="h-3 w-3" /> Edit Address
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm(`Delete "${addr.label}" address?`)) {
                                deleteAddressMutation.mutate(addr._id)
                              }
                            }}
                            className="text-xs text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Selected Address Summary Banner (when in 'select' mode) */}
                {addressMode === "select" && selectedAddress && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                      <div>
                        <span className="font-bold text-emerald-900">
                          Delivering to: {selectedAddress.fullName} ({selectedAddress.label || "Home"})
                        </span>
                        <p className="text-emerald-800 text-[11px] mt-0.5">
                          {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode} (+91 {selectedAddress.phone})
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStartEditAddress(e, selectedAddress)}
                      className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-900 rounded-lg font-bold text-[11px] hover:bg-emerald-100 transition-colors shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" /> Edit This Address
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── ADDRESS FORM: SHOWN ONLY WHEN ADDING NEW OR EDITING (OR GUEST) ── */}
            {(addressMode === "new" || addressMode === "edit" || !isAuthenticated || savedAddresses.length === 0) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black uppercase tracking-wide text-gray-900 flex items-center gap-2">
                    <span className="h-8 w-1 bg-black rounded-full block"></span>
                    {addressMode === "edit" ? `Edit Address (${effectiveLabel})` : "Add New Delivery Address"}
                  </h2>

                  {/* Cancel button if user has existing saved addresses */}
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const defaultAddr = savedAddresses.find((a: any) => a.isDefault) || savedAddresses[0]
                        if (defaultAddr) selectAddress(defaultAddr)
                        else setAddressMode("select")
                      }}
                      className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  )}
                </div>

                {!isAuthenticated && (
                  <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
                    Checking out as a Guest. We will send your order confirmation and tax invoice to your email.
                  </div>
                )}

                <form onSubmit={handleSaveOrUpdateAddressForm} className="space-y-5">
                  {/* Address Type / Label Chips (Home, Office, Work, Other) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Address Type / Label
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {PRESET_LABELS.map((item) => {
                        const Icon = item.icon
                        const isActive = addressLabel === item.id
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setAddressLabel(item.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                              isActive
                                ? "bg-black text-white border-black shadow-sm"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{item.label}</span>
                          </button>
                        )
                      })}

                      {addressLabel === "Other" && (
                        <input
                          type="text"
                          value={customLabel}
                          onChange={(e) => setCustomLabel(e.target.value)}
                          placeholder="e.g. Hostel, Mom's House"
                          className="px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none w-44"
                        />
                      )}
                    </div>
                  </div>

                  <div className={`grid gap-5 ${!isAuthenticated ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        value={form.fullName} 
                        onChange={e => setForm({...form, fullName: e.target.value})} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm" 
                        placeholder="Kartik Parmar" 
                      />
                    </div>

                    {/* Email address field is only shown to guest users */}
                    {!isAuthenticated && (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address (For Invoice & Tracking)</label>
                        <input 
                          required 
                          type="email" 
                          value={form.email} 
                          onChange={e => setForm({...form, email: e.target.value})} 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm" 
                          placeholder="kartik@example.com" 
                        />
                      </div>
                    )}
                  </div>

                  {/* Phone Number: Strict 10 Digits with +91 Prefix */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Phone Number (10 Digits)</span>
                      {form.phone && form.phone.length !== 10 && (
                        <span className="text-[11px] text-amber-600 font-semibold normal-case">
                          {10 - form.phone.length} more digit{10 - form.phone.length > 1 ? "s" : ""} needed
                        </span>
                      )}
                    </label>
                    <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all bg-white">
                      <span className="inline-flex items-center px-3.5 bg-gray-100 text-gray-700 font-bold text-xs border-r border-gray-200 select-none">
                        🇮🇳 +91
                      </span>
                      <input 
                        required 
                        type="tel" 
                        inputMode="numeric"
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        value={form.phone} 
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10)
                          setForm({...form, phone: val})
                        }} 
                        className="w-full px-4 py-3 outline-none font-mono text-sm tracking-wider" 
                        placeholder="9619410050" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Complete Address</label>
                    <textarea 
                      required 
                      value={form.street} 
                      onChange={e => setForm({...form, street: e.target.value})} 
                      rows={2} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none text-sm" 
                      placeholder="House/Flat No., Building Name, Street, Landmark" 
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">City</label>
                      <input 
                        required 
                        type="text" 
                        value={form.city} 
                        onChange={e => setForm({...form, city: e.target.value})} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm" 
                        placeholder="Mumbai" 
                      />
                    </div>

                    {/* State Dropdown with all 28 Indian States & 8 UTs */}
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">State</label>
                      <select 
                        required 
                        value={form.state} 
                        onChange={e => setForm({...form, state: e.target.value})} 
                        className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white text-sm cursor-pointer"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((stateName) => (
                          <option key={stateName} value={stateName}>{stateName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">PIN Code (6 Digits)</label>
                      <input 
                        required 
                        type="text" 
                        inputMode="numeric"
                        maxLength={6}
                        value={form.pincode} 
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                          setForm({...form, pincode: val})
                        }} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-mono text-sm tracking-wider" 
                        placeholder="401105" 
                      />
                    </div>
                  </div>

                  {/* Save or Update Address Button */}
                  {isAuthenticated && (
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                      {savedAddresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const defaultAddr = savedAddresses.find((a: any) => a.isDefault) || savedAddresses[0]
                            if (defaultAddr) selectAddress(defaultAddr)
                            else setAddressMode("select")
                          }}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      
                      <button
                        type="submit"
                        disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
                        className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        {createAddressMutation.isPending || updateAddressMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span>{addressMode === "edit" ? "Update Address" : "Save & Deliver Here"}</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Pay Button */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-black uppercase tracking-wide text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img 
                        src={getImageUrl(item.product.images?.[0])} 
                        alt={item.product.name} 
                        className="h-full w-full object-cover" 
                      />
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

              {/* Delivery Destination Notice */}
              {selectedAddress && addressMode === "select" && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl border text-[11px] text-gray-600">
                  <span className="font-bold text-gray-900 block mb-0.5">
                    Shipping to {selectedAddress.label || "Home"}:
                  </span>
                  <span className="truncate block">{selectedAddress.fullName} · {selectedAddress.street}, {selectedAddress.city}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleOrderSubmit}
                disabled={createOrderMutation.isPending}
                className="w-full py-4 rounded-xl bg-black text-white font-extrabold uppercase tracking-wide text-sm hover:bg-gray-900 active:scale-95 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
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
