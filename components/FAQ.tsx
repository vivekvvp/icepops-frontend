"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "What ingredients do you use in your ice pops?",
    a: "We use real fruit pulp or juice as the primary ingredient, combined with filtered RO water and natural sweeteners. We never use artificial colours, artificial flavours, or chemical preservatives.",
  },
  {
    q: "How long do the ice pops stay frozen during delivery?",
    a: "Our ice pops are shipped in high-quality insulated packaging with dry ice or gel packs, designed to maintain freezing temperatures for 24–48 hours — ensuring they arrive perfectly frozen.",
  },
  {
    q: "Are your products safe for kids?",
    a: "Absolutely. All our products are made with child-safe, clean-label ingredients with no harmful allergens in our standard range. We recommend checking individual product descriptions if your child has specific allergies.",
  },
  {
    q: "Do you offer bulk or combo packs for events?",
    a: "Yes! We offer curated combo packs and bulk ordering options perfect for birthday parties, office events, and gifting. Contact us for custom quotes on orders above 50 packs.",
  },
  {
    q: "Can I customize a flavour combo pack?",
    a: "We currently offer pre-set combo packs. However, we're actively working on a build-your-own feature. Sign up to our newsletter to be the first to know when it launches.",
  },
  {
    q: "What is your refund policy on perishable items?",
    a: "Given the perishable nature of our products, we don't accept returns. However, if your order arrives damaged or in poor condition, please contact us within 24 hours with photos and we'll make it right.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fff1f2 100%)' }}>
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#e11d48' }}>Got Questions?</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className="text-sm font-bold text-slate-900">{item.q}</span>
                <ChevronDown
                  className="w-5 h-5 shrink-0 transition-transform duration-300"
                  style={{
                    color: '#94a3b8',
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? '200px' : '0px' }}
              >
                <div className="px-6 pb-5">
                  <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
