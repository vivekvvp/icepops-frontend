"use client"

import Link from "next/link"
import { Instagram, Twitter, Facebook, Youtube, ArrowRight } from "lucide-react"

const socialIcons = [Instagram, Twitter, Facebook, Youtube]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#e11d48' }}
              >
                <svg fill="none" viewBox="0 0 48 48" className="w-5 h-5">
                  <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="white" fillRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-black">IcePops</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              Craft-frozen treats made with real fruits. No preservatives, no artificial colours — just pure summer joy.
            </p>
            <div className="flex gap-2.5">
              {socialIcons.map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200"
                  style={{ backgroundColor: '#1e293b' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e11d48')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1e293b')}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Shop</h4>
            <ul className="space-y-3">
              {["All Flavors", "Combo Packs", "Best Sellers", "New Arrivals"].map((l) => (
                <li key={l}>
                  <Link
                    href="/products"
                    className="text-sm transition-colors"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Company</h4>
            <ul className="space-y-3">
              {["About Us", "Blog", "Careers", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Newsletter</h4>
            <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              Get early access to new flavors, promos and exclusive drops.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 text-sm rounded-xl px-4 py-2.5 outline-none transition-colors"
                style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#ffffff',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#e11d48')}
                onBlur={e => (e.currentTarget.style.borderColor = '#334155')}
              />
              <button
                className="rounded-xl px-4 flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#e11d48' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#be123c')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e11d48')}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid #1e293b' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: '#475569' }}>© {year} IcePops. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-5">
            {["Privacy Policy", "Terms of Service", "Shipping Policy", "Refund Policy"].map((p) => (
              <a
                key={p}
                href="#"
                className="text-xs transition-colors"
                style={{ color: '#475569' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
              >
                {p}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
