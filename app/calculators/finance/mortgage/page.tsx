import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, DollarSign } from "lucide-react"

import MortgageCalculator from "@/components/calculators/finance/mortgage"
import { MortgageInsights } from "@/components/calculators/finance/mortgage-insights"

export const metadata: Metadata = {
  title: "Free Mortgage Calculator | Calculate Payments, Amortization & Interest",
  description:
    "Calculate your mortgage payments, view amortization schedules, and compare different loan terms with our free mortgage calculator. Make informed home buying decisions.",
  keywords: [
    "mortgage calculator",
    "home loan calculator",
    "mortgage payment calculator",
    "amortization schedule",
    "mortgage interest calculator",
    "house payment calculator",
    "mortgage comparison tool",
    "free mortgage calculator",
    "mortgage visualization",
    "loan term comparison",
  ],
}

export default function MortgageCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/calculators/finance"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Finance Calculators
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Mortgage Calculator</h1>
        </div>
        <p className="text-muted-foreground">
          Calculate mortgage payments, amortization schedules, and compare loan options
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading calculator...</div>}>
          <MortgageCalculator />
        </Suspense>

        <section id="mortgage-insights" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Understanding Your Mortgage</h2>
          <MortgageInsights />
        </section>

        <section id="mortgage-faq" className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold text-lg">What is an amortization schedule?</h3>
              <p className="mt-2 text-muted-foreground">
                An amortization schedule is a table that shows each payment throughout the life of your mortgage,
                breaking down how much goes toward principal and interest. Early in your mortgage, most of your payment
                goes toward interest, but this shifts toward principal over time.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold text-lg">How does my down payment affect my mortgage?</h3>
              <p className="mt-2 text-muted-foreground">
                A larger down payment reduces your loan amount, which lowers your monthly payment and total interest
                paid. Additionally, a down payment of 20% or more typically allows you to avoid Private Mortgage
                Insurance (PMI), which can save you hundreds of dollars per month.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold text-lg">Should I choose a 15-year or 30-year mortgage?</h3>
              <p className="mt-2 text-muted-foreground">
                A 15-year mortgage typically has a lower interest rate and significantly reduces the total interest
                paid, but comes with higher monthly payments. A 30-year mortgage offers lower monthly payments but costs
                more in total interest over the life of the loan. Choose based on your financial situation and goals.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold text-lg">What's included in my monthly mortgage payment?</h3>
              <p className="mt-2 text-muted-foreground">
                Your monthly mortgage payment typically includes principal, interest, property taxes, and homeowners
                insurance (collectively known as PITI). It may also include Private Mortgage Insurance (PMI) if your
                down payment is less than 20%, and possibly homeowners association (HOA) fees.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

