import Link from "next/link"
import IncreaseDecreaseCalculator from "@/components/calculators/percentage/increase-decrease"

export const metadata = {
  title: "Percentage Increase/Decrease Calculator",
  description: "Calculate percentage increases and decreases",
}

export default function IncreaseDecreaseCalculatorPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <Link href="/calculators/percentage" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Percentage Calculators
        </Link>
        <h1 className="text-3xl font-bold mt-6 mb-2">Percentage Increase/Decrease Calculator</h1>
        <p className="text-muted-foreground">Calculate the result of a percentage increase or decrease on any value.</p>
      </div>

      <div className="flex justify-center">
        <IncreaseDecreaseCalculator />
      </div>
    </div>
  )
}

