"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { HelpCircle, ArrowRight, RotateCcw, CheckCircle } from "lucide-react"
import Link from "next/link"

type Question = {
  id: number
  text: string
  options: {
    id: string
    text: string
    category: string
    points: Record<string, number>
  }[]
}

type Result = {
  category: string
  calculatorSlug: string
  calculatorName: string
  description: string
}

const questions: Question[] = [
  {
    id: 1,
    text: "What are you trying to calculate today?",
    options: [
      {
        id: "1a",
        text: "Something related to money or finances",
        category: "finance",
        points: { finance: 2, business: 1, "financial-markets": 1 },
      },
      {
        id: "1b",
        text: "A mathematical problem or equation",
        category: "math",
        points: { math: 2 },
      },
      {
        id: "1c",
        text: "Something for my business or work",
        category: "business",
        points: { business: 2, finance: 1 },
      },
      {
        id: "1d",
        text: "Something related to social media",
        category: "social-media",
        points: { "social-media": 2, influencer: 1 },
      },
    ],
  },
  {
    id: 2,
    text: "How complex is your calculation need?",
    options: [
      {
        id: "2a",
        text: "Very simple, just basic arithmetic",
        category: "basic",
        points: { math: 1 },
      },
      {
        id: "2b",
        text: "Moderately complex with a few variables",
        category: "moderate",
        points: { finance: 1, business: 1 },
      },
      {
        id: "2c",
        text: "Complex with multiple variables",
        category: "complex",
        points: { "financial-markets": 2, math: 1 },
      },
      {
        id: "2d",
        text: "I need to analyze data or trends",
        category: "analysis",
        points: { "social-media": 1, influencer: 1, "financial-markets": 1 },
      },
    ],
  },
  {
    id: 3,
    text: "What's your primary goal with this calculation?",
    options: [
      {
        id: "3a",
        text: "Planning my personal finances",
        category: "personal",
        points: { finance: 2 },
      },
      {
        id: "3b",
        text: "Making a business decision",
        category: "decision",
        points: { business: 2, "financial-markets": 1 },
      },
      {
        id: "3c",
        text: "Learning or educational purposes",
        category: "education",
        points: { math: 1, physics: 1 },
      },
      {
        id: "3d",
        text: "Measuring performance or results",
        category: "performance",
        points: { "social-media": 1, influencer: 2, business: 1 },
      },
    ],
  },
]

const results: Record<string, Result[]> = {
  finance: [
    {
      category: "finance",
      calculatorSlug: "loan",
      calculatorName: "Loan Calculator",
      description: "Calculate monthly payments, interest costs, and amortization schedules for any loan.",
    },
    {
      category: "finance",
      calculatorSlug: "mortgage",
      calculatorName: "Mortgage Calculator",
      description: "Plan your home purchase with accurate mortgage payment calculations.",
    },
  ],
  math: [
    {
      category: "math",
      calculatorSlug: "basic",
      calculatorName: "Basic Calculator",
      description: "Perform simple arithmetic operations with this easy-to-use calculator.",
    },
    {
      category: "math",
      calculatorSlug: "scientific",
      calculatorName: "Scientific Calculator",
      description: "Tackle complex mathematical problems with advanced functions.",
    },
  ],
  business: [
    {
      category: "business",
      calculatorSlug: "roi",
      calculatorName: "ROI Calculator",
      description: "Measure the return on your business investments.",
    },
    {
      category: "business",
      calculatorSlug: "break-even",
      calculatorName: "Break-Even Calculator",
      description: "Find out when your business will become profitable.",
    },
  ],
  "social-media": [
    {
      category: "social-media",
      calculatorSlug: "engagement-rate",
      calculatorName: "Engagement Rate Calculator",
      description: "Measure how well your content performs across social platforms.",
    },
  ],
  influencer: [
    {
      category: "influencer",
      calculatorSlug: "influencer-roi",
      calculatorName: "Influencer ROI Calculator",
      description: "Calculate the return on your influencer marketing campaigns.",
    },
    {
      category: "influencer",
      calculatorSlug: "audience-overlap",
      calculatorName: "Audience Overlap Calculator",
      description: "Analyze the shared audience between different influencers.",
    },
  ],
  "financial-markets": [
    {
      category: "financial-markets",
      calculatorSlug: "stock-return",
      calculatorName: "Stock Return Calculator",
      description: "Calculate potential returns on stock investments.",
    },
    {
      category: "financial-markets",
      calculatorSlug: "options-pricing",
      calculatorName: "Options Pricing Calculator",
      description: "Price options contracts using advanced financial models.",
    },
  ],
}

export function CalculatorRecommendationQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [recommendedCalculator, setRecommendedCalculator] = useState<Result | null>(null)

  const handleNext = () => {
    if (selectedOption) {
      // Save the answer
      setAnswers({ ...answers, [currentQuestion]: selectedOption })

      // Move to next question or finish
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        // Calculate result
        const points: Record<string, number> = {}

        // Tally points from all answers
        Object.entries(answers).forEach(([questionIndex, optionId]) => {
          const question = questions[Number.parseInt(questionIndex)]
          const option = question.options.find((opt) => opt.id === optionId)

          if (option) {
            Object.entries(option.points).forEach(([category, value]) => {
              points[category] = (points[category] || 0) + value
            })
          }
        })

        // Add points from the final answer
        const finalQuestion = questions[currentQuestion]
        const finalOption = finalQuestion.options.find((opt) => opt.id === selectedOption)

        if (finalOption) {
          Object.entries(finalOption.points).forEach(([category, value]) => {
            points[category] = (points[category] || 0) + value
          })
        }

        // Find category with highest points
        let maxPoints = 0
        let topCategory = ""

        Object.entries(points).forEach(([category, value]) => {
          if (value > maxPoints) {
            maxPoints = value
            topCategory = category
          }
        })

        // Get a result from the top category
        if (results[topCategory] && results[topCategory].length > 0) {
          const randomIndex = Math.floor(Math.random() * results[topCategory].length)
          setRecommendedCalculator(results[topCategory][randomIndex])
        } else {
          // Fallback
          setRecommendedCalculator(results.math[0])
        }
      }
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setSelectedOption(null)
    setRecommendedCalculator(null)
  }

  return (
    <Card className="w-full shadow-md border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Find Your Perfect Calculator
        </CardTitle>
        <CardDescription>Answer a few questions to get a personalized recommendation</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {!recommendedCalculator ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </div>

            <h3 className="text-lg font-medium mb-4">{questions[currentQuestion].text}</h3>

            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <Button onClick={handleNext} disabled={!selectedOption} className="w-full mt-4">
              {currentQuestion < questions.length - 1 ? "Next Question" : "Get Recommendation"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">We found your perfect calculator!</h3>
                <p className="text-sm">Based on your needs, we recommend:</p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-medium text-lg mb-1">{recommendedCalculator.calculatorName}</h3>
              <p className="text-sm text-muted-foreground mb-4">{recommendedCalculator.description}</p>

              <Link href={`/calculators/${recommendedCalculator.category}/${recommendedCalculator.calculatorSlug}`}>
                <Button className="w-full">
                  Try This Calculator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Button variant="outline" onClick={handleReset} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

