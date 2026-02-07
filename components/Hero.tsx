"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Droplet, Waves, CheckCircle } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden cream-gradient swirl-bg py-12 lg:py-24">
      {/* Illustrative Elements (Floating) */}
      <div className="absolute top-10 left-10 opacity-20 hidden lg:block">
        <Droplet className="w-32 h-32 text-primary rotate-12" />
      </div>
      <div className="absolute bottom-20 right-1/2 opacity-10 hidden lg:block">
        <Waves className="w-40 h-40 text-chocolate-rich -rotate-12" />
      </div>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Left */}
          <div className="flex flex-col gap-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center self-center lg:self-start bg-primary text-white px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase animate-bounce">
              New Launch
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-[#181111] dark:text-background-dark text-5xl md:text-7xl font-black leading-[1.1] tracking-[-0.04em]">
                NEW! <br />
                <span className="text-primary italic">CREAMY</span> DELIGHTS
              </h1>
              <p className="text-chocolate-rich/80 dark:text-background-dark/70 text-lg md:text-xl font-medium max-w-[500px] mx-auto lg:mx-0">
                Experience the perfect crunch with a velvety center. IcePops&apos; all-new Cream Rolls are
                here to redefine snacking.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-primary text-white text-lg font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all hover:translate-y-[-2px]">
                Try Now
              </Button>
              <Button
                variant="outline"
                className="flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 border-2 border-chocolate-rich/20 bg-transparent text-chocolate-rich text-lg font-bold hover:bg-white/50 transition-all"
              >
                View Flavors
              </Button>
            </div>
            <div className="flex items-center gap-6 justify-center lg:justify-start pt-4">
              <div className="flex -space-x-3">
                <div
                  className="size-10 rounded-full border-2 border-white bg-slate-200 bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAvP01XOmSjJ9kvEbYDYSRflrhxSBf5VzIDV_loWY_phA4sbWCyClAelHYwz-9aF-6t_J8BZFtJI36x6yzAwcDd_RjX8h7T8jm3GzAWQJv9X1CCv8U0mZ9GYmoRwNQYJBsp48KcT0CmTM4BD7A4h5I2rVtoLht90DxTsLxQY7XmaKA8I2Uh2YdGbmaqN-A0LtmnSmO9qG-FGeyWWfeiz32-YVDWC8brwk6_t5qEi7aPDD5n8KMGCae0NfaM08jDfXGlSpU0aviNs3I')",
                  }}
                ></div>
                <div
                  className="size-10 rounded-full border-2 border-white bg-slate-300 bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBLs9z2WP_mca2SQw8s5yKwe2_EQ-hsa5jZJyz2Y_VKYKKxB03IwW4TFJNwFkW30czFni0ybiOh0J6pMY9d-VE-Ank2npY_nFtd9xGoOeJLg4Ms5YfHtzeH4Ph5-mF-lV2Q5ILm5qSmMJRr2ZSiV9rgCrIpMaa8c7M9H--qdVntT4i2TH6LpsbGsg-SALf6F5gQsvTrBhyS2uJGdceKcUhy2bfEQU4nKk_0MSmdimag28ErS4Xpjaq-u1cQwqjTQTdrkcaGu1shPUM')",
                  }}
                ></div>
                <div
                  className="size-10 rounded-full border-2 border-white bg-slate-400 bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQcggDj48SkaHelyZ8sBYHemYl10ksWZaNPrditiqhUa5QdmVAn7wxBS3AUdBHJd-VLqim1T7Y6DCRGADXzqRuUl_TOTwMZ3nebOB1KsS3Bbam3XU3zymNcjB9xiWaL45j0quDYkF3U7xjai6Twi7jRIqblEn9Cw-QHcF-mF1dWsYAEadUa3ji-3ztPeJnKAdYYZD4_oGTDYEgnTFL3joR41rFf2AEAzgOrBj7hBDQGpKRnMDOoFJqqZg_gTUjP4uqsGtwBvp1gg0')",
                  }}
                ></div>
              </div>
              <p className="text-sm font-bold text-chocolate-rich">Loved by 10,000+ Snackers</p>
            </div>
          </div>
          {/* Image Right */}
          <div className="relative group">
            {/* Background Swirl Effect */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-75 group-hover:scale-90 transition-transform duration-700"></div>
            <div
              className="relative bg-center bg-no-repeat aspect-square bg-cover rounded-xl shadow-2xl transition-transform duration-500 hover:scale-105"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkD5F7qulP60GSyMQfvdJWrRftZr3TCI-1w9v5g3c3cprxJJn-8VWg_-V_pa1Xs2bV53uM64ydQCno_zWyFzF7oaycI8OkM6KBsDOPSKcOPx7VuGhnyYonA2HoNkUyGuKgdg7is1wh58rgxvyi0HjwxC8TQxDEg15-J6VP4V2EMWlFUgEAHPwRLnPc2mtKSTs6e29W1a1pyIWCbCwsi3qOlrDG-6xM7xV4l7hq82K9gAyH3Y379IWvbXa7W16qTml8d1G2neRnk3o")',
              }}
            >
              {/* Floating Badges */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-background-dark p-4 rounded-xl shadow-xl flex flex-col items-center border border-primary/10">
                <span className="text-primary text-2xl font-black">₹20</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Starting Price</span>
              </div>
              <div className="absolute bottom-10 -left-6 bg-white dark:bg-background-dark px-4 py-3 rounded-full shadow-lg flex items-center gap-2 border border-primary/10">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle className="text-green-600 w-4 h-4" />
                </div>
                <span className="text-sm font-bold">100% Eggless</span>
              </div>
            </div>
            {/* Decorative Milk Splash Illustration Mockup */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-40 pointer-events-none">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.7,-31.3,87.1,-15.7,85.2,-0.7C83.3,14.3,76.1,28.7,67,42.4C57.9,56.1,47,69.1,33.5,75.9C20,82.8,4,83.4,-11.5,79.9C-27.1,76.4,-42.2,68.7,-54.3,57.7C-66.4,46.7,-75.6,32.3,-79.8,16.8C-84,1.3,-83.2,-15.3,-76.8,-29.9C-70.4,-44.5,-58.4,-57.1,-44.6,-64.5C-30.8,-71.9,-15.4,-74.1,0.2,-74.5C15.8,-74.9,31.3,-83.5,44.7,-76.4Z"
                  fill="#FFF"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
