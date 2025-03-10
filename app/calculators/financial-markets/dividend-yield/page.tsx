import type { Metadata } from "next"
import DividendYieldWrapper from "@/components/calculators/financial-markets/dividend-yield-wrapper"
import { DividendYieldInsights } from "@/components/calculators/financial-markets/dividend-yield-insights"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Dividend Yield Calculator | Track and Project Dividend Income",
  description:
    "Calculate dividend yield, project future income, and analyze dividend growth with our comprehensive dividend yield calculator and visualization tools.",
  keywords:
    "dividend yield calculator, dividend income, dividend growth, dividend aristocrats, dividend investing, income investing, DRIP, dividend reinvestment",
  openGraph: {
    title: "Dividend Yield Calculator | Track and Project Dividend Income",
    description:
      "Calculate dividend yield, project future income, and analyze dividend growth with our comprehensive dividend yield calculator and visualization tools.",
    images: [
      {
        url: "/og-images/dividend-yield-calculator.png",
        width: 1200,
        height: 630,
        alt: "Dividend Yield Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dividend Yield Calculator | Track and Project Dividend Income",
    description:
      "Calculate dividend yield, project future income, and analyze dividend growth with our comprehensive dividend yield calculator and visualization tools.",
    images: ["/og-images/dividend-yield-calculator.png"],
  },
}

export default function DividendYieldPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/calculators/financial-markets"
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Financial Markets Calculators
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Dividend Yield Calculator</h1>

      <div className="mb-8">
        <p className="text-lg mb-4">
          Calculate dividend yield, project future income, and analyze the growth potential of dividend-paying
          investments. This calculator helps you evaluate income-generating stocks and build a sustainable dividend
          portfolio.
        </p>
      </div>

      <div className="mb-12">
        <DividendYieldWrapper />
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Understanding Dividend Yield</h2>
        <div className="prose max-w-none">
          <p>
            Dividend yield is a financial ratio that shows how much a company pays out in dividends each year relative
            to its stock price. It's calculated by dividing the annual dividend per share by the current share price and
            is typically expressed as a percentage.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">How to Use This Calculator</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Enter the current stock price</li>
            <li>Input the annual dividend amount per share</li>
            <li>Specify your number of shares (optional)</li>
            <li>Add expected dividend growth rate to see future projections</li>
            <li>View your current yield and projected income over time</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Dividend Yield Formula</h3>
          <p>The dividend yield is calculated using the following formula:</p>
          <div className="bg-gray-100 p-4 rounded-md my-4">
            <p className="font-mono">Dividend Yield (%) = (Annual Dividend Per Share / Current Share Price) × 100</p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Interpreting Dividend Yield</h3>
          <p>A higher dividend yield might seem attractive, but it's important to consider:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Sustainability:</strong> Is the payout ratio reasonable for the company's industry?
            </li>
            <li>
              <strong>Growth potential:</strong> Companies with lower yields might offer faster dividend growth
            </li>
            <li>
              <strong>Risk factors:</strong> Unusually high yields may indicate underlying problems
            </li>
            <li>
              <strong>Tax implications:</strong> Dividend income may be taxed differently than capital gains
            </li>
          </ul>
        </div>
      </section>

      {/* Data Insights Section */}
      <section className="mb-12">
        <DividendYieldInsights />
      </section>

      {/* FAQ Section with Structured Data */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">What is a good dividend yield?</h3>
            <p>
              A "good" dividend yield depends on your investment goals, risk tolerance, and market conditions.
              Generally, yields between 2-6% are considered reasonable. Higher yields (above 6%) may indicate higher
              risk or limited growth potential, while lower yields (below 2%) might offer better growth prospects.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">How often are dividends paid?</h3>
            <p>
              Most U.S. companies pay dividends quarterly, though some pay monthly, semi-annually, or annually. The
              frequency varies by company and region. REITs often pay monthly dividends, while many European companies
              pay semi-annually or annually.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">What is dividend reinvestment (DRIP)?</h3>
            <p>
              Dividend Reinvestment Plans (DRIPs) automatically use dividend payments to purchase additional shares of
              the same stock. This compounds your investment over time by increasing your share count, which in turn
              generates more dividend income in the future.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Are dividends guaranteed?</h3>
            <p>
              No, dividends are not guaranteed. Companies can reduce, suspend, or eliminate their dividends at any time,
              particularly during financial difficulties. Companies with long histories of dividend payments and
              increases (like Dividend Aristocrats) tend to be more reliable dividend payers.
            </p>
          </div>
        </div>
      </section>

      {/* Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is a good dividend yield?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: 'A "good" dividend yield depends on your investment goals, risk tolerance, and market conditions. Generally, yields between 2-6% are considered reasonable. Higher yields (above 6%) may indicate higher risk or limited growth potential, while lower yields (below 2%) might offer better growth prospects.',
                },
              },
              {
                "@type": "Question",
                name: "How often are dividends paid?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most U.S. companies pay dividends quarterly, though some pay monthly, semi-annually, or annually. The frequency varies by company and region. REITs often pay monthly dividends, while many European companies pay semi-annually or annually.",
                },
              },
              {
                "@type": "Question",
                name: "What is dividend reinvestment (DRIP)?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Dividend Reinvestment Plans (DRIPs) automatically use dividend payments to purchase additional shares of the same stock. This compounds your investment over time by increasing your share count, which in turn generates more dividend income in the future.",
                },
              },
              {
                "@type": "Question",
                name: "Are dividends guaranteed?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No, dividends are not guaranteed. Companies can reduce, suspend, or eliminate their dividends at any time, particularly during financial difficulties. Companies with long histories of dividend payments and increases (like Dividend Aristocrats) tend to be more reliable dividend payers.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}

