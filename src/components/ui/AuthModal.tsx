import React, { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { 
  X, Mail, Phone, User, Loader2, ArrowRight, 
  ShieldCheck, Lock, Eye, EyeOff, KeyRound, RotateCw, AlertCircle 
} from "lucide-react"

export function AuthModal() {
  const { 
    isAuthModalOpen, closeAuthModal, 
    loginWithPassword, sendLoginOtp, verifyLoginOtp, 
    sendSignupOtp, verifySignupOtp 
  } = useAuth()

  // Tabs: "login" | "signup"
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  // Login Modes: "password" | "otp-email" | "otp-verify"
  const [loginMode, setLoginMode] = useState<"password" | "otp-email" | "otp-verify">("password")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginOtp, setLoginOtp] = useState("")

  // Signup State
  const [signupStep, setSignupStep] = useState<"form" | "otp">("form")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [signupOtp, setSignupOtp] = useState("")

  // Common UI State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  // Countdown timer
  useEffect(() => {
    let interval: any = null
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  if (!isAuthModalOpen) return null

  const resetAll = () => {
    setError("")
    setSuccess("")
    setLoading(false)
    setLoginMode("password")
    setSignupStep("form")
    setLoginPassword("")
    setLoginOtp("")
    setSignupOtp("")
  }

  const handleTabChange = (tab: "login" | "signup") => {
    setActiveTab(tab)
    resetAll()
  }

  // ── Login Handlers ────────────────────────────────────────────────────────
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await loginWithPassword(loginEmail.trim().toLowerCase(), loginPassword)
      resetAll()
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await sendLoginOtp(loginEmail.trim().toLowerCase())
      setSuccess(`Login code sent to ${loginEmail.trim().toLowerCase()}`)
      setLoginMode("otp-verify")
      setResendTimer(60)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await verifyLoginOtp(loginEmail.trim().toLowerCase(), loginOtp.trim())
      resetAll()
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP")
    } finally {
      setLoading(false)
    }
  }

  // ── Signup Handlers ───────────────────────────────────────────────────────
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const cleanPhone = signupPhone.replace(/\D/g, "")
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number.")
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    if (!passwordRegex.test(signupPassword)) {
      setError("Password must be at least 8 chars with uppercase, lowercase, number, and special character.")
      return
    }

    setLoading(true)
    try {
      await sendSignupOtp({
        name: signupName.trim(),
        email: signupEmail.trim().toLowerCase(),
        phone: cleanPhone,
        password: signupPassword,
      })
      setSuccess(`Verification OTP sent to ${signupEmail}`)
      setSignupStep("otp")
      setResendTimer(60)
    } catch (err: any) {
      setError(err.response?.data?.message || "Sign up failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await verifySignupOtp(signupEmail.trim().toLowerCase(), signupOtp.trim())
      resetAll()
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button 
          onClick={closeAuthModal} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Tabs */}
        <div className="flex border-b border-gray-100 pt-3 px-6 bg-gray-50/50">
          <button
            type="button"
            onClick={() => handleTabChange("login")}
            className={`flex-1 py-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === "login" 
                ? "text-black" 
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Log In
            {activeTab === "login" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
          </button>
          
          <button
            type="button"
            onClick={() => handleTabChange("signup")}
            className={`flex-1 py-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === "signup" 
                ? "text-black" 
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Create Account
            {activeTab === "signup" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              TAB 1: LOG IN
              ═════════════════════════════════════════════════════════════════════ */}
          {activeTab === "login" && (
            <div>
              {/* Login Header */}
              <div className="mb-6">
                <h3 className="text-xl font-black text-gray-900">
                  {loginMode === "otp-verify" ? "Enter Login OTP" : "Welcome Back"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {loginMode === "otp-verify" 
                    ? `We sent a 6-digit code to ${loginEmail}` 
                    : loginMode === "password"
                      ? "Log in with your email and password"
                      : "Enter your registered email to receive an OTP"}
                </p>
              </div>

              {/* 1.1 Password Login */}
              {loginMode === "password" && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !loginEmail || !loginPassword}
                    className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-900 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>Log In</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMode("otp-email")
                        setError("")
                        setSuccess("")
                      }}
                      className="text-xs font-bold text-violet-700 hover:text-violet-900 hover:underline cursor-pointer"
                    >
                      Login with OTP instead →
                    </button>
                  </div>
                </form>
              )}

              {/* 1.2 Send Login OTP */}
              {loginMode === "otp-email" && (
                <form onSubmit={handleSendLoginOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      We will check our records and email you a 6-digit login OTP.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !loginEmail}
                    className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-900 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    <span>Send Login OTP</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMode("password")
                        setError("")
                        setSuccess("")
                      }}
                      className="text-xs font-bold text-gray-600 hover:text-black hover:underline cursor-pointer"
                    >
                      ← Back to Password Login
                    </button>
                  </div>
                </form>
              )}

              {/* 1.3 Verify Login OTP */}
              {loginMode === "otp-verify" && (
                <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider text-center mb-2">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-center text-3xl font-bold font-mono tracking-[8px]"
                      placeholder="------"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || loginOtp.length !== 6}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>Verify & Log In</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setLoginMode("otp-email")}
                      className="text-gray-500 hover:text-black"
                    >
                      ← Change Email
                    </button>

                    <button
                      type="button"
                      disabled={resendTimer > 0 || loading}
                      onClick={() => sendLoginOtp(loginEmail.trim().toLowerCase())}
                      className="text-violet-600 hover:text-violet-800 font-bold disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      <RotateCw className="h-3 w-3" />
                      <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Switch to Signup */}
              <div className="border-t border-gray-100 mt-6 pt-4 text-center">
                <p className="text-xs text-gray-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabChange("signup")}
                    className="font-bold text-black hover:underline cursor-pointer"
                  >
                    Sign Up here
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              TAB 2: SIGN UP
              ═════════════════════════════════════════════════════════════════════ */}
          {activeTab === "signup" && (
            <div>
              {/* Signup Header */}
              <div className="mb-6">
                <h3 className="text-xl font-black text-gray-900">
                  {signupStep === "otp" ? "Verify Your Email" : "Create an Account"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {signupStep === "otp"
                    ? `Enter the 6-digit OTP code sent to ${signupEmail}`
                    : "Sign up to track orders, save multiple addresses & fast checkout"}
                </p>
              </div>

              {/* 2.1 Sign Up Details Form */}
              {signupStep === "form" && (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number (10 Digits)</label>
                    <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all bg-white">
                      <span className="inline-flex items-center px-3 bg-gray-100 text-gray-700 font-bold text-xs border-r border-gray-200 select-none">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        required
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="w-full px-3 py-2.5 outline-none font-mono text-sm tracking-wider"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Choose Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                        placeholder="Min 8 chars (A-Z, a-z, 0-9, #)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                      >
                        {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Must contain 8+ characters, uppercase, lowercase, number & special symbol.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !signupName || !signupEmail || signupPhone.length !== 10 || !signupPassword}
                    className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-900 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>Continue & Verify Email</span>
                  </button>
                </form>
              )}

              {/* 2.2 Sign Up OTP Verification */}
              {signupStep === "otp" && (
                <form onSubmit={handleVerifySignupOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider text-center mb-2">
                      Enter 6-Digit Email Verification Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      value={signupOtp}
                      onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-center text-3xl font-bold font-mono tracking-[8px]"
                      placeholder="------"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || signupOtp.length !== 6}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>Verify OTP & Complete Sign Up</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setSignupStep("form")}
                      className="text-gray-500 hover:text-black"
                    >
                      ← Edit Details
                    </button>

                    <button
                      type="button"
                      disabled={resendTimer > 0 || loading}
                      onClick={() => sendSignupOtp({
                        name: signupName,
                        email: signupEmail,
                        phone: signupPhone,
                        password: signupPassword
                      })}
                      className="text-violet-600 hover:text-violet-800 font-bold disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      <RotateCw className="h-3 w-3" />
                      <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Switch to Login */}
              <div className="border-t border-gray-100 mt-6 pt-4 text-center">
                <p className="text-xs text-gray-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabChange("login")}
                    className="font-bold text-black hover:underline cursor-pointer"
                  >
                    Log In here
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-3.5 text-center text-[11px] text-gray-400 border-t border-gray-100">
          Printed Soul Store · Secure 256-bit encrypted authentication
        </div>
      </div>
    </div>
  )
}
