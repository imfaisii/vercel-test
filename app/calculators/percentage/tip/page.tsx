import Link from "next/link"
import TipCalculator from "@/components/calculators/percentage/tip"

export const metadata = {
  title: "Tip Calculator",
  description: "Calculate tips and split bills",
}

export default function TipCalculatorPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <Link href="/calculators/percentage" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Percentage Calculators
        </Link>
        <h1 className="text-3xl font-bold mt-6 mb-2">Tip Calculator</h1>
        <p className="text-muted-foreground">Calculate tips and split bills among multiple people.</p>
      </div>

      <div className="flex justify-center">
        <TipCalculator />
      </div>
    </div>
  )
}

