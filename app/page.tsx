import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Flavors from "@/components/Flavors"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <Features />
          <Flavors />
        </main>
        <Footer />
      </div>
    </div>
  )
}
