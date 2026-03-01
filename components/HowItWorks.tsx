"use client"

import { ShoppingBag, Snowflake, Truck } from "lucide-react"

const steps = [
  {
    Icon: ShoppingBag,
    number: "01",
    title: "Choose Your Flavor",
    desc: "Browse our curated range — from tropical mango to classic cola. Pick singles, bundles or combo packs.",
    iconBg: "#fff1f2",
    iconColor: "#e11d48",
  },
  {
    Icon: Snowflake,
    number: "02",
    title: "We Freeze & Pack",
    desc: "Your order is freshly prepared at our facility using real fruit, then blast-frozen to seal in every ounce of flavour.",
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
  },
  {
    Icon: Truck,
    number: "03",
    title: "Delivered Fresh",
    desc: "Shipped in insulated packaging that maintains perfect freeze temperature until it reaches your door.",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #fff7ed 50%, #fffbeb 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#e11d48' }}>Simple Process</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">How It Works</h2>
          <p className="text-slate-500 mt-4 max-w-[460px] mx-auto text-base leading-relaxed">
            From our kitchen to your doorstep in three ridiculously simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line desktop */}
          <div
            className="hidden md:block absolute top-[3.25rem] h-px"
            style={{
              left: 'calc(16.66% + 3rem)',
              right: 'calc(16.66% + 3rem)',
              background: 'linear-gradient(90deg, #fda4af, #fdba74, #fcd34d)',
            }}
          />

          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="relative z-10 mb-6">
                <div
                  className="w-[6.5rem] h-[6.5rem] rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: s.iconBg }}
                >
                  <s.Icon className="w-8 h-8" style={{ color: s.iconColor }} />
                </div>
                <span
                  className="absolute -top-2 -right-2 text-[10px] font-black text-white w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  {i + 1}
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-3">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
