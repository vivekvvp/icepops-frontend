"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { useRegisterMutation, useGoogleAuthMutation } from "@/lib/services/api"
import { toast } from "sonner"
import { useGoogleLogin } from "@react-oauth/google"

const inputStyle: React.CSSProperties = {
  borderRadius: '4px',
  border: '1px solid rgb(220, 223, 230)',
  backgroundColor: 'rgb(255, 255, 255)',
  color: 'rgb(15, 20, 35)',
  padding: '8px 12px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
}

const labelStyle = "block text-xs font-bold mb-1.5 uppercase tracking-wider"

export default function RegisterPage() {
  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()
  const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation()
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "",
  })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match"); return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters"); return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!validateForm()) return
    try {
      const { confirmPassword, ...registerData } = formData
      const dataToSend = { ...registerData, phone: registerData.phone || undefined }
      const result = await register(dataToSend).unwrap()
      toast.success(`Welcome to IcePops, ${result.data.user.name}!`)
      if (result.data.user.role === 'ADMIN') router.push("/admin")
      else router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err.data?.message || "Registration failed. Please try again.")
      toast.error(err.data?.message || "Registration failed. Please try again.")
    }
  }

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      const result = await googleAuth(tokenResponse.access_token).unwrap()
      toast.success(`Welcome to IcePops, ${result.data.user.name}!`)
      if (result.data.user.role === 'ADMIN') router.push("/admin")
      else router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err.data?.message || "Google sign-in failed. Please try again.")
      toast.error(err.data?.message || "Google sign-in failed. Please try again.")
    }
  }

  const signUpWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setError("Google sign-up was cancelled or failed.")
      toast.error("Google sign-up failed")
    },
  })

  const disabled = isLoading || isGoogleLoading

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: 'rgb(246, 247, 249)' }}
    >
<div className="w-full space-y-6" style={{ maxWidth: '580px' }}>

        {/* ── Logo ── */}
        <div className="flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-10 h-10"
              style={{ borderRadius: '8px', backgroundColor: 'rgb(185, 28, 28)' }}
            >
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <path
                  clipRule="evenodd"
                  d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                  fill="white"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
              IcePops
            </span>
          </Link>
          <p className="text-sm" style={{ color: 'rgb(110, 118, 135)' }}>
            Create your account and explore amazing flavors
          </p>
        </div>

        {/* ── Card ── */}
        <div
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid rgb(220, 223, 230)',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* Card Header */}
          <div
            className="px-6 py-5"
            style={{
              borderBottom: '1px solid rgb(240, 242, 245)',
              backgroundColor: 'rgb(248, 249, 251)',
              borderRadius: '6px 6px 0 0',
            }}
          >
            <h2 className="text-lg font-extrabold" style={{ color: 'rgb(15, 20, 35)' }}>
              Create Account
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
              Fill in the details below to get started
            </p>
          </div>

          {/* Card Body */}
          <div className="px-6 py-6 space-y-5">

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2.5 px-4 py-3"
                style={{
                  borderRadius: '4px',
                  backgroundColor: 'rgb(254, 242, 242)',
                  border: '1px solid rgb(254, 202, 202)',
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'rgb(185, 28, 28)' }} />
                <p className="text-sm font-medium" style={{ color: 'rgb(185, 28, 28)' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── Row 1: Full Name + Phone ── */}
              <div className="grid grid-cols-2 gap-4">

                {/* Full Name */}
                <div>
                  <label htmlFor="name" className={labelStyle} style={{ color: 'rgb(75, 85, 99)' }}>
                    Full Name <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={50}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    disabled={disabled}
                    style={{ ...inputStyle, opacity: disabled ? 0.6 : 1 }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={labelStyle} style={{ color: 'rgb(75, 85, 99)' }}>
                    Phone{' '}
                    <span className="normal-case font-normal" style={{ color: 'rgb(150, 158, 175)' }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    disabled={disabled}
                    style={{ ...inputStyle, opacity: disabled ? 0.6 : 1 }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                  />
                </div>
              </div>

              {/* ── Row 2: Email (full width) ── */}
              <div>
                <label htmlFor="email" className={labelStyle} style={{ color: 'rgb(75, 85, 99)' }}>
                  Email <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={disabled}
                  style={{ ...inputStyle, opacity: disabled ? 0.6 : 1 }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                />
              </div>

              {/* ── Row 3: Password + Confirm Password ── */}
              <div className="grid grid-cols-2 gap-4">

                {/* Password */}
                <div>
                  <label htmlFor="password" className={labelStyle} style={{ color: 'rgb(75, 85, 99)' }}>
                    Password <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      disabled={disabled}
                      style={{ ...inputStyle, paddingRight: '40px', opacity: disabled ? 0.6 : 1 }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgb(150, 158, 175)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgb(75, 85, 99)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className={labelStyle} style={{ color: 'rgb(75, 85, 99)' }}>
                    Confirm <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      disabled={disabled}
                      style={{ ...inputStyle, paddingRight: '40px', opacity: disabled ? 0.6 : 1 }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgb(150, 158, 175)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgb(75, 85, 99)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password match indicator */}
                  {formData.confirmPassword.length > 0 && (
                    <p
                      className="text-xs mt-1 font-semibold"
                      style={{
                        color: formData.password === formData.confirmPassword
                          ? 'rgb(21, 91, 48)'
                          : 'rgb(185, 28, 28)',
                      }}
                    >
                      {formData.password === formData.confirmPassword
                        ? '✓ Passwords match'
                        : '✗ Does not match'}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={disabled}
                className="w-full flex items-center justify-center text-sm font-bold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderRadius: '4px',
                  backgroundColor: 'rgb(185, 28, 28)',
                  color: 'rgb(255, 255, 255)',
                }}
                onMouseEnter={e => { if (!disabled) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                onMouseLeave={e => { if (!disabled) e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border-2 animate-spin inline-block"
                      style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'white' }}
                    />
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1" style={{ height: '1px', backgroundColor: 'rgb(220, 223, 230)' }} />
              <span className="text-xs font-semibold shrink-0" style={{ color: 'rgb(150, 158, 175)' }}>
                or sign up with
              </span>
              <div className="flex-1" style={{ height: '1px', backgroundColor: 'rgb(220, 223, 230)' }} />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={() => signUpWithGoogle()}
              disabled={disabled}
              className="w-full flex items-center justify-center gap-3 text-sm font-bold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderRadius: '4px',
                border: '1px solid rgb(220, 223, 230)',
                backgroundColor: 'rgb(255, 255, 255)',
                color: 'rgb(55, 65, 81)',
              }}
              onMouseEnter={e => { if (!disabled) e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)' }}
              onMouseLeave={e => { if (!disabled) e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {isGoogleLoading ? "Signing up..." : "Continue with Google"}
            </button>

          </div>

          {/* Card Footer */}
          <div
            className="px-6 py-4 text-center"
            style={{
              borderTop: '1px solid rgb(240, 242, 245)',
              backgroundColor: 'rgb(248, 249, 251)',
              borderRadius: '0 0 6px 6px',
            }}
          >
            <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>
              Already have an account?{' '}
              <Link href="/login">
                <span
                  className="font-bold transition-colors"
                  style={{ color: 'rgb(185, 28, 28)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(153, 27, 27)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                >
                  Sign in
                </span>
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
