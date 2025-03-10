"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, ArrowRight } from "lucide-react"
import Link from "next/link"
import { categories } from "@/lib/calculator-data"

type RecentCalculator = {
  name: string
  category: string
  categorySlug: string
  calculatorSlug: string
  timestamp: number
}

export function RecentlyViewedCalculators() {
  const [recentCalculators, setRecentCalculators] = useState<RecentCalculator[]>([])

  useEffect(() => {
    // Load recent calculators from localStorage
    const loadRecentCalculators = () => {
      try {
        const stored = localStorage.getItem("recentCalculators")
        if (stored) {
          const parsed = JSON.parse(stored) as RecentCalculator[]
          setRecentCalculators(parsed)
        }
      } catch (error) {
        console.error("Failed to load recent calculators:", error)
      }
    }

    loadRecentCalculators()

    // Set up a listener for page navigation to track calculator views
    const trackCalculatorView = () => {
      const path = window.location.pathname
      const match = path.match(/\/calculators\/([^/]+)\/([^/]+)/)

      if (match) {
        const categorySlug = match[1]
        const calculatorSlug = match[2]

        // Find the category and calculator
        const category = categories.find((c) => c.slug === categorySlug)
        if (category) {
          const calculator = category.calculators.find((c) => c.slug === calculatorSlug)
          if (calculator) {
            // Create a new entry
            const newEntry: RecentCalculator = {
              name: calculator.name,
              category: category.title,
              categorySlug,
              calculatorSlug,
              timestamp: Date.now(),
            }

            // Update the list (max 5 items, no duplicates)
            setRecentCalculators((prev) => {
              // Remove any existing entry for this calculator
              const filtered = prev.filter(
                (c) => !(c.categorySlug === categorySlug && c.calculatorSlug === calculatorSlug),
              )

              // Add the new entry at the beginning
              const updated = [newEntry, ...filtered].slice(0, 5)

              // Save to localStorage
              localStorage.setItem("recentCalculators", JSON.stringify(updated))

              return updated
            })
          }
        }
      }
    }

    // Track initial page load
    trackCalculatorView()

    // Set up listener for future navigation
    window.addEventListener("popstate", trackCalculatorView)

    return () => {
      window.removeEventListener("popstate", trackCalculatorView)
    }
  }, [])

  if (recentCalculators.length === 0) return null

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-primary" />
          Recently Viewed Calculators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentCalculators.map((calc, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
              <div>
                <p className="font-medium">{calc.name} Calculator</p>
                <p className="text-xs text-muted-foreground">{calc.category}</p>
              </div>
              <Link href={`/calculators/${calc.categorySlug}/${calc.calculatorSlug}`}>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

