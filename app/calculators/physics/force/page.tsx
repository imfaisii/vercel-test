import type { Metadata } from "next"
import { getCalculatorData } from "@/lib/calculator-data"
import ForceCalculator from "@/components/calculators/physics/force"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Force Calculator",
  description: "Calculate force using Newton's Second Law (F = m × a) and convert between force units",
}

export default function ForceCalculatorPage() {
  const calculator = getCalculatorData("physics", "force")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/calculators/physics"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Physics Calculators
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{calculator?.name} Calculator</h1>
        <p className="text-muted-foreground">{calculator?.description}</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ForceCalculator />
      </div>
    </div>
  )
}

