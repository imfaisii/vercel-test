import Link from "next/link"
import { Calculator } from "lucide-react"
import { Suspense } from "react"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import BasicCalculator from "@/components/calculators/basic-calculator"
import ScientificCalculator from "@/components/calculators/math/scientific"
import GraphingCalculator from "@/components/calculators/math/graphing"
import MatrixCalculator from "@/components/calculators/math/matrix"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Free Math Calculators | Basic, Scientific, Graphing & Matrix Tools",
  description:
    "Solve math problems with our collection of free math calculators. Basic arithmetic, scientific functions, graphing, and matrix operations - all available online for free.",
  keywords: [
    "free math calculators",
    "online math tools",
    "scientific calculator",
    "graphing calculator",
    "matrix calculator",
    "basic calculator",
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

export default function MathCalculators() {
  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: "Math Calculators",
      href: "/calculators/math",
      current: true,
    },
  ]

  const calculators = [
    {
      title: "Basic Calculator",
      description: "Perform simple arithmetic operations",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <BasicCalculator />
        </Suspense>
      ),
      href: "/calculators/math/basic",
    },
    {
      title: "Scientific Calculator",
      description: "Advanced mathematical functions and operations",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <ScientificCalculator />
        </Suspense>
      ),
      href: "/calculators/math/scientific",
    },
    {
      title: "Graphing Calculator",
      description: "Plot and analyze mathematical functions",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <GraphingCalculator />
        </Suspense>
      ),
      href: "/calculators/math/graphing",
    },
    {
      title: "Matrix Calculator",
      description: "Perform operations on matrices",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <MatrixCalculator />
        </Suspense>
      ),
      href: "/calculators/math/matrix",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Math Calculators</h1>
        </div>
        <p className="text-muted-foreground">Basic and advanced mathematical calculators</p>
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

