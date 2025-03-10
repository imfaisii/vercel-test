import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { categories } from "@/lib/calculator-data"

export default function CalculatorPage({ params }: { params: { calculator: string } }) {
  const influencerCategory = categories.find((cat) => cat.slug === "influencer")
  const calculator = influencerCategory?.calculators.find((calc) => calc.slug === params.calculator)

  if (!calculator) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/calculators/influencer"
        className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Influencer Marketing Calculators
      </Link>
      <h1 className="text-3xl font-bold mb-6">{calculator.name}</h1>
      <p className="text-muted-foreground mb-8">{calculator.description}</p>
      {calculator.component ? (
        <>{calculator.component}</>
      ) : (
        <div className="p-8 text-center bg-muted rounded-lg">
          <p>This calculator is coming soon!</p>
        </div>
      )}
    </div>
  )
}

