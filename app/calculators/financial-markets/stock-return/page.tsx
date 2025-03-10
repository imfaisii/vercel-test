import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import StockReturnWrapper from "@/components/calculators/financial-markets/stock-return-wrapper"
import StockReturnInsights from "@/components/calculators/financial-markets/stock-return-insights"

export const metadata: Metadata = {
  title: "Stock Return Calculator | Investment Growth Projections",
  description:
    "Calculate potential investment returns with our free stock return calculator. See how your investments could grow over time with dividends, additional contributions, and compound interest.",
  keywords: [
    "stock return calculator",
    "investment calculator",
    "compound interest calculator",
    "dividend reinvestment calculator",
    "investment growth calculator",
    "retirement calculator",
    "stock market historical returns",
    "sector performance data",
    "investment growth visualization",
  ],
}

export default function StockReturnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/calculators/financial-markets"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Financial Markets Calculators
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Stock Return Calculator</h1>
        <p className="text-muted-foreground max-w-3xl">
          Calculate how your investments could grow over time with this comprehensive stock return calculator. Adjust
          parameters like initial investment, additional contributions, expected returns, and dividend yield to see
          potential growth scenarios.
        </p>
      </div>

      <div className="mb-8">
        <StockReturnWrapper />
      </div>

      {/* Add the insights component */}
      <StockReturnInsights />

      <div className="prose max-w-3xl mx-auto mt-12">
        <h2>How to Use the Stock Return Calculator</h2>
        <p>
          This calculator helps you project the potential growth of your investments over time. Here's how to use it:
        </p>
        <ul>
          <li>
            <strong>Initial Investment:</strong> Enter the amount you're starting with.
          </li>
          <li>
            <strong>Additional Contribution:</strong> Set any regular contributions you plan to make.
          </li>
          <li>
            <strong>Frequency:</strong> Choose how often you'll make additional contributions.
          </li>
          <li>
            <strong>Investment Period:</strong> Adjust the slider to set how many years you plan to invest.
          </li>
          <li>
            <strong>Annual Return:</strong> Set your expected annual return rate (excluding dividends).
          </li>
          <li>
            <strong>Dividend Yield:</strong> Enter the expected annual dividend yield percentage.
          </li>
          <li>
            <strong>Reinvest Dividends:</strong> Toggle whether dividends are reinvested or taken as income.
          </li>
          <li>
            <strong>Inflation Rate:</strong> Set the expected average inflation rate to see inflation-adjusted returns.
          </li>
        </ul>

        <h2>Understanding the Results</h2>
        <p>The calculator provides several key metrics to help you understand your potential investment growth:</p>
        <ul>
          <li>
            <strong>Final Investment Value:</strong> The projected total value of your investment at the end of the
            period.
          </li>
          <li>
            <strong>Total Contributions:</strong> The sum of your initial investment and all additional contributions.
          </li>
          <li>
            <strong>Total Return:</strong> The percentage return on your investment over the entire period.
          </li>
          <li>
            <strong>Annualized Return:</strong> The compound annual growth rate (CAGR) of your investment.
          </li>
          <li>
            <strong>Growth Chart:</strong> A visual representation of how your investment grows over time, showing the
            distinction between your contributions (principal) and investment growth.
          </li>
        </ul>

        <h2>Important Notes</h2>
        <p>
          Remember that this calculator provides estimates based on constant returns. Actual market returns vary year to
          year and may differ significantly from these projections. The calculator is for informational purposes only
          and should not be considered financial advice.
        </p>
      </div>
    </div>
  )
}

