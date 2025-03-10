import Link from "next/link"
import { Briefcase } from "lucide-react"
import { Suspense } from "react"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ROICalculator from "@/components/calculators/business/roi"
import LTVCalculator from "@/components/calculators/business/ltv"
import BreakEvenCalculator from "@/components/calculators/business/break-even"
import ProfitMarginCalculator from "@/components/calculators/business/profit-margin"
import DepreciationCalculator from "@/components/calculators/business/depreciation"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Free Business Calculators | ROI, LTV, Break-Even & Profit Tools",
  description:
    "Make smarter business decisions with our free business calculators. Calculate ROI, customer lifetime value, break-even points, profit margins, and asset depreciation.",
  keywords: [
    "free business calculators",
    "ROI calculator",
    "LTV calculator",
    "break-even calculator",
    "profit margin calculator",
    "depreciation calculator",
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

export default function BusinessCalculators() {
  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: "Business Calculators",
      href: "/calculators/business",
      current: true,
    },
  ]

  const calculators = [
    {
      title: "ROI Calculator",
      description: "Calculate return on investment for business projects",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <ROICalculator />
        </Suspense>
      ),
      href: "/calculators/business/roi",
    },
    {
      title: "LTV/CLV Calculator",
      description: "Calculate Customer Lifetime Value for business growth",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <LTVCalculator />
        </Suspense>
      ),
      href: "/calculators/business/ltv",
    },
    {
      title: "Break-Even Calculator",
      description: "Determine when a business will become profitable",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <BreakEvenCalculator />
        </Suspense>
      ),
      href: "/calculators/business/break-even",
    },
    {
      title: "Profit Margin Calculator",
      description: "Calculate gross, operating, and net profit margins",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <ProfitMarginCalculator />
        </Suspense>
      ),
      href: "/calculators/business/profit-margin",
    },
    {
      title: "Depreciation Calculator",
      description: "Calculate asset depreciation over time",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <DepreciationCalculator />
        </Suspense>
      ),
      href: "/calculators/business/depreciation",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Business Calculators</h1>
        </div>
        <p className="text-muted-foreground">Business and financial analysis tools</p>
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

