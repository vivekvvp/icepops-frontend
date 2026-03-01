"use client"

import { Check } from "lucide-react"

const points = [
  "Sourced from certified farms",
  "No artificial colours or flavours",
  "0g trans fat, no high-fructose syrup",
  "Made with filtered RO water",
  "Tested and certified safe",
  "Vegan & allergen-friendly options",
]

export default function Ingredients() {
  return (
    <section className="py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 40%, #fff1f2 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT — Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(253,186,116,0.35)' }} />
            <div className="absolute -bottom-8 right-4 w-48 h-48 rounded-full blur-2xl" style={{ backgroundColor: 'rgba(253,164,175,0.35)' }} />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]" style={{ boxShadow: '0 25px 60px rgba(251,146,60,0.15)' }}>
              <img
                src="/icepop-hero.jpg"
                alt="Real fruit ingredients"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge — top right */}
            <div className="absolute -top-4 -right-3 bg-white rounded-2xl px-4 py-3 shadow-xl border border-amber-50">
              <p className="text-2xl text-center">🍓 🥭 🍊</p>
              <p className="text-[11px] font-bold text-slate-700 text-center mt-1">Real Fruits Only</p>
            </div>
            {/* Floating badge — bottom left */}
            <div className="absolute -bottom-4 left-8 bg-white rounded-2xl px-4 py-3 shadow-xl border border-green-50 flex items-center gap-2.5">
              <span className="text-xl">🌿</span>
              <div>
                <p className="text-xs font-bold text-slate-900">Farm Certified</p>
                <p className="text-[10px] font-semibold" style={{ color: '#16a34a' }}>100% Organic Sources</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Text */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#e11d48' }}>Clean Label</p>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Only Real Fruits.<br />
                <span style={{ color: '#e11d48' }}>Nothing Artificial.</span>
              </h2>
              <p className="text-slate-500 mt-5 text-base leading-relaxed">
                We believe what goes into your body matters. That's why every single IcePop starts with whole fruits and ends with a clear conscience.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {points.map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#dcfce7' }}>
                    <Check className="w-3 h-3 stroke-[3]" style={{ color: '#16a34a' }} />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{p}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
