"use client"

import Link from "next/link"
import { Star, ArrowRight, Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fff1f2 50%, #fffbeb 100%)' }}
      />

      {/* Blob 1 — top right */}
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
        style={{ backgroundColor: 'rgba(253,186,116,0.35)', filter: 'blur(80px)' }}
      />
      {/* Blob 2 — bottom left */}
      <div
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{ backgroundColor: 'rgba(253,164,175,0.35)', filter: 'blur(80px)' }}
      />
      {/* Blob 3 — mid */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{ backgroundColor: 'rgba(252,211,77,0.2)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT CONTENT ── */}
          <div className="flex flex-col gap-8 animate-icepop-fadein">

            {/* Badge */}
            <div>
              <span
                className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  border: '1px solid #fed7aa',
                  color: '#c2410c',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Summer Special &nbsp;·&nbsp; 100% Natural
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-5">
              <h1 className="text-[52px] lg:text-[68px] font-black text-slate-900 leading-[1.04] tracking-tight">
                Sun-Kissed<br />
                <span style={{ color: '#e11d48' }}>Ice Pops</span><br />
                That Hit Different
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-[460px]">
                Craft-frozen treats made with real fruits. No artificial colours, no preservatives —
                just pure summer joy in every lick.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <button
                  className="flex items-center gap-2 text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: '#e11d48',
                    boxShadow: '0 8px 24px rgba(225,29,72,0.25)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#be123c')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e11d48')}
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="#flavors">
                <button
                  className="flex items-center gap-2 text-slate-700 text-sm font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fff7ed')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)')}
                >
                  Explore Flavors
                </button>
              </a>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">4.9/5</span>
              <span className="text-sm text-slate-400">from 10,000+ happy customers</span>
            </div>

          </div>

          {/* ── RIGHT IMAGE ── */}
          <div className="relative flex items-center justify-center py-10">

            {/* Glow behind image */}
            <div
              className="absolute w-72 h-72 rounded-full"
              style={{ backgroundColor: 'rgba(251,146,60,0.25)', filter: 'blur(48px)' }}
            />

            {/* Product image with float animation */}
            <div className="relative z-10 animate-icepop-float">
              <img
                src="/icepop-hero.jpg"
                alt="Premium IcePops"
                className="w-full max-w-[400px] h-[400px] object-cover rounded-3xl"
                style={{ boxShadow: '0 30px 80px rgba(225,29,72,0.12), 0 10px 30px rgba(0,0,0,0.08)' }}
              />
            </div>

            {/* Floating card — top left */}
            <div
              className="absolute top-4 -left-2 lg:-left-6 z-20 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
              style={{
                backgroundColor: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid #fef3c7',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <span className="text-2xl">🥭</span>
              <div>
                <p className="text-xs font-bold text-slate-900">Mango Delight</p>
                <p className="text-[11px] font-semibold" style={{ color: '#e11d48' }}>Best Seller</p>
              </div>
            </div>

            {/* Floating card — bottom right */}
            <div
              className="absolute bottom-8 -right-2 lg:-right-4 z-20 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid #fce7f3',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <p className="text-xs font-bold text-slate-900">Starting at ₹10</p>
              <p className="text-[11px] font-semibold" style={{ color: '#16a34a' }}>✓ 100% Natural</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
