import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"
import type { Metadata } from "next"

import PortfolioAllocationWrapper from "@/components/calculators/financial-markets/portfolio-allocation-wrapper"
import PortfolioAllocationInsights from "@/components/calculators/financial-markets/portfolio-allocation-insights"

export const metadata: Metadata = {
  title: "Free Portfolio Allocation Calculator | Asset Allocation Tool",
  description:
    "Optimize your investment portfolio with our free portfolio allocation calculator. Balance risk and return across stocks, bonds, and other asset classes.",
  keywords: [
    "portfolio allocation calculator",
    "asset allocation tool",
    "investment portfolio optimizer",
    "risk-based portfolio allocation",
    "diversification calculator",
    "efficient frontier",
    "portfolio diversification",
    "investment risk management",
  ],
}

// Create a loading component
function LoadingCalculator() {
  return (
    <div className="flex items-center justify-center h-[400px] w-full bg-muted/20 rounded-lg">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading calculator...</p>
      </div>
    </div>
  )
}

export default function PortfolioAllocationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/calculators/financial-markets"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Financial Markets Calculators
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Portfolio Allocation Calculator</h1>
        <p className="text-muted-foreground">
          Optimize your investment portfolio allocation based on risk tolerance and expected returns.
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <Suspense fallback={<LoadingCalculator />}>
          <PortfolioAllocationWrapper />
        </Suspense>
      </div>

      <PortfolioAllocationInsights />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">About the Portfolio Allocation Calculator</h2>
        <p className="mb-4">
          Our free portfolio allocation calculator helps you create a diversified investment portfolio based on your
          risk tolerance. This tool allows you to distribute your investments across different asset classes including
          stocks, bonds, cash, real estate, and commodities.
        </p>
        <h3 className="text-xl font-medium mb-2">How to Use This Calculator</h3>
        <p className="mb-4">
          1. Enter your total investment amount
          <br />
          2. Select a risk profile (conservative, moderate, aggressive) or create a custom allocation
          <br />
          3. Adjust the allocation percentages using the sliders if needed
          <br />
          4. View the expected returns and projected growth in the Results tab
        </p>
        <h3 className="text-xl font-medium mb-2">Understanding Asset Allocation</h3>
        <p className="mb-4">
          Asset allocation is the process of dividing your investments among different asset classes to balance risk and
          reward according to your goals, risk tolerance, and investment timeline. A well-diversified portfolio helps
          reduce risk while potentially improving returns over time.
        </p>
        <h3 className="text-xl font-medium mb-2">Risk and Return</h3>
        <p className="mb-4">
          Generally, higher-risk investments like stocks have higher potential returns but also higher volatility.
          Lower-risk investments like bonds and cash typically offer more stability but lower returns. The right balance
          depends on your investment goals, time horizon, and comfort with market fluctuations.
        </p>
      </div>
    </div>
  )
}

