"use client"

import { useEffect, useState } from "react"
import DividendYieldCalculator from "@/components/calculators/financial-markets/dividend-yield"

export default function DividendYieldWrapper() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <DividendYieldCalculator />
}

