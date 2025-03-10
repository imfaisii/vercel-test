"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getDailyFormula, type MathFormula } from "@/lib/math-formulas-data"
import { Sparkles, BookOpen, Award, ChevronRight, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function FormulaOfTheDay() {
  const [formula, setFormula] = useState<MathFormula | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [streak, setStreak] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Load the daily formula
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
  }, [])

  const markAsLearned = () => {
    if (!formula) return

    // Save completion status
    const today = new Date().toDateString()
    localStorage.setItem("lastCompletedFormulaDay", today)
    setCompleted(true)

    // Update streak
    const newStreak = streak + 1
    setStreak(newStreak)
    localStorage.setItem("formulaStreak", newStreak.toString())

    // Show toast
    toast({
      title: "Formula Mastered!",
      description: `You've earned ${formula.points} points. Keep your streak going!`,
      duration: 3000,
    })
  }

  if (!formula) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse">Loading today's formula...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Formula of the Day
            </CardTitle>
            <CardDescription>Master a new formula every day</CardDescription>
          </div>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Award className="h-3 w-3" />
            {streak} day streak
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge>{formula.category}</Badge>
            <Badge
              variant={
                formula.difficulty === "easy"
                  ? "outline"
                  : formula.difficulty === "medium"
                    ? "secondary"
                    : "destructive"
              }
            >
              {formula.difficulty}
            </Badge>
          </div>

          <h3 className="text-xl font-bold">{formula.title}</h3>

          <div className="bg-muted p-4 rounded-md flex justify-center items-center">
            <div className="text-2xl font-mono">{formula.formula}</div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Description:</h4>
            <p>{formula.description}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Variables:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {formula.variables.map((variable, index) => (
                <li key={index}>
                  <span className="font-mono font-bold">{variable.symbol}</span>: {variable.description}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Example Problem:</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowSolution(!showSolution)}>
                {showSolution ? "Hide Solution" : "Show Solution"}
              </Button>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p>{formula.example.problem}</p>

              {showSolution && (
                <div className="mt-3 border-t pt-3">
                  <p className="font-medium">Solution: {formula.example.solution}</p>
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Steps:</p>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      {formula.example.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Worth {formula.points} points</span>
        </div>

        {completed ? (
          <Button disabled variant="outline" className="gap-2">
            <Check className="h-4 w-4" />
            Completed
          </Button>
        ) : (
          <Button onClick={markAsLearned} className="gap-2">
            Mark as Learned
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

