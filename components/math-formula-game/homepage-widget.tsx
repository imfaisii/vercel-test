"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Award, ChevronRight, BookOpen } from "lucide-react"

// This would come from your actual data source
type MathFormula = {
  id: string
  title: string
  formula: string
  description: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  points: number
}

// Mock function to get the daily formula
function getDailyFormula(): MathFormula {
  // In a real implementation, this would select a formula based on the current date
  return {
    id: "pythagorean-theorem",
    title: "Pythagorean Theorem",
    formula: "a² + b² = c²",
    description:
      "In a right triangle, the square of the length of the hypotenuse equals the sum of squares of the other two sides.",
    category: "Geometry",
    difficulty: "easy",
    points: 10,
  }
}

export function MathFormulaWidget() {
  const [formula, setFormula] = useState<MathFormula | null>(null)
  const [streak, setStreak] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setFormula(getDailyFormula())

      // Check if the user has already completed today's challenge
      const today = new Date().toDateString()
      const lastCompleted = localStorage.getItem("lastCompletedFormulaDay")
      if (lastCompleted === today) {
        setCompleted(true)
      }

      // Load streak from localStorage
      const savedStreak = localStorage.getItem("formulaStreak")
      if (savedStreak) {
        setStreak(Number.parseInt(savedStreak, 10))
      }

      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Card className="w-full overflow-hidden border-primary/20">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              {/* Exactly match the Daily Calculator Challenge heading style */}
              <h2 className="text-2xl font-bold">Math Formula of the Day</h2>
              <p className="text-muted-foreground">Master essential formulas one day at a time</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-center items-center h-24">
            <div className="animate-pulse">Loading today's formula...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!formula) return null

  return (
    <Card className="w-full overflow-hidden border-primary/20">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            {/* Exactly match the Daily Calculator Challenge heading style */}
            <h2 className="text-2xl font-bold">Math Formula of the Day</h2>
            <p className="text-muted-foreground">Master essential formulas one day at a time</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Badge>{formula.category}</Badge>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Award className="h-3 w-3" />
            {streak} day streak
          </Badge>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">{formula.title}</h3>

          <div className="bg-muted p-4 rounded-md flex justify-center items-center">
            <div className="text-2xl font-mono">{formula.formula}</div>
          </div>

          <div className="text-sm">{formula.description}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Worth {formula.points} points</span>
        </div>

        <Link href="/calculators/math/formulas">
          <Button className="gap-1">
            Learn Now
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

