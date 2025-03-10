import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import OptionsPricingWrapper from "@/components/calculators/financial-markets/options-pricing-wrapper"
import { OptionsPricingInsights } from "@/components/calculators/financial-markets/options-pricing-insights"

export const metadata: Metadata = {
  title: "Options Pricing Calculator | Black-Scholes Model",
  description:
    "Calculate fair values for call and put options using the Black-Scholes model with our free options pricing calculator. Analyze option Greeks and visualize price sensitivities.",
  keywords: [
    "options pricing calculator",
    "Black-Scholes calculator",
    "option Greeks calculator",
    "call option calculator",
    "put option calculator",
    "options trading calculator",
    "implied volatility calculator",
    "option time decay",
    "delta gamma calculator",
    "options strategies",
    "options risk management",
    "theta vega rho",
  ],
}

export default function OptionsPricingPage() {
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Options Pricing Calculator</h1>
        <p className="text-muted-foreground max-w-3xl">
          Calculate theoretical prices for call and put options using the Black-Scholes model. Adjust parameters like
          stock price, strike price, time to expiration, volatility, and interest rates to see how they affect option
          prices and Greeks.
        </p>
      </div>

      <div className="mb-8">
        <OptionsPricingWrapper />
      </div>

      {/* Add the new insights component */}
      <OptionsPricingInsights />

      <div className="prose max-w-3xl mx-auto mt-12">
        <h2>How to Use the Options Pricing Calculator</h2>
        <p>
          This calculator helps you determine theoretical prices for options using the Black-Scholes model. Here's how
          to use it:
        </p>
        <ul>
          <li>
            <strong>Stock Price:</strong> Enter the current price of the underlying stock.
          </li>
          <li>
            <strong>Strike Price:</strong> Set the strike price of the option.
          </li>
          <li>
            <strong>Time to Expiration:</strong> Enter the time remaining until the option expires (in years).
          </li>
          <li>
            <strong>Volatility:</strong> Set the expected volatility of the underlying stock (annualized).
          </li>
          <li>
            <strong>Risk-Free Rate:</strong> Enter the risk-free interest rate (usually based on Treasury yields).
          </li>
          <li>
            <strong>Dividend Yield:</strong> Set the annual dividend yield of the underlying stock, if applicable.
          </li>
        </ul>

        <h2>Understanding the Results</h2>
        <p>The calculator provides several key metrics:</p>
        <ul>
          <li>
            <strong>Call Option Price:</strong> The theoretical price of a call option with the given parameters.
          </li>
          <li>
            <strong>Put Option Price:</strong> The theoretical price of a put option with the given parameters.
          </li>
          <li>
            <strong>Option Greeks:</strong> Delta, Gamma, Theta, Vega, and Rho for both call and put options.
          </li>
          <li>
            <strong>Interactive Charts:</strong> Visualize how option prices change as different parameters vary.
          </li>
        </ul>

        <h2>About the Black-Scholes Model</h2>
        <p>
          The Black-Scholes model is a mathematical model used to determine the theoretical price of European-style
          options. It assumes that the price of the underlying asset follows a geometric Brownian motion with constant
          drift and volatility.
        </p>
        <p>
          While the model provides a useful framework for options pricing, it has limitations. It assumes European-style
          options (which can only be exercised at expiration), no transaction costs, constant volatility, and that
          markets are efficient. Real-world options may deviate from these theoretical prices due to various market
          factors.
        </p>

        <h2>Understanding Option Greeks</h2>
        <p>Option Greeks measure the sensitivity of option prices to various factors:</p>
        <ul>
          <li>
            <strong>Delta:</strong> Measures how much an option's price changes when the underlying stock price changes
            by $1.
          </li>
          <li>
            <strong>Gamma:</strong> Measures the rate of change of Delta with respect to changes in the underlying
            price.
          </li>
          <li>
            <strong>Theta:</strong> Measures the rate at which an option loses value as time passes (time decay).
          </li>
          <li>
            <strong>Vega:</strong> Measures sensitivity to changes in volatility.
          </li>
          <li>
            <strong>Rho:</strong> Measures sensitivity to changes in the risk-free interest rate.
          </li>
        </ul>
      </div>
    </div>
  )
}

