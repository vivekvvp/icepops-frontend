"use client"

import { UtensilsCrossed, IceCream, Leaf } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: UtensilsCrossed,
      title: "Childhood Ice Pop Fun",
      description:
        "Colorful and refreshing ice pops that bring back nostalgic summer memories with every single bite.",
    },
    {
      icon: IceCream,
      title: "Real Fruity Refreshment",
      description:
        "Bursting with delicious fruit-inspired flavours that keep you cool, refreshed, and craving more.",
    },
    {
      icon: Leaf,
      title: "Natural & Hygienic Goodness",
      description:
        "Prepared using clean ingredients and hygienic processes with no artificial colours or preservatives.",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-background-dark">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col gap-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-chocolate-rich dark:text-white">
            Why Everyone Loves Our Ice Pops
          </h2>
          <p className="text-slate-500 max-w-[600px] mx-auto">
            A perfect mix of nostalgia, natural flavours, and refreshing fun crafted for every age.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-8 rounded-xl bg-cream-soft dark:bg-[#2d1a1a] border border-primary/5 hover:border-primary/20 transition-all hover:shadow-2xl hover:translate-y-[-8px]"
            >
              <div className="size-20 bg-white dark:bg-[#3d2b1f] rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <feature.icon className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-xl font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
