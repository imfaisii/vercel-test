import Link from "next/link"
import { LineChart } from "lucide-react"
import { Suspense } from "react"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import StockReturnCalculator from "@/components/calculators/financial-markets/stock-return"
import PortfolioAllocationCalculator from "@/components/calculators/financial-markets/portfolio-allocation"
import DividendYieldCalculator from "@/components/calculators/financial-markets/dividend-yield"
import OptionsPricingCalculator from "@/components/calculators/financial-markets/options-pricing"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Free Financial Markets Calculators | Stock, Portfolio & Investment Tools",
  description:
    "Analyze investments with our free financial markets calculators. Calculate stock returns, optimize portfolio allocation, and analyze dividend yields - all for free.",
  keywords: [
    "free financial markets calculators",
    "stock return calculator",
    "portfolio allocation calculator",
    "dividend yield calculator",
    "options pricing calculator",
    "investment analysis tools",
  ],
}

// Create a loading component for the Suspense fallback
function CalculatorLoading() {
  return (
    <div className="h-48 flex items-center justify-center bg-muted/40 rounded-md">
      <p className="text-muted-foreground">Loading calculator...</p>
    </div>
  )
}

export default function FinancialMarketsCalculators() {
  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: "Financial Markets Calculators",
      href: "/calculators/financial-markets",
      current: true,
    },
  ]

  const calculators = [
    {
      title: "Stock Return Calculator",
      description: "Calculate stock returns including dividends and capital gains",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <StockReturnCalculator />
        </Suspense>
      ),
      href: "/calculators/financial-markets/stock-return",
    },
    {
      title: "Portfolio Allocation Calculator",
      description: "Optimize asset allocation based on risk tolerance",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <PortfolioAllocationCalculator />
        </Suspense>
      ),
      href: "/calculators/financial-markets/portfolio-allocation",
    },
    {
      title: "Dividend Yield Calculator",
      description: "Calculate dividend yield and income projections",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <DividendYieldCalculator />
        </Suspense>
      ),
      href: "/calculators/financial-markets/dividend-yield",
    },
    {
      title: "Options Pricing Calculator",
      description: "Calculate option prices using Black-Scholes model",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <OptionsPricingCalculator />
        </Suspense>
      ),
      href: "/calculators/financial-markets/options-pricing",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <LineChart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Financial Markets Calculators</h1>
        </div>
        <p className="text-muted-foreground">Stock market and investment analysis tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {calculators.map((calculator, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{calculator.title}</CardTitle>
              <CardDescription>{calculator.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {calculator.component ? (
                <div className="h-48 overflow-hidden">{calculator.component}</div>
              ) : (
                <div className="h-48 flex items-center justify-center bg-muted/40 rounded-md">
                  <p className="text-muted-foreground">Calculator preview not available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href={calculator.href} className="w-full">
                <Button variant="outline" className="w-full">
                  View Free Calculator
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

