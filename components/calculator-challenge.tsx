"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Brain, CheckCircle, XCircle, ArrowRight, Trophy, RefreshCw, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

// These challenges would ideally be stored in a database or API
// Each challenge links to a specific calculator that can help solve it
const challenges = [
  {
    id: 1,
    title: "Investment Growth Challenge",
    description: "If you invest $5,000 with an 8% annual return, how much will you have after 10 years?",
    answer: 10795.06, // $5,000 * (1 + 0.08)^10
    tolerance: 1, // Allow $1 tolerance for rounding
    calculator: {
      name: "Investment",
      category: "finance",
      slug: "investment",
    },
    difficulty: "Medium",
    hint: "Use the compound interest formula: P(1+r)^t",
  },
  {
    id: 2,
    title: "Mortgage Payment Challenge",
    description: "What's the monthly payment on a $300,000 mortgage with a 4.5% interest rate over 30 years?",
    answer: 1520.06, // Monthly payment calculation
    tolerance: 1, // Allow $1 tolerance for rounding
    calculator: {
      name: "Mortgage",
      category: "finance",
      slug: "mortgage",
    },
    difficulty: "Hard",
    hint: "Use the mortgage payment formula: P = L[c(1+c)^n]/[(1+c)^n-1]",
  },
  {
    id: 3,
    title: "Discount Calculation Challenge",
    description: "A $80 item is on sale with a 25% discount. What's the final price?",
    answer: 60, // $80 - ($80 * 0.25)
    tolerance: 0.01, // Allow 1 cent tolerance
    calculator: {
      name: "Discount",
      category: "percentage",
      slug: "discount",
    },
    difficulty: "Easy",
    hint: "Subtract the discount amount from the original price",
  },
  {
    id: 4,
    title: "Influencer ROI Challenge",
    description: "An influencer campaign cost $2,000 and generated $8,500 in sales. What's the ROI percentage?",
    answer: 325, // (($8,500 - $2,000) / $2,000) * 100
    tolerance: 1, // Allow 1% tolerance
    calculator: {
      name: "Influencer ROI",
      category: "influencer",
      slug: "influencer-roi",
    },
    difficulty: "Medium",
    hint: "ROI = ((Revenue - Cost) / Cost) × 100%",
  },
  {
    id: 5,
    title: "Options Pricing Challenge",
    description:
      "Calculate the price of a call option with: Stock price $150, Strike price $155, Volatility 30%, Risk-free rate 2%, Time to expiration 0.5 years.",
    answer: 10.45, // Black-Scholes approximation
    tolerance: 0.5, // Allow wider tolerance due to complexity
    calculator: {
      name: "Options Pricing",
      category: "financial-markets",
      slug: "options-pricing",
    },
    difficulty: "Expert",
    hint: "Use the Black-Scholes model for European call options",
  },
  {
    id: 6,
    title: "Temperature Conversion Challenge",
    description: "Convert 68°F to Celsius.",
    answer: 20, // (68 - 32) * 5/9
    tolerance: 0.1, // Allow small rounding differences
    calculator: {
      name: "Temperature",
      category: "measurement",
      slug: "temperature",
    },
    difficulty: "Easy",
    hint: "Use the formula: (°F - 32) × 5/9 = °C",
  },
  {
    id: 7,
    title: "Crypto Profit Challenge",
    description: "You bought 2.5 BTC at $8,000 and sold at $42,000. What's your total profit?",
    answer: 85000, // 2.5 * (42000 - 8000)
    tolerance: 1, // Allow $1 tolerance
    calculator: {
      name: "Crypto Converter",
      category: "crypto",
      slug: "crypto-converter",
    },
    difficulty: "Easy",
    hint: "Profit = Amount × (Selling Price - Purchase Price)",
  },
]

