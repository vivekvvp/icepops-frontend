"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function FinalCTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Softer Red Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-rose-500 to-red-400" />

      {/* Soft Red Glow Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rose-300/40 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-red-300/30 blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-white/30 bg-white/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          Limited Summer Stock
        </span>

        {/* Heading */}
        <h2 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Your Summer Just<br />Got a Whole Lot Sweeter.
        </h2>

        {/* Subtext */}
        <p className="text-lg text-white/90 max-w-[520px] mx-auto mb-10 leading-relaxed">
          Join 10,000+ happy customers who've made IcePops their go-to summer ritual.
          Free delivery on your first order.
        </p>

        {/* CTA Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-3 bg-white text-rose-600 text-base font-bold px-10 py-4 rounded-xl shadow-xl hover:bg-rose-50 hover:-translate-y-0.5 transition-all duration-200"
        >
          Order Your Pops Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}