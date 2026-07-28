import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Loader2, Mail, User, Phone } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

export function RegisterPage() {
  const { sendOtp, verifyOtp } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"details" | "otp">("details")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmitDetails = async (data: any) => {
    setError(""); setLoading(true)
    try {
      await sendOtp({ name: data.name, email: data.email, phone: data.phone })
      setEmail(data.email)
      setStep("otp")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.")
    } finally { setLoading(false) }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(""); setLoading(true)
    try {
      await verifyOtp(email, otp)
      navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP")
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-1">Create account</h2>
      <p className="text-muted-foreground text-sm mb-8">Join thousands of happy customers</p>

      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      {step === "details" ? (
        <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input {...register("name", { required: "Name is required" })} placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
            </div>
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Invalid email" } })}
                type="email" placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
            </div>
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input {...register("phone", { required: "Phone is required", minLength: { value: 10, message: "Invalid phone number" } })} type="tel" placeholder="9876543210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
            </div>
            {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message as string}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-6">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-center">Enter 6-digit OTP sent to {email}</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center text-3xl font-bold tracking-[0.5em]"
              placeholder="------"
              autoFocus
            />
          </div>
          <button type="submit" disabled={loading || otp.length !== 6}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-6">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Verify & Create Account
          </button>
          <button type="button" onClick={() => setStep("details")} className="w-full text-sm text-primary hover:underline mt-2">
            Back
          </button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
