import type { Metadata } from "next"
import RetirementWithdrawalCalculator from "@/components/calculators/finance/retirement-withdrawal"
import RetirementInsights from "@/components/calculators/finance/retirement-insights"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Retirement Withdrawal Calculator | Safe Withdrawal Rate Analysis",
  description:
    "Calculate how long your retirement savings will last with our interactive retirement withdrawal calculator. Analyze the 4% rule and find your optimal safe withdrawal rate.",
  keywords: [
    "retirement withdrawal calculator",
    "4% rule calculator",
    "safe withdrawal rate",
    "retirement planning",
    "portfolio longevity",
    "retirement income calculator",
    "retirement savings",
  ],
  openGraph: {
    title: "Retirement Withdrawal Calculator | Safe Withdrawal Rate Analysis",
    description:
      "Interactive calculator and data visualizations to determine your optimal retirement withdrawal strategy and portfolio longevity.",
    type: "website",
    images: [
      {
        url: "https://freecalculators.ai/retirement-withdrawal-insights.png",
        width: 1200,
        height: 630,
        alt: "Retirement Withdrawal Strategy Analysis Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Retirement Withdrawal Calculator | Safe Withdrawal Rate Analysis",
    description:
      "Interactive calculator and data visualizations to determine your optimal retirement withdrawal strategy and portfolio longevity.",
    images: ["https://freecalculators.ai/retirement-withdrawal-insights.png"],
  },
}

export default function RetirementWithdrawalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/calculators/finance"
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Finance Calculators
        </Link>
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Retirement Withdrawal Calculator</h1>
        <p className="text-muted-foreground mb-8">
          Plan your retirement income strategy by calculating how long your savings will last with different withdrawal
          rates and investment returns. Our interactive calculator helps you find the optimal safe withdrawal rate for
          your situation.
        </p>

        <RetirementWithdrawalCalculator />

        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Retirement Withdrawal Insights & Analysis</h2>
          <p className="text-muted-foreground mb-6">
            Explore comprehensive data visualizations and insights about retirement withdrawal strategies, success
            rates, and portfolio longevity. These research-backed insights can help you make informed decisions about
            your retirement income plan.
          </p>
          <RetirementInsights />
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">Understanding the 4% Rule and Safe Withdrawal Rates</h2>
          <p>
            The 4% rule is a widely-referenced guideline in retirement planning, suggesting that retirees can withdraw
            4% of their initial portfolio value (adjusted for inflation each year) with a high probability of not
            outliving their savings over a 30-year retirement period.
          </p>
          <p>
            This rule was established by financial advisor William Bengen in 1994 and later supported by the Trinity
            Study, which analyzed historical market data to determine sustainable withdrawal rates. While the 4% rule
            provides a useful starting point, your optimal withdrawal rate may vary based on your specific
            circumstances.
          </p>

          <h3 className="text-xl font-semibold mt-4">Key Factors Affecting Your Withdrawal Strategy</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Initial Portfolio Balance:</strong> The total value of your retirement savings at the beginning of
              retirement determines your baseline withdrawal amount.
            </li>
            <li>
              <strong>Withdrawal Rate:</strong> The percentage of your initial portfolio that you withdraw annually,
              typically between 3-5%. Lower rates increase portfolio longevity but provide less income.
            </li>
            <li>
              <strong>Expected Return:</strong> The average annual return you expect from your investments during
              retirement affects how quickly your portfolio grows or depletes.
            </li>
            <li>
              <strong>Inflation Rate:</strong> The expected average annual increase in the cost of living, which affects
              your withdrawal amount over time. Higher inflation requires larger withdrawals to maintain purchasing
              power.
            </li>
            <li>
              <strong>Retirement Duration:</strong> How many years you expect your retirement to last. Longer
              retirements require more conservative withdrawal rates.
            </li>
            <li>
              <strong>Asset Allocation:</strong> How your portfolio is divided between stocks, bonds, and other
              investments affects both your expected returns and the volatility of your portfolio.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">Alternative Withdrawal Strategies</h3>
          <p className="mt-2">
            While the fixed percentage approach of the 4% rule is straightforward, other withdrawal strategies may be
            worth considering:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong>Dynamic Withdrawal:</strong> Adjusting your withdrawal rate based on market performance, taking
              less in down years.
            </li>
            <li>
              <strong>Floor-and-Ceiling Approach:</strong> Setting minimum and maximum withdrawal amounts to balance
              income stability with portfolio preservation.
            </li>
            <li>
              <strong>Bucket Strategy:</strong> Dividing your portfolio into short-term, medium-term, and long-term
              buckets with different investment approaches.
            </li>
            <li>
              <strong>Required Minimum Distribution (RMD) Method:</strong> Basing withdrawals on IRS life expectancy
              tables, similar to required distributions from retirement accounts.
            </li>
          </ul>

          <p className="mt-4">
            Our calculator allows you to experiment with different withdrawal rates and market scenarios to find the
            approach that best balances your income needs with portfolio sustainability.
          </p>
        </div>
      </div>
    </div>
  )
}

