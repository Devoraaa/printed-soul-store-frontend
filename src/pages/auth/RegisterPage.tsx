import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2, Mail, User, Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, RotateCw, AlertCircle } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

export function RegisterPage() {
  const { sendSignupOtp, verifySignupOtp } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<"details" | "otp">("details")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    let interval: any = null
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleSendSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const cleanPhone = phone.replace(/\D/g, "")
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number.")
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long with uppercase, lowercase, number, and special character.")
      return
    }

    setLoading(true)
    try {
      await sendSignupOtp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        password,
      })
      setSuccess(`Verification OTP sent to ${email}`)
      setStep("otp")
      setResendTimer(60)
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await verifySignupOtp(email.trim().toLowerCase(), otp.trim())
      navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-1">Create an Account</h2>
      <p className="text-muted-foreground text-sm mb-6">Join Printed Soul for custom cases & orders</p>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {step === "details" ? (
        <form onSubmit={handleSendSignupOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Phone Number (10 Digits)</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-black bg-white">
              <span className="inline-flex items-center px-3 bg-gray-100 text-gray-700 font-bold text-xs border-r border-gray-200 select-none">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="9876543210"
                className="w-full px-3 py-2.5 outline-none font-mono text-sm tracking-wider"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Choose Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters (A-Z, 0-9, #)"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Must contain 8+ characters, uppercase, lowercase, number & special char.</p>
          </div>

          <button
            type="submit"
            disabled={loading || !name || !email || phone.length !== 10 || !password}
            className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            <span>Continue & Verify Email</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 text-center mb-2">
              Enter 6-digit OTP sent to {email}
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-center text-3xl font-bold font-mono tracking-[8px]"
              placeholder="------"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            <span>Verify & Create Account</span>
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setStep("details")}
              className="text-gray-500 hover:text-black"
            >
              ← Edit Details
            </button>

            <button
              type="button"
              disabled={resendTimer > 0 || loading}
              onClick={() => sendSignupOtp({ name, email, phone, password })}
              className="text-violet-600 hover:text-violet-800 font-bold disabled:opacity-50 flex items-center gap-1"
            >
              <RotateCw className="h-3 w-3" />
              <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}</span>
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-xs text-muted-foreground mt-8">
        Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