export function CalculatorChallenge() {
  const { toast } = useToast()
  const [currentChallenge, setCurrentChallenge] = useState(() => {
    // Get today's date to select a challenge
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
    return challenges[dayOfYear % challenges.length]
  })

  const [userAnswer, setUserAnswer] = useState("")
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [streak, setStreak] = useState(() => {
    // Get streak from localStorage if available
    if (typeof window !== "undefined") {
      const savedStreak = localStorage.getItem("calculatorChallengeStreak")
      return savedStreak ? Number.parseInt(savedStreak, 10) : 0
    }
    return 0
  })
  const [lastCompletedDay, setLastCompletedDay] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lastCompletedChallengeDay") || ""
    }
    return ""
  })

  // Check if this is a new day and update the challenge
  useEffect(() => {
    const today = new Date().toDateString()
    if (lastCompletedDay && lastCompletedDay !== today) {
      // It's a new day, reset the challenge state
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
      setCurrentChallenge(challenges[dayOfYear % challenges.length])
      setUserAnswer("")
      setResult(null)
      setShowHint(false)
      setAttempts(0)
    }
  }, [lastCompletedDay])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const numericAnswer = Number.parseFloat(userAnswer)

    if (isNaN(numericAnswer)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    const isCorrect = Math.abs(numericAnswer - currentChallenge.answer) <= currentChallenge.tolerance

    setResult(isCorrect ? "correct" : "incorrect")
    setAttempts(attempts + 1)

    if (isCorrect) {
      // Update streak if correct
      const today = new Date().toDateString()
      if (lastCompletedDay !== today) {
        const newStreak = streak + 1
        setStreak(newStreak)
        setLastCompletedDay(today)

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("calculatorChallengeStreak", newStreak.toString())
          localStorage.setItem("lastCompletedChallengeDay", today)
        }

        toast({
          title: `Streak: ${newStreak} day${newStreak !== 1 ? "s" : ""}! 🔥`,
          description: "Great job solving today's challenge!",
          variant: "default",
        })
      } else {
        toast({
          title: "Correct!",
          description: "Great job solving the challenge!",
          variant: "default",
        })
      }
    } else if (attempts >= 1) {
      setShowHint(true)
    }
  }

  const handleNewChallenge = () => {
    // Get a random challenge different from the current one
    let newChallenge
    do {
      newChallenge = challenges[Math.floor(Math.random() * challenges.length)]
    } while (newChallenge.id === currentChallenge.id && challenges.length > 1)

    setCurrentChallenge(newChallenge)
    setUserAnswer("")
    setResult(null)
    setShowHint(false)
    setAttempts(0)
  }

  const handleShowHint = () => {
    setShowHint(true)
  }

  return (
    <Card className="w-full shadow-md border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>Daily Calculator Challenge</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                currentChallenge.difficulty === "Easy"
                  ? "bg-green-50 text-green-700 border-green-100"
                  : currentChallenge.difficulty === "Medium"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                    : currentChallenge.difficulty === "Hard"
                      ? "bg-orange-50 text-orange-700 border-orange-100"
                      : "bg-red-50 text-red-700 border-red-100"
              }
            >
              {currentChallenge.difficulty}
            </Badge>
            {streak > 0 && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                <span>🔥</span> {streak} day{streak !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>Test your skills with today's calculation challenge</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-md">
            <h3 className="font-medium text-lg mb-2">{currentChallenge.title}</h3>
            <p>{currentChallenge.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="answer" className="block text-sm font-medium mb-1">
                Your Answer
              </label>
              <div className="flex gap-2">
                <Input
                  id="answer"
                  type="text"
                  placeholder="Enter your answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className={
                    result === "correct"
                      ? "border-green-500 focus-visible:ring-green-500"
                      : result === "incorrect"
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                  }
                />
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>

          {result && (
            <div
              className={`p-3 rounded-md ${
                result === "correct" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {result === "correct" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <p className="font-medium">
                  {result === "correct" ? "Correct! You've solved the challenge." : "Not quite right. Try again!"}
                </p>
              </div>
              {result === "correct" && <p className="text-sm mt-1">The answer is {currentChallenge.answer}.</p>}
            </div>
          )}

          {showHint && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded-md">
              <p className="font-medium">Hint:</p>
              <p>{currentChallenge.hint}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleNewChallenge} className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                New Challenge
              </Button>

              {!showHint && result !== "correct" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowHint}
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <HelpCircle className="h-4 w-4" />
                  Show Hint
                </Button>
              )}
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Solve with our calculator</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">Need help solving this?</p>
        <Link href={`/calculators/${currentChallenge.calculator.category}/${currentChallenge.calculator.slug}`}>
          <Button variant="default" size="sm" className="gap-1">
            Use {currentChallenge.calculator.name} Calculator
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

