"use client"

import dynamic from "next/dynamic"

// Use dynamic import with no SSR to ensure client-side only rendering
const OptionsPricingCalculator = dynamic(() => import("@/components/calculators/financial-markets/options-pricing"), {
  ssr: false,
})

export default function OptionsPricingWrapper() {
  return <OptionsPricingCalculator />
}

