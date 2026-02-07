"use client"

import { UtensilsCrossed, IceCream, Leaf } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: UtensilsCrossed,
      title: "Crunchy Shell",
      description: "Baked to absolute golden perfection for that satisfying snap in every bite.",
    },
    {
      icon: IceCream,
      title: "Velvety Filling",
      description: "Filled with ultra-rich cream that melts instantly as you reach the center.",
    },
    {
      icon: Leaf,
      title: "Pure Ingredients",
      description: "No artificial colors or preservatives. Just pure, guilt-free snacking joy.",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-background-dark">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col gap-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-chocolate-rich dark:text-white">
            Why You&apos;ll Love the Crunch
          </h2>
          <p className="text-slate-500 max-w-[600px] mx-auto">
            Pure indulgence in every single bite, crafted with quality ingredients.
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
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
