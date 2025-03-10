"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Award, ChevronRight, BookOpen, Check } from "lucide-react"
import { getDailyFormula } from "@/lib/math-formulas-data"
import { useToast } from "@/components/ui/use-toast"

export function MathFormulaWidget() {
  const [formula, setFormula] = useState<ReturnType<typeof getDailyFormula> | null>(null)
  const [streak, setStreak] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load data and check local storage
    const loadData = () => {
      const dailyFormula = getDailyFormula()
      setFormula(dailyFormula)

      // Check if the user has already completed today's formula
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

      // Check if streak needs to be reset (missed a day)
      const lastStreakDate = localStorage.getItem("lastStreakDate")
      if (lastStreakDate) {
        const lastDate = new Date(lastStreakDate).toDateString()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toDateString()

        // If last streak date is not yesterday or today, reset streak
        if (lastDate !== yesterdayString && lastDate !== today) {
          setStreak(0)
          localStorage.setItem("formulaStreak", "0")
        }
      }

      setLoading(false)
    }

    loadData()
  }, [])

  const handleLearnNow = () => {
    if (!completed) {
      // Mark as completed
      const today = new Date().toDateString()
      localStorage.setItem("lastCompletedFormulaDay", today)
      localStorage.setItem("lastStreakDate", today)

      // Update streak
      const newStreak = streak + 1
      setStreak(newStreak)
      localStorage.setItem("formulaStreak", newStreak.toString())

      setCompleted(true)

      // Show toast
      toast({
        title: "Formula Mastered!",
        description: `You've earned ${formula?.points || 10} points. Your streak is now ${newStreak} days!`,
        duration: 3000,
      })
    }
  }

  if (loading) {
    return (
      <Card className="w-full overflow-hidden border-primary/20">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
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
            <h2 className="text-2xl font-bold">Math Formula of the Day</h2>
            <p className="text-muted-foreground">Master essential formulas one day at a time</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Badge className="capitalize">{formula.category}</Badge>
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

        <Link href={`/math-formulas/${formula.id}`} onClick={handleLearnNow}>
          <Button className="gap-1">
            {completed ? (
              <>
                <Check className="h-4 w-4" />
                Completed
              </>
            ) : (
              <>
                Learn Now
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

