import Link from "next/link"
import TaxCalculator from "@/components/calculators/percentage/tax"

export const metadata = {
  title: "Tax Calculator",
  description: "Calculate tax amounts and totals",
}

export default function TaxCalculatorPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <Link href="/calculators/percentage" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Percentage Calculators
        </Link>
        <h1 className="text-3xl font-bold mt-6 mb-2">Tax Calculator</h1>
        <p className="text-muted-foreground">
          Calculate tax amounts and totals for sales tax, VAT, and other tax types.
        </p>
      </div>

      <div className="flex justify-center">
        <TaxCalculator />
      </div>
    </div>
  )
}

