import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ExchangeRateCalculator from "@/components/calculators/currency/exchange-rate"

export default function ExchangeRatePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link
          href="/calculators/currency"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Currency Calculators
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Exchange Rate Calculator</h1>
        <p className="text-muted-foreground">Convert between different currencies using current exchange rates</p>
      </div>

      <ExchangeRateCalculator />
    </div>
  )
}

