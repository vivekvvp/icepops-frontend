"use client"

import { Button } from "@/components/ui/button"
import { Droplet, Waves, CheckCircle } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden cream-gradient swirl-bg py-12 lg:py-24">
      
      {/* Floating Illustrations */}
      <div className="absolute top-10 left-10 opacity-20 hidden lg:block">
        <Droplet className="w-32 h-32 text-primary rotate-12" />
      </div>

      <div className="absolute bottom-20 right-1/2 opacity-10 hidden lg:block">
        <Waves className="w-40 h-40 text-chocolate-rich -rotate-12" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="flex flex-col gap-8 z-10 text-center lg:text-left">

            <div className="inline-flex items-center self-center lg:self-start bg-primary text-white px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase animate-bounce">
              Freshly Frozen
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-[#181111] dark:text-background-dark text-5xl md:text-7xl font-black leading-[1.1] tracking-[-0.04em]">
                COOL <br />
                <span className="text-primary italic">FRUITY</span> <br />
                FUN
              </h1>

              <p className="text-chocolate-rich/80 dark:text-background-dark/70 text-lg md:text-xl font-medium max-w-[500px] mx-auto lg:mx-0">
                Refresh your day with colorful, nostalgic ice pops made with real fruity flavors and
                clean ingredients. A chilled treat loved by every generation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button className="flex min-w-[200px] items-center justify-center rounded-full h-14 px-8 bg-primary text-white text-lg font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all hover:translate-y-[-2px]">
                Order Ice Pops
              </Button>

              <Button
                variant="outline"
                className="flex min-w-[180px] items-center justify-center rounded-full h-14 px-8 border-2 border-chocolate-rich/20 bg-transparent text-chocolate-rich text-lg font-bold hover:bg-white/50 transition-all"
              >
                Explore Flavours
              </Button>
            </div>

            <p className="text-sm font-bold text-chocolate-rich">
              Loved by 20,000+ Ice Pop Fans
            </p>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-75 group-hover:scale-90 transition-transform duration-700"></div>

            <div
              className="relative bg-center bg-no-repeat aspect-square bg-cover rounded-xl shadow-2xl transition-transform duration-500 hover:scale-105"
              style={{
                backgroundImage: 'url("/icepop-hero.jpg")',
              }}
            >
              <div className="absolute -top-4 -right-4 bg-white dark:bg-background-dark p-4 rounded-xl shadow-xl flex flex-col items-center border border-primary/10">
                <span className="text-primary text-2xl font-black">₹10</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Starting Price
                </span>
              </div>

              <div className="absolute bottom-10 -left-6 bg-white dark:bg-background-dark px-4 py-3 rounded-full shadow-lg flex items-center gap-2 border border-primary/10">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle className="text-green-600 w-4 h-4" />
                </div>
                <span className="text-sm font-bold">Made with RO Water</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
