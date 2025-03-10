"use client"

import dynamic from "next/dynamic"

// Use dynamic import with no SSR to ensure client-side only rendering
const StockReturnCalculator = dynamic(() => import("@/components/calculators/financial-markets/stock-return"), {
  ssr: false,
})

export default function StockReturnWrapper() {
  return <StockReturnCalculator />
}

