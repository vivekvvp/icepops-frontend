"use client"

import { Leaf, ShieldCheck, Flame, Package } from "lucide-react"

const features = [
  {
    Icon: Leaf,
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
    title: "100% Natural Ingredients",
    desc: "Every pop is crafted from real, whole fruits with zero synthetic additives or artificial flavouring agents.",
  },
  {
    Icon: ShieldCheck,
    iconBg: "#fff1f2",
    iconColor: "#e11d48",
    title: "No Preservatives",
    desc: "We never compromise. Our pops contain no chemical preservatives — fresh, clean and honest, always.",
  },
  {
    Icon: Flame,
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
    title: "Made Fresh Daily",
    desc: "Batches are frozen fresh every morning so you always get the freshest possible treat delivered to you.",
  },
  {
    Icon: Package,
    iconBg: "#fffbeb",
    iconColor: "#d97706",
    title: "Hygienic Packaging",
    desc: "Sealed in food-grade, tamper-proof packaging to ensure your pop reaches you in perfect condition, every time.",
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#e11d48' }}>Why IcePops</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Why Choose Us</h2>
          <p className="text-slate-500 mt-4 max-w-[480px] mx-auto text-base leading-relaxed">
            We obsess over every detail so you can just sit back and enjoy the good stuff.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group flex flex-col items-start p-7 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: f.iconBg }}
              >
                <f.Icon className="w-5 h-5" style={{ color: f.iconColor }} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
