"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, ArrowLeft, Mail } from "lucide-react"
import { useForgotPasswordMutation } from "@/lib/services/api"

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

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await forgotPassword(email).unwrap()
      setSent(true)
    } catch (err: any) {
      setError(err.data?.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: 'rgb(246, 247, 249)' }}
    >
      <div className="w-full space-y-6" style={{ maxWidth: '460px' }}>

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
            Reset your password securely
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
              Forgot Password
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {/* Card Body */}
          <div className="px-6 py-6 space-y-5">

            {/* Success state */}
            {sent ? (
              <div className="space-y-5">
                <div
                  className="flex flex-col items-center gap-4 py-4 text-center"
                >
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-full"
                    style={{ backgroundColor: 'rgb(240, 253, 244)', border: '2px solid rgb(187, 247, 208)' }}
                  >
                    <CheckCircle2 className="w-7 h-7" style={{ color: 'rgb(21, 128, 61)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Check your inbox</p>
                    <p className="text-xs mt-1" style={{ color: 'rgb(110, 118, 135)', lineHeight: '1.6' }}>
                      If <strong>{email}</strong> is registered, you'll receive a password reset link shortly. Check your spam folder if you don't see it.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSent(false); setEmail("") }}
                  className="w-full text-sm font-bold py-2.5 transition-colors"
                  style={{
                    borderRadius: '4px',
                    border: '1px solid rgb(220, 223, 230)',
                    backgroundColor: 'rgb(248, 249, 251)',
                    color: 'rgb(55, 65, 81)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(240, 242, 245)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)')}
                >
                  Send to a different email
                </button>
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
                    <p className="text-sm font-medium" style={{ color: 'rgb(185, 28, 28)' }}>{error}</p>
                  </div>
                )}

                {/* Info box */}
                <div
                  className="flex items-start gap-2.5 px-4 py-3"
                  style={{
                    borderRadius: '4px',
                    backgroundColor: 'rgb(239, 246, 255)',
                    border: '1px solid rgb(191, 219, 254)',
                  }}
                >
                  <Mail className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'rgb(59, 130, 246)' }} />
                  <p className="text-xs" style={{ color: 'rgb(30, 64, 175)', lineHeight: '1.6' }}>
                    A secure link valid for <strong>1 hour</strong> will be sent to your email address.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold mb-1.5 uppercase tracking-wider"
                      style={{ color: 'rgb(75, 85, 99)' }}
                    >
                      Email Address <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError("") }}
                      placeholder="you@example.com"
                      disabled={isLoading}
                      style={{ ...inputStyle, opacity: isLoading ? 0.6 : 1 }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                    />
                  </div>

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
                        Sending reset link...
                      </span>
                    ) : 'Send Reset Link'}
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
            <Link href="/login">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
                style={{ color: 'rgb(110, 118, 135)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgb(15, 20, 35)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgb(110, 118, 135)')}
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Sign In
              </span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
