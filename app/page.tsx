import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Flavors from "@/components/Flavors"
import Features from "@/components/Features"
import Ingredients from "@/components/Ingredients"
import FeaturedProducts from "@/components/FeaturedProducts"
import Reviews from "@/components/Reviews"
import HowItWorks from "@/components/HowItWorks"
import Gallery from "@/components/Gallery"
import FAQ from "@/components/FAQ"
import FinalCTA from "@/components/FinalCTA"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        <Flavors />
        <Features />
        <Ingredients />

        <Reviews />
        <HowItWorks />
        <Gallery />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
