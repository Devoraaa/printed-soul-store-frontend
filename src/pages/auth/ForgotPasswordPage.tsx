import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Mail, Loader2, CheckCircle } from "lucide-react"
import { authApi } from "../../lib/api"

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: any) => {
    setError(""); setLoading(true)
    try {
      await authApi.forgotPassword(data.email)
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally { setLoading(false) }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-black mb-2">Check your email</h2>
        <p className="text-muted-foreground mb-6">We've sent a password reset link to your email address.</p>
        <Link to="/login" className="text-primary font-medium hover:underline">← Back to login</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-1">Forgot password?</h2>
      <p className="text-muted-foreground text-sm mb-8">Enter your email and we'll send a reset link.</p>

      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input {...register("email", { required: "Email is required" })} type="email" placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
          </div>
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message as string}</p>}
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Send Reset Link
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link to="/login" className="text-primary font-medium hover:underline">← Back to login</Link>
      </p>
    </div>
  )
}
