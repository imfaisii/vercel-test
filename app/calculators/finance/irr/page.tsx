import type { Metadata } from "next"
import { Calculator } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import IRRCalculator from "@/components/calculators/finance/irr"

export const metadata: Metadata = {
  title: "Free IRR Calculator | Internal Rate of Return Calculator",
  description:
    "Calculate the Internal Rate of Return (IRR) for your investments with our free IRR calculator. Evaluate project profitability and make informed investment decisions.",
  keywords: [
    "IRR calculator",
    "internal rate of return",
    "investment calculator",
    "project evaluation",
    "financial calculator",
    "NPV",
    "cash flow analysis",
    "investment return",
    "discount rate",
  ],
}

export default function IRRCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/calculators/finance"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Finance Calculators
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Internal Rate of Return (IRR) Calculator</h1>
        </div>
        <p className="text-muted-foreground">
          Calculate the IRR for your investments to evaluate project profitability
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <IRRCalculator />

        <div className="prose max-w-none">
          <h2>What is the Internal Rate of Return (IRR)?</h2>
          <p>
            The Internal Rate of Return (IRR) is a financial metric used to estimate the profitability of potential
            investments. It is the discount rate that makes the net present value (NPV) of all cash flows from a
            particular project equal to zero.
          </p>

          <h2>How to Use the IRR Calculator</h2>
          <ol>
            <li>Enter your initial investment as a negative number (cash outflow)</li>
            <li>Add the expected cash flows for each period (typically years)</li>
            <li>The calculator will automatically compute the IRR</li>
            <li>Use the advanced tab to see detailed visualizations and analysis</li>
          </ol>

          <h2>How to Interpret IRR Results</h2>
          <p>
            Generally, the higher the IRR, the more desirable the investment. However, IRR should be compared to your
            required rate of return or hurdle rate:
          </p>
          <ul>
            <li>
              <strong>IRR &gt; Hurdle Rate:</strong> The investment may be financially attractive
            </li>
            <li>
              <strong>IRR &lt; Hurdle Rate:</strong> The investment may not be financially viable
            </li>
          </ul>

          <h2>Limitations of IRR</h2>
          <p>While IRR is a powerful metric, it has some limitations to be aware of:</p>
          <ul>
            <li>It assumes all cash flows can be reinvested at the same IRR rate</li>
            <li>It may give misleading results when comparing projects of different sizes or durations</li>
            <li>Multiple IRR values can occur when cash flows change sign more than once</li>
            <li>It doesn't consider the absolute size of the investment</li>
          </ul>

          <h2>When to Use IRR</h2>
          <p>IRR is most useful when:</p>
          <ul>
            <li>Evaluating capital projects or investments</li>
            <li>Comparing investment opportunities with similar risk profiles</li>
            <li>Determining if an investment meets your minimum return requirements</li>
            <li>Analyzing real estate investments, business expansions, or equipment purchases</li>
          </ul>

          <p>
            For a more complete investment analysis, consider using IRR alongside other financial metrics such as Net
            Present Value (NPV), payback period, and return on investment (ROI).
          </p>
        </div>
      </div>
    </div>
  )
}

