import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2, MapPin, Check } from "lucide-react"
import { addressApi } from "../../lib/api"

const emptyForm = { label: "Home", fullName: "", phone: "", street: "", city: "", state: "", pincode: "", country: "India", isDefault: false }

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
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
          <Plus className="h-4 w-4" /> Add Address
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border bg-card p-6 mb-6">
          <h3 className="font-semibold mb-4">New Address</h3>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form) }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input required value={form.label} onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))} placeholder="Label (Home, Office)" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 col-span-2" />
              <input required value={form.fullName} onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Full Name" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input required value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input required value={form.street} onChange={(e) => setForm(p => ({ ...p, street: e.target.value }))} placeholder="Street" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 col-span-2" />
              <input required value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))} placeholder="City" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input required value={form.state} onChange={(e) => setForm(p => ({ ...p, state: e.target.value }))} placeholder="State" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input required value={form.pincode} onChange={(e) => setForm(p => ({ ...p, pincode: e.target.value }))} placeholder="Pincode" className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
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
