"use client"

import { Suspense } from "react"
import PortfolioAllocationCalculator from "./portfolio-allocation"

// Create a loading component
function LoadingCalculator() {
  return (
    <div className="flex items-center justify-center h-[400px] w-full bg-muted/20 rounded-md">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading calculator...</p>
      </div>
    </div>
  )
}

export default function PortfolioAllocationWrapper() {
  return (
    <Suspense fallback={<LoadingCalculator />}>
      <PortfolioAllocationCalculator />
    </Suspense>
  )
}

