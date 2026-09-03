import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, RotateCw, AlertCircle } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

export function LoginPage() {
  const { loginWithPassword, sendLoginOtp, verifyLoginOtp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<"password" | "otp-email" | "otp-verify">("password")
  const [email, setEmail] = useState("")
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await loginWithPassword(email.trim().toLowerCase(), password)
      navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await sendLoginOtp(email.trim().toLowerCase())
      setSuccess(`Login OTP sent to ${email.trim().toLowerCase()}`)
      setMode("otp-verify")
      setResendTimer(60)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await verifyLoginOtp(email.trim().toLowerCase(), otp.trim())
      navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-1">Welcome Back</h2>
      <p className="text-muted-foreground text-sm mb-6">Log in to your Printed Soul account</p>

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

      {/* 1. PASSWORD LOGIN */}
      {mode === "password" && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            <span>Log In</span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setMode("otp-email"); setError(""); setSuccess("") }}
              className="text-xs font-bold text-violet-700 hover:text-violet-900 hover:underline"
            >
              Log in with OTP instead →
            </button>
          </div>
        </form>
      )}

      {/* 2. OTP LOGIN: SEND OTP */}
      {mode === "otp-email" && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Registered Email</label>
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
            <p className="text-[11px] text-gray-400 mt-1">
              We check our records and email an OTP if an account exists.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            <span>Send Login OTP</span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setMode("password"); setError(""); setSuccess("") }}
              className="text-xs font-bold text-gray-600 hover:text-black hover:underline"
            >
              ← Back to Password Login
            </button>
          </div>
        </form>
      )}

      {/* 3. OTP LOGIN: VERIFY OTP */}
      {mode === "otp-verify" && (
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
            <span>Verify & Log In</span>
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setMode("otp-email")}
              className="text-gray-500 hover:text-black"
            >
              ← Change Email
            </button>

            <button
              type="button"
              disabled={resendTimer > 0 || loading}
              onClick={() => sendLoginOtp(email.trim().toLowerCase())}
              className="text-violet-600 hover:text-violet-800 font-bold disabled:opacity-50 flex items-center gap-1"
            >
              <RotateCw className="h-3 w-3" />
              <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}</span>
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-xs text-muted-foreground mt-8">
        Don't have an account? <Link to="/register" className="text-black font-bold hover:underline">Create one</Link>
      </p>
    </div>
  )
}
