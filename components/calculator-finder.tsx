"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, Calculator, X } from "lucide-react"
import Link from "next/link"
import { categories } from "@/lib/calculator-data"

// Flatten calculator data for search
const allCalculators = categories.flatMap((category) =>
  category.calculators.map((calculator) => ({
    name: calculator.name,
    slug: calculator.slug,
    category: {
      name: category.title,
      slug: category.slug,
    },
    description: calculator.description || "",
  })),
)

// Popular searches
const popularSearches = [
  { term: "mortgage payments", category: "finance", calculator: "mortgage" },
  { term: "percentage discount", category: "percentage", calculator: "discount" },
  { term: "temperature convert", category: "measurement", calculator: "temperature" },
  { term: "crypto price", category: "crypto", calculator: "crypto-converter" },
]

export function CalculatorFinder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  // Filter calculators based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return allCalculators
      .filter(
        (calc) =>
          calc.name.toLowerCase().includes(query) ||
          calc.description.toLowerCase().includes(query) ||
          calc.category.name.toLowerCase().includes(query),
      )
      .slice(0, 6) // Limit to 6 results
  }, [searchQuery])

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <Card className="w-full shadow-md border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Find Your Calculator
        </CardTitle>
        <CardDescription>Discover the perfect calculator for your needs</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="What do you need to calculate?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="pr-10 border-primary/20 focus:border-primary/30 focus:ring-primary/20"
            />
            {searchQuery ? (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}

            {/* Search Results Dropdown */}
            {searchQuery && searchResults.length > 0 && isFocused && (
              <div className="absolute z-10 mt-1 w-full bg-background border border-primary/20 rounded-md shadow-lg">
                <ul className="py-1">
                  {searchResults.map((calc, index) => (
                    <li key={index}>
                      <Link
                        href={`/calculators/${calc.category.slug}/${calc.slug}`}
                        className="block px-4 py-2 hover:bg-primary/5 text-sm"
                      >
                        <div className="font-medium">{calc.name} Calculator</div>
                        <div className="text-xs text-muted-foreground">Category: {calc.category.name}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No Results Message */}
            {searchQuery && searchResults.length === 0 && isFocused && (
              <div className="absolute z-10 mt-1 w-full bg-background border border-primary/20 rounded-md shadow-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">No calculators found for "{searchQuery}"</p>
                <Link href="/request-calculator">
                  <Button variant="link" size="sm" className="mt-1 text-primary">
                    Request this calculator
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {!searchQuery && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Link key={index} href={`/calculators/${search.category}/${search.calculator}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">
                      {search.term}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Calculator className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Need a specific calculator?</h3>
                <p className="text-sm text-muted-foreground">
                  We're constantly adding new calculators. Let us know what you need!
                </p>
              </div>
            </div>
            <Link href="/request-calculator">
              <Button
                variant="outline"
                className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary"
              >
                Request a Calculator
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

