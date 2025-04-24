import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PricingPlans } from "@/components/subscription/pricing-plans"

export const metadata = {
  title: "Pricing | Claro Mental Health",
  description: "Choose a subscription plan that fits your needs and budget.",
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <PricingPlans />
      </main>
      <Footer />
    </div>
  )
}
