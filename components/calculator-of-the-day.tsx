"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { categories } from "@/lib/calculator-data"

export function CalculatorOfTheDay() {
  const [calculator, setCalculator] = useState<{
    name: string
    description: string
    category: string
    categorySlug: string
    slug: string
    icon: React.ReactNode
  } | null>(null)

  useEffect(() => {
    // Get a pseudo-random calculator based on the date
    const getCalculatorOfTheDay = () => {
      const today = new Date()
      const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

      // Create a simple hash from the date string
      let hash = 0
      for (let i = 0; i < dateString.length; i++) {
        hash = (hash << 5) - hash + dateString.charCodeAt(i)
        hash = hash & hash // Convert to 32bit integer
      }

      // Get a positive number
      hash = Math.abs(hash)

      // Flatten all calculators into a single array
      const allCalculators = categories.flatMap((category) =>
        category.calculators.map((calc) => ({
          name: calc.name,
          description: calc.description,
          category: category.title,
          categorySlug: category.slug,
          slug: calc.slug,
          icon: category.icon,
        })),
      )

      // Use the hash to select a calculator
      const selectedCalculator = allCalculators[hash % allCalculators.length]
      return selectedCalculator
    }

    setCalculator(getCalculatorOfTheDay())
  }, [])

  if (!calculator) return null

  return (
    <Card className="w-full shadow-md border-purple-200 overflow-hidden relative">
      {/* Badge at the top of the card */}
      <div className="absolute top-0 right-0 z-10">
        <Badge
          variant="outline"
          className="m-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-300"
        >
          <Star className="h-3 w-3 mr-1 fill-yellow-300 text-yellow-300" />
          Calculator of the Day
        </Badge>
      </div>

      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pt-14">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full shadow-sm">{calculator.icon}</div>
          <div>
            <CardTitle>{calculator.name} Calculator</CardTitle>
            <CardDescription>From our {calculator.category} collection</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p>{calculator.description}</p>

        <div className="mt-4 p-3 bg-muted rounded-md">
          <h4 className="font-medium mb-2">Why you might need this:</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Quick and accurate {calculator.name.toLowerCase()} calculations</li>
            <li>User-friendly interface with clear results</li>
            <li>Save time with our optimized formula</li>
            <li>Free to use with no limitations</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">Try it now!</p>
        <Link href={`/calculators/${calculator.categorySlug}/${calculator.slug}`}>
          <Button className="gap-2">
            Open Calculator <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

