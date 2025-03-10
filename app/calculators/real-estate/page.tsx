import Link from "next/link"
import { Home } from "lucide-react"
import { Suspense } from "react"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import RentalYieldCalculator from "@/components/calculators/real-estate/rental-yield"
import CapRateCalculator from "@/components/calculators/real-estate/cap-rate"
import NetOperatingIncomeCalculator from "@/components/calculators/real-estate/net-operating-income"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Free Real Estate Calculators | Property Investment & Analysis Tools",
  description:
    "Make smarter property investments with our free real estate calculators. Calculate rental yields, cap rates, property ROI, and NOI - all for free.",
  keywords: [
    "free real estate calculators",
    "rental yield calculator",
    "capitalization rate calculator",
    "cap rate calculator",
    "property ROI calculator",
    "net operating income calculator",
    "NOI calculator",
    "real estate investment tools",
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

export default function RealEstateCalculators() {
  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: "Real Estate Calculators",
      href: "/calculators/real-estate",
      current: true,
    },
  ]

  const calculators = [
    {
      title: "Rental Yield Calculator",
      description: "Calculate gross and net rental yields for property investments",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <RentalYieldCalculator />
        </Suspense>
      ),
      href: "/calculators/real-estate/rental-yield",
    },
    {
      title: "Capitalization Rate Calculator",
      description: "Calculate the capitalization rate for commercial real estate investments",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <CapRateCalculator />
        </Suspense>
      ),
      href: "/calculators/real-estate/cap-rate",
    },
    {
      title: "Net Operating Income Calculator",
      description: "Calculate the profitability of income-generating real estate properties",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <NetOperatingIncomeCalculator />
        </Suspense>
      ),
      href: "/calculators/real-estate/net-operating-income",
    },
    {
      title: "Property ROI Calculator",
      description: "Calculate return on investment for real estate properties",
      component: null,
      href: "/calculators/real-estate/property-roi",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Home className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Real Estate Calculators</h1>
        </div>
        <p className="text-muted-foreground">Property investment and analysis calculators</p>
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

