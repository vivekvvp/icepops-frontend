"use client"

import { Star, Quote } from "lucide-react"

const reviews = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Absolutely love these! The mango flavour tastes like actual fresh mango. My kids won't stop asking for more — and I'm not complaining at all.",
    avatar: "PS",
    color: { bg: "#fff1f2", text: "#be123c" },
  },
  {
    name: "Rahul Verma",
    location: "Delhi",
    rating: 5,
    text: "Finally a brand that uses real fruit. You can literally taste the difference. The cola pop brings back all my childhood summer memories!",
    avatar: "RV",
    color: { bg: "#fff7ed", text: "#c2410c" },
  },
  {
    name: "Anjali Patel",
    location: "Bangalore",
    rating: 5,
    text: "Ordered the combo pack and it was gone in two days. The packaging is super clean and everything arrived perfectly frozen. 10/10.",
    avatar: "AP",
    color: { bg: "#fffbeb", text: "#b45309" },
  },
  {
    name: "Karan Mehta",
    location: "Pune",
    rating: 5,
    text: "I was skeptical at first but these are genuinely premium. The strawberry ice pop is now a weekly staple in our house.",
    avatar: "KM",
    color: { bg: "#fff1f2", text: "#be123c" },
  },
  {
    name: "Sneha Iyer",
    location: "Chennai",
    rating: 5,
    text: "Love that there are no preservatives. As a nutritionist I'd happily recommend IcePops to anyone looking for a clean, guilt-free treat.",
    avatar: "SI",
    color: { bg: "#fff7ed", text: "#c2410c" },
  },
  {
    name: "Arjun Singh",
    location: "Hyderabad",
    rating: 4,
    text: "Great quality and super fast delivery. The orange pop is my go-to after a workout. Refreshing and not overly sweet — perfect.",
    avatar: "AS",
    color: { bg: "#fffbeb", text: "#b45309" },
  },
]

export default function Reviews() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#e11d48' }}>Testimonials</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Loved by Thousands
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-slate-600 font-bold ml-2 text-sm">4.9 out of 5</span>
            <span className="text-slate-400 text-sm ml-1">· 10,000+ reviews</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="relative flex flex-col p-7 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <Quote className="w-7 h-7 absolute top-5 right-5" style={{ color: '#fce7f3' }} />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-3.5 h-3.5"
                    style={j < r.rating
                      ? { fill: '#fbbf24', color: '#fbbf24' }
                      : { color: '#e2e8f0' }
                    }
                  />
                ))}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed flex-1">{r.text}</p>

              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-50">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{ backgroundColor: r.color.bg, color: r.color.text }}
                >
                  {r.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
