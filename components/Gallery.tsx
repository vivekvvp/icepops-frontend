"use client"

import Image from "next/image"
import { Instagram } from "lucide-react"

const photos = [
  { src: "/img1.webp", label: "Ice Pops Box (Assorted Flavours)", bg: "#fffbeb" },
  { src: "/img2.webp", label: "Cream Roll (3 Flavours)", bg: "#fefce8" },
  { src: "/img3.webp", label: "Corn Sticks (4 Flavours)", bg: "#eef2ff" },
  { src: "/img4.webp", label: "Orange Ice Pops Box", bg: "#fff7ed" },
  { src: "/img5.webp", label: "Raspberry Ice Pops Box", bg: "#ffe4e1" },
  { src: "/img6.webp", label: "Ice Pops Saver Pack (6 Flavours)", bg: "#e0f7fa" },
  { src: "/img7.webp", label: "Lemon & Mango Twist Ice Pops Box", bg: "#fce4ec" },
  { src: "/img8.webp", label: "Raspberry & Mango Twist Ice Pops Box", bg: "#fff3e0" },
]

export default function Gallery() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#e11d48' }}>Summer Gallery</p>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">#IcePopsVibes</h2>
            <p className="text-slate-400 text-sm mt-1">Tag us on Instagram to get featured</p>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:-translate-y-0.5 transition-transform duration-200"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #f97316)' }}
          >
            <Instagram className="w-4 h-4" />
            Follow Us
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              style={{ backgroundColor: p.bg }}
            >
              <Image
                src={p.src}
                alt={p.label}
                fill
                className="object-contain"
              />
              <span className="absolute bottom-2 left-2 right-2 text-xs font-bold text-slate-600 bg-white/80 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {p.label}
              </span>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
