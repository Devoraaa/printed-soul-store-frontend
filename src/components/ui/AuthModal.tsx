import React, { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { X, Mail, Phone, User, Loader2, ArrowRight, ShieldCheck } from "lucide-react"

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, sendOtp, verifyOtp } = useAuth()
  const [step, setStep] = useState<"email" | "signup-details" | "otp">("email")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  if (!isAuthModalOpen) return null

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await sendOtp({ email, name, phone })
      setSuccess("OTP sent to your email!")
      setStep("otp")
    } catch (err: any) {
      if (err.response?.data?.message?.includes("requires name and phone")) {
        setStep("signup-details")
      } else {
        setError(err.response?.data?.message || "Failed to send OTP")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await verifyOtp(email, otp)
      // On success, modal closes automatically via context
      setStep("email") // reset for next time
      setEmail("")
      setName("")
      setPhone("")
      setOtp("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden page-enter-active">
        
        {/* Close Button */}
        <button 
          onClick={closeAuthModal} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Art */}
        <div className="bg-gray-50 p-8 text-center border-b border-gray-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4 border border-gray-200">
            {step === "otp" ? <ShieldCheck className="w-8 h-8 text-black" /> : <User className="w-8 h-8 text-black" />}
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 tracking-tight">
            {step === "email" ? "Welcome Back" : step === "signup-details" ? "Create Account" : "Verify OTP"}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {step === "email" ? "Enter your email to sign in or create an account" : 
             step === "signup-details" ? "Looks like you're new! Please provide your details." : 
             `We sent a code to ${email}`}
          </p>
        </div>

        {/* Form Area */}
        <div className="p-8">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100 text-center">{success}</div>}

          {(step === "email" || step === "signup-details") && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={step === "signup-details"}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {step === "signup-details" && (
                <>
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-sm"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3.5 rounded-full font-medium transition-all shadow-lg shadow-gray-900/20 active:scale-[0.98] mt-6"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    {step === "email" ? "Continue with Email" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Enter 6-digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-center text-3xl font-bold tracking-[0.5em] shadow-sm"
                  placeholder="------"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white py-3.5 rounded-full font-medium transition-all shadow-lg shadow-black/20 active:scale-[0.98] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Didn't receive code?{" "}
                <button type="button" onClick={handleSendOtp} className="text-black font-semibold hover:underline">
                  Resend
                </button>
              </p>
            </form>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  )
}
