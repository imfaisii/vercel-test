import Link from "next/link"
import DiscountCalculator from "@/components/calculators/percentage/discount"

export const metadata = {
  title: "Discount Calculator",
  description: "Calculate discounted prices and savings",
}

export default function DiscountCalculatorPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <Link href="/calculators/percentage" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Percentage Calculators
        </Link>
        <h1 className="text-3xl font-bold mt-6 mb-2">Discount Calculator</h1>
        <p className="text-muted-foreground">Calculate discounted prices and savings with this easy-to-use tool.</p>
      </div>

      <div className="flex justify-center">
        <DiscountCalculator />
      </div>
    </div>
  )
}

