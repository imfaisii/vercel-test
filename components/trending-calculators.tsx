"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ArrowRight, Search } from "lucide-react"
import Link from "next/link"

// This would ideally be fetched from analytics or a backend
const defaultTrendingCalculators = [
  {
    name: "Options Pricing",
    category: "Financial Markets",
    categorySlug: "financial-markets",
    calculatorSlug: "options-pricing",
    trend: "+28%",
  },
  {
    name: "Crypto Converter",
    category: "Cryptocurrency",
    categorySlug: "crypto",
    calculatorSlug: "crypto-converter",
    trend: "+15%",
  },
  {
    name: "Influencer ROI",
    category: "Influencer Marketing",
    categorySlug: "influencer",
    calculatorSlug: "influencer-roi",
    trend: "+12%",
  },
  {
    name: "Mortgage",
    category: "Finance",
    categorySlug: "finance",
    calculatorSlug: "mortgage",
    trend: "+8%",
  },
]

export function TrendingCalculators() {
  const [trendingCalculators, setTrendingCalculators] = useState(defaultTrendingCalculators)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate fetching trending data
  useEffect(() => {
    const fetchTrendingData = async () => {
      // In a real implementation, this would be an API call
      // For now, we'll just simulate a delay and use the default data
      await new Promise((resolve) => setTimeout(resolve, 500))
      setTrendingCalculators(defaultTrendingCalculators)
      setIsLoading(false)
    }

    fetchTrendingData()
  }, [])

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Calculators
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md bg-muted/50 animate-pulse h-16"
              >
                <div className="w-3/4 h-8 bg-muted rounded"></div>
                <div className="w-1/5 h-6 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trendingCalculators.map((calc, index) => (
              <Link key={index} href={`/calculators/${calc.categorySlug}/${calc.calculatorSlug}`} className="block">
                <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{calc.name} Calculator</p>
                      <p className="text-xs text-muted-foreground">{calc.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {calc.trend}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Link
            href="/calculators"
            className="flex items-center justify-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Search className="h-4 w-4 mr-1" />
            Explore all calculators
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

