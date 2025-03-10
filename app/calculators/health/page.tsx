import Link from "next/link"
import { Scale } from "lucide-react"
import { Suspense } from "react"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import BMICalculator from "@/components/calculators/health/bmi"
import CalorieCalculator from "@/components/calculators/health/calorie"
import BodyFatCalculator from "@/components/calculators/health/body-fat"
import HeartRateCalculator from "@/components/calculators/health/heart-rate"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Free Health Calculators | BMI, Calorie, Body Fat & Heart Rate Tools",
  description:
    "Monitor your health with our free health calculators. Calculate BMI, daily calorie needs, body fat percentage, and target heart rate zones for better fitness.",
  keywords: [
    "free health calculators",
    "BMI calculator",
    "calorie calculator",
    "body fat calculator",
    "heart rate calculator",
    "fitness tools",
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

export default function HealthCalculators() {
  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: "Health Calculators",
      href: "/calculators/health",
      current: true,
    },
  ]

  const calculators = [
    {
      title: "BMI Calculator",
      description: "Calculate Body Mass Index based on height and weight",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <BMICalculator />
        </Suspense>
      ),
      href: "/calculators/health/bmi",
    },
    {
      title: "Calorie Calculator",
      description: "Calculate daily calorie needs based on activity level",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <CalorieCalculator />
        </Suspense>
      ),
      href: "/calculators/health/calorie",
    },
    {
      title: "Body Fat Calculator",
      description: "Estimate body fat percentage",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <BodyFatCalculator />
        </Suspense>
      ),
      href: "/calculators/health/body-fat",
    },
    {
      title: "Heart Rate Calculator",
      description: "Calculate target heart rate zones for exercise",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <HeartRateCalculator />
        </Suspense>
      ),
      href: "/calculators/health/heart-rate",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Health Calculators</h1>
        </div>
        <p className="text-muted-foreground">Health and fitness related calculators</p>
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

