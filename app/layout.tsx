import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/lib/ReduxProvider"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "IcePops | New Product Launch",
  description: "Experience the perfect crunch with a velvety center. IcePops' all-new Cream Rolls are here to redefine snacking.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${plusJakarta.variable} font-display bg-background-light dark:bg-background-dark text-[#181111] dark:text-white transition-colors duration-300`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
