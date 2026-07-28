import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "../../context/AuthContext"
import { authApi } from "../../lib/api"
import { useForm } from "react-hook-form"
import { Loader2, CheckCircle } from "lucide-react"

export function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const profileForm = useForm({ defaultValues: { name: user?.name || "", phone: user?.phone || "" } })
  const passwordForm = useForm()

  const profileMutation = useMutation({
    mutationFn: (data: any) => authApi.updateMe(data),
    onSuccess: () => { refreshUser(); setProfileSuccess(true); setTimeout(() => setProfileSuccess(false), 2000) },
  })

  const passwordMutation = useMutation({
    mutationFn: (data: any) => authApi.updatePassword(data),
    onSuccess: () => { passwordForm.reset(); setPasswordSuccess(true); setTimeout(() => setPasswordSuccess(false), 2000) },
    onError: (err: any) => setPasswordError(err.response?.data?.message || "Failed"),
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      {/* Profile */}
      <div className="rounded-2xl border bg-card p-6 mb-6">
        <h2 className="font-semibold mb-4">Personal Information</h2>
        <form onSubmit={profileForm.handleSubmit((d) => profileMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input {...profileForm.register("name", { required: true })} className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={user?.email} disabled className="w-full border rounded-xl px-3 py-2.5 text-sm bg-muted cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input {...profileForm.register("phone")} className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <button type="submit" disabled={profileMutation.isPending} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
            {profileSuccess ? <CheckCircle className="h-4 w-4" /> : profileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {profileSuccess ? "Saved!" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Change Password</h2>
        {passwordError && <div className="mb-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{passwordError}</div>}
        <form onSubmit={passwordForm.handleSubmit((d) => { setPasswordError(""); passwordMutation.mutate(d) })} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input {...passwordForm.register("currentPassword", { required: true })} type="password" className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input {...passwordForm.register("newPassword", { required: true, minLength: { value: 6, message: "At least 6 characters" } })} type="password" className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <button type="submit" disabled={passwordMutation.isPending} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
            {passwordSuccess ? <CheckCircle className="h-4 w-4" /> : passwordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {passwordSuccess ? "Updated!" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
