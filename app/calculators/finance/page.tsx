import Link from "next/link"
import { DollarSign } from "lucide-react"
import { Suspense } from "react"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import MortgageCalculator from "@/components/calculators/finance/mortgage"
import InvestmentCalculator from "@/components/calculators/finance/investment"
import LoanCalculator from "@/components/calculators/finance/loan"
import TaxCalculator from "@/components/calculators/finance/tax"
import RetirementWithdrawalCalculator from "@/components/calculators/finance/retirement-withdrawal"
import { Breadcrumb } from "@/components/breadcrumb"

// Update the metadata to include the new calculator
export const metadata: Metadata = {
  title: "Free Finance Calculators | Mortgage, Investment, Loan & Tax Tools",
  description:
    "Plan your financial future with our free finance calculators. Calculate mortgage payments, investment returns, loan amortization, tax estimates, and retirement withdrawals - all for free.",
  keywords: [
    "free finance calculators",
    "mortgage calculator",
    "investment calculator",
    "loan calculator",
    "tax calculator",
    "retirement withdrawal calculator",
    "financial planning tools",
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

export default function FinanceCalculators() {
  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: "Finance Calculators",
      href: "/calculators/finance",
      current: true,
    },
  ]

  const calculators = [
    {
      title: "Mortgage Calculator",
      description: "Calculate mortgage payments and amortization schedules",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <MortgageCalculator />
        </Suspense>
      ),
      href: "/calculators/finance/mortgage",
    },
    {
      title: "Investment Calculator",
      description: "Calculate investment growth and returns",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <InvestmentCalculator />
        </Suspense>
      ),
      href: "/calculators/finance/investment",
    },
    {
      title: "Loan Calculator",
      description: "Calculate loan payments and interest",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <LoanCalculator />
        </Suspense>
      ),
      href: "/calculators/finance/loan",
    },
    {
      title: "Tax Calculator",
      description: "Estimate income tax and deductions",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <TaxCalculator />
        </Suspense>
      ),
      href: "/calculators/finance/tax",
    },
    {
      title: "Retirement Withdrawal Calculator",
      description: "Calculate how long your retirement savings will last",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <RetirementWithdrawalCalculator />
        </Suspense>
      ),
      href: "/calculators/finance/retirement-withdrawal",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Finance Calculators</h1>
        </div>
        <p className="text-muted-foreground">Financial planning and calculation tools</p>
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

