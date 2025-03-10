import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import CurrencyConverterCalculator from "@/components/calculators/currency/currency-converter"

export default function CurrencyConverterPage() {
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
        <h1 className="text-3xl font-bold mb-2">Currency Converter</h1>
        <p className="text-muted-foreground">Convert amounts between multiple currencies</p>
      </div>

      <CurrencyConverterCalculator />
    </div>
  )
}

