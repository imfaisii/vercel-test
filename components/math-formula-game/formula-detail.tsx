"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Award,
  BookmarkPlus,
  BookmarkCheck,
  Share2,
  Check,
  Brain,
  Lightbulb,
  Zap,
  Trophy,
  RefreshCw,
  ThumbsUp,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import type { MathFormula } from "@/lib/math-formulas-data"

interface FormulaDetailProps {
  formula: MathFormula
}

export default function FormulaDetail({ formula }: FormulaDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isMastered, setIsMastered] = useState(false)
  const [practiceProgress, setPracticeProgress] = useState(0)
  const [practiceScore, setPracticeScore] = useState(0)
  const [currentPracticeQuestion, setCurrentPracticeQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [relatedFormulas, setRelatedFormulas] = useState<MathFormula[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [visualizationScale, setVisualizationScale] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Generate practice questions based on the formula
  const practiceQuestions = useRef([
    {
      question: `Calculate using ${formula.title}: ${generatePracticeQuestion(formula, 1)}`,
      answer: "42", // This would be dynamically calculated based on the formula
      hint: "Try substituting the values into the formula directly.",
    },
    {
      question: `Solve this ${formula.title} problem: ${generatePracticeQuestion(formula, 2)}`,
      answer: "15", // This would be dynamically calculated
      hint: "Remember to follow the order of operations.",
    },
    {
      question: `Apply ${formula.title} to solve: ${generatePracticeQuestion(formula, 3)}`,
      answer: "27", // This would be dynamically calculated
      hint: "Break down the problem into smaller steps.",
    },
  ]).current

  useEffect(() => {
    // Check if formula is bookmarked
    const bookmarkedFormulas = JSON.parse(localStorage.getItem("bookmarkedFormulas") || "[]")
    setIsBookmarked(bookmarkedFormulas.includes(formula.id))

    // Check if formula is mastered
    const masteredFormulas = JSON.parse(localStorage.getItem("masteredFormulas") || "[]")
    setIsMastered(masteredFormulas.includes(formula.id))

    // Get practice progress
    const progress = Number.parseInt(localStorage.getItem(`formula-progress-${formula.id}`) || "0")
    setPracticeProgress(progress)

    // Get practice score
    const score = Number.parseInt(localStorage.getItem(`formula-score-${formula.id}`) || "0")
    setPracticeScore(score)

    // Find related formulas (same category)
    const allFormulas = JSON.parse(localStorage.getItem("allFormulas") || "[]")
    const related = allFormulas
      .filter((f: MathFormula) => f.category === formula.category && f.id !== formula.id)
      .slice(0, 3)
    setRelatedFormulas(related)

    // Store all formulas in localStorage if not already there
    if (!localStorage.getItem("allFormulas")) {
      import("@/lib/math-formulas-data").then(({ formulas }) => {
        localStorage.setItem("allFormulas", JSON.stringify(formulas))
      })
    }
  }, [formula.id, formula.category])

  // Separate useEffect for visualization to ensure it runs when the tab changes
  useEffect(() => {
    if (activeTab === "visualization") {
      setTimeout(() => {
        drawVisualization()
      }, 100)
    }
  }, [activeTab])

  // Draw a simple visualization based on the formula category
  const drawVisualization = () => {
    if (!canvasRef.current) {
      console.log("Canvas ref is not available")
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.log("Could not get canvas context")
      return
    }

    console.log("Drawing visualization for", formula.category, formula.id)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Different visualizations based on formula category
    if (formula.category === "geometry") {
      if (formula.id.includes("rectangle")) {
        drawRectangle(ctx, canvas.width, canvas.height)
      } else if (formula.id.includes("circle")) {
        drawCircle(ctx, canvas.width, canvas.height)
      } else if (formula.id.includes("triangle")) {
        drawTriangle(ctx, canvas.width, canvas.height)
      } else if (formula.id.includes("square")) {
        drawSquare(ctx, canvas.width, canvas.height)
      } else {
        drawGenericShape(ctx, canvas.width, canvas.height)
      }
    } else if (formula.category === "algebra") {
      drawGraph(ctx, canvas.width, canvas.height)
    } else if (formula.category === "trigonometry") {
      drawTrigonometry(ctx, canvas.width, canvas.height)
    } else if (formula.category === "calculus") {
      drawCalculus(ctx, canvas.width, canvas.height)
    } else if (formula.category === "statistics") {
      drawStatistics(ctx, canvas.width, canvas.height)
    } else {
      drawGenericVisualization(ctx, canvas.width, canvas.height)
    }
  }

  // Drawing helper functions
  const drawRectangle = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scale = visualizationScale
    const rectWidth = width * 0.6 * scale
    const rectHeight = height * 0.6 * scale
    const x = (width - rectWidth) / 2
    const y = (height - rectHeight) / 2

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, rectWidth, rectHeight)

    // Add labels
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px sans-serif"
    ctx.fillText("w", width / 2, y + rectHeight + 20)
    ctx.fillText("l", x + rectWidth + 10, height / 2)
  }

  const drawCircle = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scale = visualizationScale
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.3 * scale

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw radius line
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + radius, centerY)
    ctx.stroke()

    // Add label
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px sans-serif"
    ctx.fillText("r", centerX + radius / 2, centerY - 10)
  }

  const drawTriangle = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scale = visualizationScale
    const centerX = width / 2
    const centerY = height / 2
    const size = Math.min(width, height) * 0.4 * scale

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - size)
    ctx.lineTo(centerX - size, centerY + size)
    ctx.lineTo(centerX + size, centerY + size)
    ctx.closePath()
    ctx.stroke()

    // Add height line
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - size)
    ctx.lineTo(centerX, centerY + size)
    ctx.stroke()
    ctx.setLineDash([])

    // Add labels
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px sans-serif"
    ctx.fillText("h", centerX + 10, centerY)
    ctx.fillText("b", centerX, centerY + size + 15)
  }

  const drawGraph = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scale = visualizationScale
    const centerX = width / 2
    const centerY = height / 2
    const size = Math.min(width, height) * 0.4 * scale

    // Draw axes
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(centerX - size, centerY)
    ctx.lineTo(centerX + size, centerY)
    ctx.moveTo(centerX, centerY - size)
    ctx.lineTo(centerX, centerY + size)
    ctx.stroke()

    // Draw function curve (parabola for quadratic)
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = -size; x <= size; x += 5) {
      const y = (x * x) / (size * 2) // Simple parabola
      ctx.lineTo(centerX + x, centerY - y * scale)
    }
    ctx.stroke()

    // Add labels
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px sans-serif"
    ctx.fillText("x", centerX + size - 15, centerY + 20)
    ctx.fillText("y", centerX - 20, centerY - size + 15)
  }

  const drawGenericShape = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scale = visualizationScale
    const centerX = width / 2
    const centerY = height / 2
    const size = Math.min(width, height) * 0.3 * scale

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - size, centerY - size)
    ctx.lineTo(centerX + size, centerY - size)
    ctx.lineTo(centerX + size, centerY + size)
    ctx.lineTo(centerX - size, centerY + size)
    ctx.closePath()
    ctx.stroke()
  }

  const drawGenericVisualization = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2

    // Draw a light background
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, width, height)

    // Draw a border
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, width - 20, height - 20)

    // Draw formula category icon
    ctx.fillStyle = "#cbd5e1"
    ctx.beginPath()
    ctx.arc(centerX, centerY - 40, 30, 0, 2 * Math.PI)
    ctx.fill()

    // Draw formula text
    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(formula.title, centerX, centerY + 20)

    ctx.font = "14px sans-serif"
    ctx.fillText(formula.formula, centerX, centerY + 50)

    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748b"
    ctx.fillText("Interactive visualization coming soon", centerX, centerY + 80)
    ctx.fillText(`Category: ${formula.category}`, centerX, centerY + 100)
  }

  // Generate a practice question based on the formula
  function generatePracticeQuestion(formula: MathFormula, questionNumber: number): string {
    // This would be more sophisticated in a real implementation
    if (formula.category === "geometry") {
      if (questionNumber === 1) {
        return "If a rectangle has length 8 units and width 5 units, what is its area?"
      } else if (questionNumber === 2) {
        return "A circle has radius 3 units. What is its circumference?"
      } else {
        return "A triangle has base 9 units and height 6 units. What is its area?"
      }
    } else if (formula.category === "algebra") {
      if (questionNumber === 1) {
        return "Solve for x in the equation 3x² + 6x - 9 = 0."
      } else if (questionNumber === 2) {
        return "Find the distance between points (2,3) and (5,7)."
      } else {
        return "If a line has slope 2 and y-intercept 3, what is its equation?"
      }
    } else {
      return `Apply the ${formula.title} to solve this problem.`
    }
  }

  const handleBookmark = () => {
    const bookmarkedFormulas = JSON.parse(localStorage.getItem("bookmarkedFormulas") || "[]")

    if (isBookmarked) {
      // Remove from bookmarks
      const updatedBookmarks = bookmarkedFormulas.filter((id: string) => id !== formula.id)
      localStorage.setItem("bookmarkedFormulas", JSON.stringify(updatedBookmarks))
      setIsBookmarked(false)
      toast({
        title: "Bookmark removed",
        description: `${formula.title} has been removed from your bookmarks.`,
        duration: 3000,
      })
    } else {
      // Add to bookmarks
      bookmarkedFormulas.push(formula.id)
      localStorage.setItem("bookmarkedFormulas", JSON.stringify(bookmarkedFormulas))
      setIsBookmarked(true)
      toast({
        title: "Bookmark added",
        description: `${formula.title} has been added to your bookmarks.`,
        duration: 3000,
      })
    }
  }

  const handleMarkAsMastered = () => {
    const masteredFormulas = JSON.parse(localStorage.getItem("masteredFormulas") || "[]")

    if (!isMastered) {
      // Add to mastered formulas
      masteredFormulas.push(formula.id)
      localStorage.setItem("masteredFormulas", JSON.stringify(masteredFormulas))
      setIsMastered(true)

      // Update user points
      const currentPoints = Number.parseInt(localStorage.getItem("formulaPoints") || "0")
      const newPoints = currentPoints + formula.points
      localStorage.setItem("formulaPoints", newPoints.toString())

      // Update streak
      updateStreak()

      toast({
        title: "Formula Mastered!",
        description: `You've earned ${formula.points} points for mastering this formula.`,
        duration: 3000,
      })
    }
  }

  const updateStreak = () => {
    const today = new Date().toDateString()
    const lastStreakDate = localStorage.getItem("lastStreakDate")
    let streak = Number.parseInt(localStorage.getItem("formulaStreak") || "0")

    if (lastStreakDate !== today) {
      if (lastStreakDate) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        if (new Date(lastStreakDate).toDateString() === yesterday.toDateString()) {
          // Consecutive day
          streak += 1
        } else {
          // Streak broken
          streak = 1
        }
      } else {
        // First day
        streak = 1
      }

      localStorage.setItem("formulaStreak", streak.toString())
      localStorage.setItem("lastStreakDate", today)
    }

    return streak
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Math Formula: ${formula.title}`,
        text: `Check out this math formula: ${formula.title} - ${formula.formula}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Formula link copied to clipboard",
        duration: 3000,
      })
    }
  }

  const handleAnswerSubmit = () => {
    const currentQuestion = practiceQuestions[currentPracticeQuestion]
    const isCorrect = userAnswer.trim() === currentQuestion.answer

    setIsAnswerCorrect(isCorrect)

    if (isCorrect) {
      // Update progress
      const newProgress = Math.min(practiceProgress + 33, 100)
      setPracticeProgress(newProgress)
      localStorage.setItem(`formula-progress-${formula.id}`, newProgress.toString())

      // Update score
      const pointsEarned = 5
      const newScore = practiceScore + pointsEarned
      setPracticeScore(newScore)
      localStorage.setItem(`formula-score-${formula.id}`, newScore.toString())

      toast({
        title: "Correct!",
        description: `You've earned ${pointsEarned} points. Great job!`,
        duration: 3000,
      })

      // Move to next question or complete
      if (currentPracticeQuestion < practiceQuestions.length - 1) {
        setTimeout(() => {
          setCurrentPracticeQuestion((prev) => prev + 1)
          setUserAnswer("")
          setIsAnswerCorrect(null)
          setShowHint(false)
        }, 1500)
      } else {
        // Completed all questions
        if (newProgress === 100 && !isMastered) {
          setTimeout(() => {
            handleMarkAsMastered()
          }, 1000)
        }
      }
    } else {
      toast({
        title: "Not quite right",
        description: "Try again or check the hint for help.",
        duration: 3000,
      })
    }
  }

  const resetPractice = () => {
    setCurrentPracticeQuestion(0)
    setUserAnswer("")
    setIsAnswerCorrect(null)
    setShowHint(false)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Reset practice when switching to practice tab
    if (value === "practice") {
      resetPractice()
    }

    // Draw visualization when switching to visualization tab
    if (value === "visualization") {
      setTimeout(() => {
        drawVisualization()
      }, 100)
    }
  }

  const drawSquare = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scale = visualizationScale
    const centerX = width / 2
    const centerY = height / 2
    const size = Math.min(width, height) * 0.4 * scale

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.strokeRect(centerX - size / 2, centerY - size / 2, size, size)

    // Add labels
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px sans-serif"
    ctx.fillText("a", centerX + size / 2 + 10, centerY)
    ctx.fillText("a", centerX, centerY + size / 2 + 20)
  }

  const drawTrigonometry = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scale = visualizationScale
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.3 * scale

    // Draw unit circle
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(centerX - radius - 20, centerY)
    ctx.lineTo(centerX + radius + 20, centerY)
    ctx.moveTo(centerX, centerY - radius - 20)
    ctx.lineTo(centerX, centerY + radius + 20)
    ctx.stroke()

    // Draw angle
    const angle = Math.PI / 4 // 45 degrees
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + radius * Math.cos(0), centerY - radius * Math.sin(0))
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY - radius * Math.sin(angle))
    ctx.stroke()

    // Draw arc for angle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius / 4, 0, angle, false)
    ctx.stroke()

    // Add labels
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px sans-serif"
    ctx.fillText("θ", centerX + radius / 8, centerY - radius / 8)
    ctx.fillText("1", centerX + radius / 2, centerY + 15)
    ctx.fillText("sin(θ)", centerX + radius / 2 + 10, centerY - (radius * Math.sin(angle)) / 2)
    ctx.fillText("cos(θ)", centerX + (radius * Math.cos(angle)) / 2, centerY + 15)
  }

  const drawCalculus = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scale = visualizationScale
    const centerX = width / 2
    const centerY = height / 2
    const size = Math.min(width, height) * 0.4 * scale

    // Draw axes
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(centerX - size, centerY)
    ctx.lineTo(centerX + size, centerY)
    ctx.moveTo(centerX, centerY - size)
    ctx.lineTo(centerX, centerY + size)
    ctx.stroke()

    // Draw function curve (cubic function)
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let x = -size / 2; x <= size / 2; x += 2) {
      // f(x) = x³
      const y = Math.pow(x / 10, 3)
      ctx.lineTo(centerX + x, centerY - y * 10)
    }
    ctx.stroke()

    // Draw derivative
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let x = -size / 2; x <= size / 2; x += 2) {
      // f'(x) = 3x²
      const y = 3 * Math.pow(x / 10, 2)
      ctx.lineTo(centerX + x, centerY - y * 10)
    }
    ctx.stroke()

    // Add labels
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px sans-serif"
    ctx.fillText("f(x)", centerX + size - 30, centerY - size / 2)
    ctx.fillText("f'(x)", centerX + size - 30, centerY - size / 4)
    ctx.fillText("x", centerX + size - 10, centerY + 15)
  }

  const drawStatistics = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scale = visualizationScale
    const centerX = width / 2
    const centerY = height / 2
    const size = Math.min(width, height) * 0.4 * scale

    // Draw axes
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(centerX - size, centerY + size / 2)
    ctx.lineTo(centerX + size, centerY + size / 2)
    ctx.stroke()

    // Draw normal distribution
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let x = -size; x <= size; x += 2) {
      // Normal distribution formula
      const y = (Math.exp(-Math.pow(x / 30, 2) / 2) * size) / 2
      ctx.lineTo(centerX + x, centerY + size / 2 - y)
    }
    ctx.stroke()

    // Draw bars for histogram
    const barWidth = size / 5
    const barHeights = [size / 4, size / 2.5, size / 1.8, size / 2.5, size / 4]
    const barPositions = [
      centerX - size + barWidth / 2,
      centerX - size / 2 + barWidth / 2,
      centerX + barWidth / 2,
      centerX + size / 2 + barWidth / 2,
      centerX + size - barWidth / 2,
    ]

    ctx.fillStyle = "rgba(59, 130, 246, 0.3)"

    for (let i = 0; i < 5; i++) {
      ctx.fillRect(barPositions[i] - barWidth / 2, centerY + size / 2 - barHeights[i], barWidth, barHeights[i])
    }

    // Add labels
    ctx.fillStyle = "#1e293b"
    ctx.font = "14px sans-serif"
    ctx.fillText("μ", centerX, centerY + size / 2 + 15)
    ctx.fillText("σ", centerX + size / 4, centerY + size / 2 + 15)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/math-formulas">
          <Button variant="ghost" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Formulas
          </Button>
        </Link>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleBookmark}>
            {isBookmarked ? (
              <>
                <BookmarkCheck className="h-4 w-4 mr-1" />
                Saved
              </>
            ) : (
              <>
                <BookmarkPlus className="h-4 w-4 mr-1" />
                Save
              </>
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      <Card className="border-primary/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="capitalize">{formula.category}</Badge>
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
                {isMastered && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    <Check className="h-3 w-3 mr-1" /> Mastered
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{formula.title}</CardTitle>
            </div>
            <div className="flex items-center gap-1 bg-background/80 px-3 py-1 rounded-full">
              <Award className="h-4 w-4 text-primary" />
              <span className="font-medium">{formula.points} points</span>
            </div>
          </div>
        </CardHeader>

        <Tabs defaultValue="overview" onValueChange={handleTabChange}>
          <div className="px-6 pt-6">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="example">Example</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-6">
            <TabsContent value="overview" className="space-y-6 mt-0">
              <div className="bg-muted p-6 rounded-md flex justify-center items-center">
                <div className="text-3xl font-mono">{formula.formula}</div>
              </div>

              <div>
                <h4 className="font-medium text-lg mb-2">Description:</h4>
                <p>{formula.description}</p>
              </div>

              {formula.variables && formula.variables.length > 0 && (
                <div>
                  <h4 className="font-medium text-lg mb-2">Variables:</h4>
                  <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                    {formula.variables.map((variable, index) => (
                      <Card key={index} className="p-3 bg-muted/50">
                        <div className="font-mono text-xl font-bold">{variable.symbol}</div>
                        <div className="text-sm">{variable.name}</div>
                        <div className="text-sm text-muted-foreground">{variable.description}</div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="example" className="mt-0">
              {formula.example ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Example Problem</CardTitle>
                    <CardDescription>{formula.example.problem}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Solution:</h4>
                        <div className="bg-muted p-3 rounded-md font-medium">{formula.example.solution}</div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Step-by-step:</h4>
                        <ol className="list-decimal pl-5 space-y-2">
                          {formula.example.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No example available</h3>
                  <p className="text-muted-foreground mt-2">Try the practice problems to test your understanding</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="visualization" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visual Representation</CardTitle>
                  <CardDescription>Visualize how this formula works</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-2 bg-muted/20">
                    <canvas ref={canvasRef} width={400} height={300} className="w-full h-[300px]" />
                  </div>

                  <div className="flex justify-center items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setVisualizationScale(Math.max(0.5, visualizationScale - 0.1))
                        setTimeout(drawVisualization, 10)
                      }}
                      disabled={visualizationScale <= 0.5}
                    >
                      Zoom Out
                    </Button>
                    <div className="text-sm text-muted-foreground">Scale: {visualizationScale.toFixed(1)}x</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setVisualizationScale(Math.min(2, visualizationScale + 0.1))
                        setTimeout(drawVisualization, 10)
                      }}
                      disabled={visualizationScale >= 2}
                    >
                      Zoom In
                    </Button>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Understanding the visualization
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formula.category === "geometry"
                        ? "This visualization shows the geometric shape and its key dimensions. The formula calculates properties like area or perimeter based on these dimensions."
                        : formula.category === "algebra"
                          ? "This visualization shows a graphical representation of the algebraic relationship. The formula describes how variables relate to each other."
                          : "This visualization represents the key concepts behind this formula. Understanding the visual model can help you apply the formula correctly."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="practice" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Practice Problems</CardTitle>
                      <CardDescription>Test your understanding with these practice problems</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{practiceScore} points earned</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Your progress</div>
                      <div className="text-xs text-muted-foreground">{practiceProgress}% complete</div>
                    </div>
                    <Progress value={practiceProgress} className="h-2" />
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">
                        Question {currentPracticeQuestion + 1} of {practiceQuestions.length}
                      </h4>
                      <Button variant="ghost" size="sm" onClick={() => setShowHint(!showHint)} className="text-primary">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        {showHint ? "Hide Hint" : "Show Hint"}
                      </Button>
                    </div>

                    <p className="mb-4">{practiceQuestions[currentPracticeQuestion].question}</p>

                    {showHint && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mb-4">
                        <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                          <Lightbulb className="h-4 w-4" />
                          Hint:
                        </div>
                        <p className="text-sm text-amber-700">{practiceQuestions[currentPracticeQuestion].hint}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="answer" className="text-sm font-medium block mb-1">
                          Your Answer:
                        </label>
                        <div className="flex gap-2">
                          <Input
                            id="answer"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className={cn(
                              isAnswerCorrect === true && "border-green-500 focus-visible:ring-green-500",
                              isAnswerCorrect === false && "border-red-500 focus-visible:ring-red-500",
                            )}
                            placeholder="Enter your answer"
                          />
                          <Button onClick={handleAnswerSubmit}>Submit</Button>
                        </div>
                      </div>

                      {isAnswerCorrect !== null && (
                        <div
                          className={cn(
                            "p-3 rounded-md",
                            isAnswerCorrect
                              ? "bg-green-50 border border-green-200 text-green-700"
                              : "bg-red-50 border border-red-200 text-red-700",
                          )}
                        >
                          {isAnswerCorrect ? (
                            <div className="flex items-center gap-2">
                              <ThumbsUp className="h-4 w-4" />
                              <span>Correct! Well done.</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <X className="h-4 w-4" />
                              <span>Not quite right. Try again or check the hint.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={resetPractice}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset Practice
                    </Button>

                    {currentPracticeQuestion === practiceQuestions.length - 1 && (
                      <Button variant="default" size="sm" onClick={handleMarkAsMastered} disabled={isMastered}>
                        <Award className="h-4 w-4 mr-1" />
                        {isMastered ? "Already Mastered" : "Mark as Mastered"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </CardContent>
        </Tabs>

        <CardFooter className="flex flex-col space-y-4 border-t bg-muted/50 p-6">
          <div className="w-full">
            <h3 className="text-lg font-medium mb-3">Related Formulas</h3>
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
              {relatedFormulas.length > 0 ? (
                relatedFormulas.map((relatedFormula, index) => (
                  <Link key={index} href={`/math-formulas/${relatedFormula.id}`}>
                    <Card className="h-full hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="font-medium mb-1">{relatedFormula.title}</div>
                        <div className="text-sm font-mono mb-2">{relatedFormula.formula}</div>
                        <Badge variant="outline" className="capitalize">
                          {relatedFormula.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-muted-foreground">No related formulas found</div>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm">Master this formula to earn {formula.points} points</span>
            </div>

            {isMastered ? (
              <Button disabled variant="outline" className="gap-2">
                <Check className="h-4 w-4" />
                Mastered
              </Button>
            ) : (
              <Button onClick={handleMarkAsMastered} className="gap-2">
                <Award className="h-4 w-4" />
                Mark as Mastered
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

