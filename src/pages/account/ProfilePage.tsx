import React, { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "../../context/AuthContext"
import { authApi } from "../../lib/api"
import { 
  Loader2, CheckCircle2, ShieldCheck, Mail, Eye, EyeOff, 
  Lock, KeyRound, AlertCircle, ArrowRight, RotateCw, X 
} from "lucide-react"

export function ProfilePage() {
  const { user, refreshUser } = useAuth()

  // Profile Info State
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState((user?.phone || "").replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10))
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setPhone((user.phone || "").replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10))
    }
  }, [user])

  // Email Change State
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [emailOtp, setEmailOtp] = useState("")
  const [emailStep, setEmailStep] = useState<"input" | "otp">("input")
  const [emailError, setEmailError] = useState("")
  const [emailSuccess, setEmailSuccess] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  // Resend countdown timer
  useEffect(() => {
    let interval: any = null
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // Password State
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Strict Password Validation Rules
  const hasMinLength = newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasLowercase = /[a-z]/.test(newPassword)
  const hasNumber = /\d/.test(newPassword)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

  const isPasswordValid = 
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && passwordsMatch

  // Calculate Password Strength Score (0 to 100)
  const calculateStrength = () => {
    if (!newPassword) return { score: 0, text: "", color: "" }
    let passed = 0
    if (hasMinLength) passed++
    if (hasUppercase) passed++
    if (hasLowercase) passed++
    if (hasNumber) passed++
    if (hasSpecial) passed++

    if (passed <= 2) return { score: 25, text: "Weak", color: "bg-red-500" }
    if (passed === 3) return { score: 50, text: "Fair", color: "bg-amber-500" }
    if (passed === 4) return { score: 75, text: "Good", color: "bg-blue-500" }
    return { score: 100, text: "Strong", color: "bg-emerald-500" }
  }

  const strength = calculateStrength()

  // Mutations
  const profileMutation = useMutation({
    mutationFn: (data: any) => authApi.updateMe(data),
    onSuccess: () => {
      refreshUser()
      setProfileSuccess(true)
      setProfileError("")
      setTimeout(() => setProfileSuccess(false), 3000)
    },
    onError: (err: any) => {
      setProfileError(err.response?.data?.message || "Failed to update profile")
    },
  })

  const sendEmailOtpMutation = useMutation({
    mutationFn: (data: { newEmail: string }) => authApi.sendEmailChangeOtp(data),
    onSuccess: () => {
      setEmailStep("otp")
      setEmailError("")
      setResendTimer(60)
    },
    onError: (err: any) => {
      setEmailError(err.response?.data?.message || "Failed to send verification code")
    },
  })

  const verifyEmailOtpMutation = useMutation({
    mutationFn: (data: { newEmail: string; otp: string }) => authApi.verifyEmailChangeOtp(data),
    onSuccess: (res: any) => {
      if (res.data?.meta?.token) {
        localStorage.setItem("pss_token", res.data.meta.token)
      }
      refreshUser()
      setEmailSuccess("Email updated successfully!")
      setTimeout(() => {
        setIsChangingEmail(false)
        setEmailStep("input")
        setNewEmail("")
        setEmailOtp("")
        setEmailSuccess("")
      }, 2000)
    },
    onError: (err: any) => {
      setEmailError(err.response?.data?.message || "Invalid or expired OTP")
    },
  })

  const passwordMutation = useMutation({
    mutationFn: (data: any) => authApi.updatePassword(data),
    onSuccess: () => {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordSuccess(true)
      setPasswordError("")
      setTimeout(() => setPasswordSuccess(false), 3500)
    },
    onError: (err: any) => {
      setPasswordError(err.response?.data?.message || "Failed to update password")
    },
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError("")
    const cleanPhone = phone.replace(/\D/g, "")
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setProfileError("Please enter a valid 10-digit Indian mobile number.")
      return
    }

    profileMutation.mutate({
      name: name.trim(),
      phone: cleanPhone,
    })
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (!isPasswordValid) {
      setPasswordError("Please satisfy all password security requirements before submitting.")
      return
    }

    passwordMutation.mutate({
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim(),
      confirmPassword: confirmPassword.trim(),
    })
  }

  const handleSendEmailCode = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    const cleanEmail = newEmail.trim().toLowerCase()
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(cleanEmail)) {
      setEmailError("Please enter a valid email address.")
      return
    }
    if (cleanEmail === user?.email?.toLowerCase()) {
      setEmailError("This is already your current email address.")
      return
    }
    sendEmailOtpMutation.mutate({ newEmail: cleanEmail })
  }

  const handleVerifyEmailCode = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    if (emailOtp.trim().length !== 6) {
      setEmailError("Please enter the 6-digit verification code.")
      return
    }
    verifyEmailOtpMutation.mutate({
      newEmail: newEmail.trim().toLowerCase(),
      otp: emailOtp.trim(),
    })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal account settings and security</p>
      </div>

      <div className="space-y-8">
        {/* ── 1. PERSONAL INFORMATION ── */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Personal Information</h2>
              <p className="text-xs text-gray-500 mt-0.5">Your name, verified email, and contact number</p>
            </div>
          </div>

          {profileError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {profileSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Personal details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                placeholder="Kartik"
              />
            </div>

            {/* Email Field with Verified Status & Change Email Action */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" /> Verified
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 text-gray-700 font-medium cursor-not-allowed"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingEmail(true)
                    setEmailStep("input")
                    setEmailError("")
                    setNewEmail("")
                    setEmailOtp("")
                  }}
                  className="px-4 py-3 rounded-xl border border-gray-300 hover:border-black hover:bg-gray-50 text-xs font-bold text-gray-800 transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  Change Email
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Tax invoices, Delhivery tracking updates, and login codes are sent to this address.
              </p>
            </div>

            {/* Phone Number with +91 Prefix */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Phone Number (10 Digits)</span>
                {phone && phone.length !== 10 && (
                  <span className="text-[11px] text-amber-600 font-semibold normal-case">
                    {10 - phone.length} more digit{10 - phone.length > 1 ? "s" : ""} needed
                  </span>
                )}
              </label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all bg-white">
                <span className="inline-flex items-center px-3.5 bg-gray-100 text-gray-700 font-bold text-xs border-r border-gray-200 select-none">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full px-4 py-3 outline-none font-mono text-sm tracking-wider"
                  placeholder="9619410050"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileMutation.isPending}
                className="px-6 py-3 rounded-xl bg-black text-white text-xs font-extrabold uppercase tracking-wide hover:bg-gray-900 active:scale-95 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {profileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* ── 2. STRICT CHANGE PASSWORD ── */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-700" />
                <span>Change Password</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Protect your account with a strong, multi-factor password</p>
            </div>
          </div>

          {passwordError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Password updated successfully! You can now use your new password.</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Real-time Strength Meter Bar */}
              {newPassword && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-gray-500">Strength:</span>
                    <span className={strength.score === 100 ? "text-emerald-600" : "text-gray-700"}>{strength.text}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Strict Password Requirements Checklist */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                Password Security Checklist:
              </span>
              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-2 font-medium ${hasMinLength ? "text-emerald-700 font-bold" : "text-gray-500"}`}>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-400"}`}>
                    ✓
                  </span>
                  <span>Minimum 8 characters</span>
                </div>

                <div className={`flex items-center gap-2 font-medium ${hasUppercase ? "text-emerald-700 font-bold" : "text-gray-500"}`}>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${hasUppercase ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-400"}`}>
                    ✓
                  </span>
                  <span>At least 1 uppercase letter (A-Z)</span>
                </div>

                <div className={`flex items-center gap-2 font-medium ${hasLowercase ? "text-emerald-700 font-bold" : "text-gray-500"}`}>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${hasLowercase ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-400"}`}>
                    ✓
                  </span>
                  <span>At least 1 lowercase letter (a-z)</span>
                </div>

                <div className={`flex items-center gap-2 font-medium ${hasNumber ? "text-emerald-700 font-bold" : "text-gray-500"}`}>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-400"}`}>
                    ✓
                  </span>
                  <span>At least 1 number (0-9)</span>
                </div>

                <div className={`flex items-center gap-2 font-medium ${hasSpecial ? "text-emerald-700 font-bold" : "text-gray-500"}`}>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${hasSpecial ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-400"}`}>
                    ✓
                  </span>
                  <span>At least 1 special char (@, #, $, etc.)</span>
                </div>

                <div className={`flex items-center gap-2 font-medium ${passwordsMatch ? "text-emerald-700 font-bold" : "text-gray-500"}`}>
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${passwordsMatch ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-400"}`}>
                    ✓
                  </span>
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isPasswordValid || passwordMutation.isPending}
                className="px-6 py-3 rounded-xl bg-black text-white text-xs font-extrabold uppercase tracking-wide hover:bg-gray-900 active:scale-95 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {passwordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── EMAIL CHANGE MODAL WITH OTP VERIFICATION ── */}
      {isChangingEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Update Email Address</h3>
                  <p className="text-[11px] text-gray-500">Requires 2-step OTP verification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingEmail(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {emailError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{emailError}</span>
              </div>
            )}

            {emailSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{emailSuccess}</span>
              </div>
            )}

            {/* STEP 1: Enter New Email */}
            {emailStep === "input" && (
              <form onSubmit={handleSendEmailCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new.email@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                  />
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    We will send a 6-digit OTP to this new email to verify you own it before updating your account.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingEmail(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendEmailOtpMutation.isPending || !newEmail.trim()}
                    className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold flex items-center gap-1.5 hover:bg-gray-900 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {sendEmailOtpMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    <span>Send Verification Code</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter 6-digit OTP */}
            {emailStep === "otp" && (
              <form onSubmit={handleVerifyEmailCode} className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-600">Enter the 6-digit verification code sent to:</p>
                  <p className="font-bold text-sm text-gray-900 font-mono">{newEmail}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider text-center mb-2">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="w-full text-center font-mono text-2xl tracking-[8px] border border-gray-300 rounded-xl py-3 focus:ring-2 focus:ring-black outline-none font-bold"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setEmailStep("input")}
                    className="text-gray-500 hover:text-black font-medium"
                  >
                    ← Change Email
                  </button>

                  <button
                    type="button"
                    disabled={resendTimer > 0 || sendEmailOtpMutation.isPending}
                    onClick={() => sendEmailOtpMutation.mutate({ newEmail: newEmail.trim().toLowerCase() })}
                    className="text-violet-600 hover:text-violet-800 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <RotateCw className={`h-3 w-3 ${sendEmailOtpMutation.isPending ? "animate-spin" : ""}`} />
                    <span>{resendTimer > 0 ? `Resend Code in ${resendTimer}s` : "Resend Code"}</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingEmail(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={verifyEmailOtpMutation.isPending || emailOtp.length !== 6}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {verifyEmailOtpMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    <span>Verify & Update Email</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
