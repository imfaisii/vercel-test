import type { Metadata } from "next"
import CapRateCalculator from "@/components/calculators/real-estate/cap-rate"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Cap Rate Calculator | Real Estate Tools",
  description:
    "Calculate the capitalization rate for your real estate investments to evaluate potential returns and compare properties.",
  openGraph: {
    title: "Cap Rate Calculator | Real Estate Tools",
    description:
      "Calculate the capitalization rate for your real estate investments to evaluate potential returns and compare properties.",
    type: "website",
  },
}

export default function CapRatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "Real Estate", href: "/calculators/real-estate" },
          { label: "Cap Rate", href: "/calculators/real-estate/cap-rate", current: true },
        ]}
      />

      <h1 className="text-3xl font-bold mb-6">Cap Rate Calculator</h1>

      <div className="mb-6">
        <p className="text-muted-foreground">
          The capitalization rate (cap rate) is a key metric in real estate investment that measures the rate of return
          on a property based on its net operating income relative to its current market value.
        </p>
      </div>

      <CapRateCalculator />
    </div>
  )
}

