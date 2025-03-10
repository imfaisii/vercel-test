import type { Metadata } from "next"
import { getCalculatorData } from "@/lib/calculator-data"
import VelocityCalculator from "@/components/calculators/physics/velocity"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Velocity Calculator",
  description: "Calculate velocity, distance, and time",
}

export default function VelocityCalculatorPage() {
  const calculator = getCalculatorData("physics", "velocity")

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
        <VelocityCalculator />
      </div>
    </div>
  )
}

