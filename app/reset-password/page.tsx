"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react"
import { useResetPasswordMutation } from "@/lib/services/api"
import { toast } from "sonner"

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

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password")
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters."); return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match."); return
    }

    try {
      await resetPassword({ token, newPassword }).unwrap()
      setSuccess(true)
      toast.success("Password reset successfully!")
      setTimeout(() => router.push("/login"), 3000)
    } catch (err: any) {
      const msg = err.data?.message || "Failed to reset password. The link may have expired."
      setError(msg)
      toast.error(msg)
    }
  }

  if (!token) return null

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: 'rgb(246, 247, 249)' }}
    >
      <div className="w-full space-y-6" style={{ maxWidth: '480px' }}>

        {/* Logo */}
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
            Choose a new password for your account
          </p>
        </div>

        {/* Card */}
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
              Reset Password
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
              Enter and confirm your new password below
            </p>
          </div>

          {/* Card Body */}
          <div className="px-6 py-6 space-y-5">

            {/* Success state */}
            {success ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div
                  className="flex items-center justify-center w-14 h-14 rounded-full"
                  style={{ backgroundColor: 'rgb(240, 253, 244)', border: '2px solid rgb(187, 247, 208)' }}
                >
                  <CheckCircle2 className="w-7 h-7" style={{ color: 'rgb(21, 128, 61)' }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                    Password reset successfully!
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'rgb(110, 118, 135)', lineHeight: '1.6' }}>
                    You'll be redirected to the sign-in page in a moment...
                  </p>
                </div>
                <Link href="/login">
                  <button
                    type="button"
                    className="text-sm font-bold py-2 px-6 transition-colors"
                    style={{
                      borderRadius: '4px',
                      backgroundColor: 'rgb(185, 28, 28)',
                      color: 'rgb(255, 255, 255)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                  >
                    Go to Sign In
                  </button>
                </Link>
              </div>
            ) : (
              <>
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
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'rgb(185, 28, 28)' }}>{error}</p>
                      {error.toLowerCase().includes('expired') && (
                        <Link href="/forgot-password">
                          <span
                            className="text-xs font-bold underline mt-0.5 inline-block"
                            style={{ color: 'rgb(185, 28, 28)' }}
                          >
                            Request a new reset link →
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Security note */}
                <div
                  className="flex items-start gap-2.5 px-4 py-3"
                  style={{
                    borderRadius: '4px',
                    backgroundColor: 'rgb(255, 251, 235)',
                    border: '1px solid rgb(253, 230, 138)',
                  }}
                >
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'rgb(180, 83, 9)' }} />
                  <p className="text-xs" style={{ color: 'rgb(120, 53, 15)', lineHeight: '1.6' }}>
                    For your security, you'll be signed out of all devices after resetting your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className={labelStyle} style={{ color: 'rgb(75, 85, 99)' }}>
                      New Password <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={e => { setNewPassword(e.target.value); setError("") }}
                        placeholder="Min. 8 characters"
                        disabled={isLoading}
                        style={{ ...inputStyle, paddingRight: '40px', opacity: isLoading ? 0.6 : 1 }}
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

                    {/* Password strength indicator */}
                    {newPassword.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {[
                          { label: 'At least 8 characters', ok: newPassword.length >= 8 },
                          { label: 'Contains a number', ok: /\d/.test(newPassword) },
                          { label: 'Contains a letter', ok: /[a-zA-Z]/.test(newPassword) },
                        ].map(({ label, ok }) => (
                          <p
                            key={label}
                            className="text-xs font-medium flex items-center gap-1"
                            style={{ color: ok ? 'rgb(21, 91, 48)' : 'rgb(150, 158, 175)' }}
                          >
                            <span>{ok ? '✓' : '○'}</span> {label}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className={labelStyle} style={{ color: 'rgb(75, 85, 99)' }}>
                      Confirm Password <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setError("") }}
                        placeholder="Repeat new password"
                        disabled={isLoading}
                        style={{ ...inputStyle, paddingRight: '40px', opacity: isLoading ? 0.6 : 1 }}
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
                    {confirmPassword.length > 0 && (
                      <p
                        className="text-xs mt-1 font-semibold"
                        style={{ color: newPassword === confirmPassword ? 'rgb(21, 91, 48)' : 'rgb(185, 28, 28)' }}
                      >
                        {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Does not match'}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center text-sm font-bold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderRadius: '4px',
                      backgroundColor: 'rgb(185, 28, 28)',
                      color: 'rgb(255, 255, 255)',
                    }}
                    onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                    onMouseLeave={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)' }}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border-2 animate-spin inline-block"
                          style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'white' }}
                        />
                        Resetting password...
                      </span>
                    ) : 'Reset Password'}
                  </button>
                </form>
              </>
            )}
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
              Remember your password?{' '}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
