import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2, MapPin, Check } from "lucide-react"
import { addressApi } from "../../lib/api"
import { INDIAN_STATES } from "../../lib/utils"

const emptyForm = { label: "Home", fullName: "", phone: "", street: "", city: "", state: "Maharashtra", pincode: "", country: "India", isDefault: false }

export function AddressesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const { data } = useQuery({ queryKey: ["addresses"], queryFn: () => addressApi.getAll() })
  const addresses = data?.data?.data || []

  const createMutation = useMutation({
    mutationFn: (d: any) => addressApi.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["addresses"] }); setShowForm(false); setForm(emptyForm) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => addressApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium cursor-pointer">
          <Plus className="h-4 w-4" /> Add Address
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border bg-card p-6 mb-6">
          <h3 className="font-semibold mb-4">New Address</h3>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) {
              alert("Please enter a valid 10-digit mobile number.")
              return
            }
            createMutation.mutate({ ...form, phone: form.phone.replace(/\D/g, "") }) 
          }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input required value={form.label} onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))} placeholder="Label (Home, Office, Work)" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 col-span-2" />
              <input required value={form.fullName} onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Full Name" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <div className="flex rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
                <span className="bg-muted px-2 py-2 text-xs font-bold text-muted-foreground flex items-center select-none border-r">+91</span>
                <input 
                  required 
                  type="tel"
                  maxLength={10}
                  value={form.phone} 
                  onChange={(e) => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} 
                  placeholder="10-digit Phone" 
                  className="px-3 py-2 text-sm focus:outline-none w-full" 
                />
              </div>
              <input required value={form.street} onChange={(e) => setForm(p => ({ ...p, street: e.target.value }))} placeholder="Street" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 col-span-2" />
              <input required value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))} placeholder="City" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <select 
                required 
                value={form.state} 
                onChange={(e) => setForm(p => ({ ...p, state: e.target.value }))} 
                className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input 
                required 
                maxLength={6}
                value={form.pincode} 
                onChange={(e) => setForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))} 
                placeholder="6-digit Pincode" 
                className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 col-span-2" 
              />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm(p => ({ ...p, isDefault: e.target.checked }))} />
              Set as default address
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">Save</button>
              <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm) }} className="px-4 py-2 rounded-xl border text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No addresses saved yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((addr: any) => (
            <div key={addr._id} className="relative p-5 rounded-2xl border bg-card">
              {addr.isDefault && (
                <span className="absolute top-3 right-3 flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                  <Check className="h-3 w-3" /> Default
                </span>
              )}
              <p className="font-semibold">{addr.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{addr.fullName}</p>
              <p className="text-sm text-muted-foreground">{addr.phone}</p>
              <p className="text-sm text-muted-foreground">{addr.street}</p>
              <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} — {addr.pincode}</p>
              <button onClick={() => { if (confirm("Delete this address?")) deleteMutation.mutate(addr._id) }}
                className="mt-3 text-xs text-destructive hover:text-destructive/70 flex items-center gap-1">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
