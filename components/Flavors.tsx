"use client"

import { Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Flavors() {
  const flavors = [
    {
      name: "Chocolate",
      price: "₹20",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA7yrFkASfKTwBuASNTkFxlnaFDqnIV00BGRg3-YRJJjOKcsQEDO_l7lsXELbQBEWkjiPzfFVA3RHS62Yj3_QqkJ7Q8yvgxArtOYPRN04TRayyQpZpQ2LFuiQqmN2KG_D2wBlS0o3xn-Vx5BeVnBCqFw3K8vjYMw-zXllq9JaXD5aAqq5hQQ38V0OwHsHsxgp5YxfRY0-LgbUrO3StACs_XepMgs6wKyb_wRFn9UxLBsCiTz8qieoGKWCu1zDb8BFsWJXPXtPptuE0",
    },
    {
      name: "Rich Vanilla",
      price: "₹20",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAh7QSRZSrQj4ZjGN_UCV3mdyRMk5FzdrvFQMA4jn2d5GGo4pd5fe90dgqfGNCDAqwnklKom1_9hyXTsnUUI1FA5V-GALhrGzbw8eLL4Xm-Sje-fAwj5eSkvbmiNkB2eXNsyX1meKdw9FKMCAQXQBC8lwtdLkbnUQStKX6yRw-BUH1ekq2Kw7Xx9T9GPWk2g50JzsWezQbW6iLmsUQc1Q0YFN403HloaxJrHG3nJIfNx6ssrLCLzSvONbnGrRwkuILWxdkiv6cA98U",
    },
    {
      name: "Strawberry",
      price: "₹20",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDr-jLaGRcdIfl1OMli5MRIp1acNxHcxO5d00ajD9z0BCc07VYk2omOqCsHZTeWjsPoihMjxCuepXSjvdbfGLRw1EBRk-4xI8JLkLYYbnoiFv2TMBHb-gNjbjBD6yTg994FPAE8mjFZDR-4AFU5FXgJO3b_FDu63-CZwAtBH4QigoXkIJ4R-MSc23fb6wywBtvMAN6cGD_nb35T_xEjnX3MxiYQXRutH5vQMXaJodtB9Ine8hF1QW55hf6YjAZNvBbQsgNMW6EDs2s",
    },
    {
      name: "Dark Coffee",
      price: "₹20",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCQegfWxrdsodM1omTT3mAuDAMeNbpBp7EA9gG8SW2O57zqxRRJD_kWY0994zTcMdceW1WBqeLUSfML3tx1HbNP9qHzuQdwqTGcjxXeti5BetPV9iJVaSPqnGehsL6JGSThsOfnAVDOhvk0Yjf3KJfcC-mk85mwSButo9Ku6R6PoiE6H8u1irluKT4OcqkNkqVlOl_Ti__bfam8Mx9q9Cr11jnHsoavYp0AKDyCQWLoDnfkH25O79u6D_fivjt_QO7zvdy-ygzIDyw",
    },
  ]

  return (
    <section className="pb-24 bg-background-light dark:bg-background-dark">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-chocolate-rich dark:text-white">
            Explore More Flavors
          </h2>
          <a
            className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
            href="#"
          >
            See All <ChevronRight className="w-5 h-5" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {flavors.map((flavor, index) => (
            <Card
              key={index}
              className="group bg-white dark:bg-[#332222] p-4 rounded-xl shadow-sm hover:shadow-xl transition-all"
            >
              <div
                className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg mb-4"
                style={{ backgroundImage: `url("${flavor.image}")` }}
              ></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold">{flavor.name}</p>
                  <p className="text-sm text-slate-500 font-medium">{flavor.price} per roll</p>
                </div>
                <Button
                  size="icon"
                  className="size-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
