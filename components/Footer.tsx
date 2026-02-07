"use client"

import { Globe, Share2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-chocolate-rich text-white py-12 px-6">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="size-6 text-white">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-xl font-black">IcePops</span>
        </div>
        <div className="flex gap-8 text-sm font-medium opacity-80">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Shipping
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Contact Us
          </a>
        </div>
        <div className="flex gap-4">
          <div className="size-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
            <Globe className="w-5 h-5" />
          </div>
          <div className="size-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
            <Share2 className="w-5 h-5" />
          </div>
        </div>
      </div>
    </footer>
  )
}
