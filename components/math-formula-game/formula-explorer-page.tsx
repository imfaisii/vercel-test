"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { mathFormulas, type FormulaCategory, getDailyFormula } from "@/lib/math-formulas-data"
import {
  Search,
  Filter,
  BookOpen,
  Star,
  Trophy,
  Calendar,
  Flame,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Award,
  BookMarked,
  CheckCircle2,
  Clock,
  Lightbulb,
  Bookmark,
} from "lucide-react"
import Link from "next/link"

export function FormulaExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<FormulaCategory | "all">("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all")
  const [bookmarkedFormulas, setBookmarkedFormulas] = useState<string[]>([])

  // Load bookmarked formulas from localStorage on component mount
  useState(() => {
    const bookmarked = JSON.parse(localStorage.getItem("bookmarkedFormulas") || "[]")
    setBookmarkedFormulas(bookmarked)
  })

  // Filter formulas based on search query, category, and difficulty
  const filteredFormulas = mathFormulas.filter((formula) => {
    const matchesSearch =
      formula.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formula.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || formula.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || formula.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const categories: Array<FormulaCategory | "all"> = [
    "all",
    "algebra",
    "geometry",
    "trigonometry",
    "calculus",
    "statistics",
  ]
  const difficulties = ["all", "easy", "medium", "hard"]

  // Get daily formula
  const dailyFormula = getDailyFormula()

  // Mock user progress data
  const userProgress = {
    streak: 7,
    totalPoints: 145,
    formulasMastered: 12,
    totalFormulas: mathFormulas.length,
    lastActivity: "Today",
    nextMilestone: 15,
    recentFormulas: [
      { id: "pythagorean-theorem", title: "Pythagorean Theorem", date: "2 days ago" },
      { id: "slope-formula", title: "Slope Formula", date: "3 days ago" },
    ],
  }

  const toggleBookmark = (e: React.MouseEvent, formulaId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const updated = bookmarkedFormulas.includes(formulaId)
      ? bookmarkedFormulas.filter((id) => id !== formulaId)
      : [...bookmarkedFormulas, formulaId]

    setBookmarkedFormulas(updated)
    localStorage.setItem("bookmarkedFormulas", JSON.stringify(updated))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Math Formula Explorer</h1>
        <p className="text-muted-foreground">
          Master essential math formulas through daily challenges and interactive learning
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - User Progress */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Daily Streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold">{userProgress.streak}</span>
                  <span className="text-muted-foreground">days</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Total Points</span>
                </div>
                <span className="text-xl font-bold">{userProgress.totalPoints}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Formulas Mastered</span>
                  </div>
                  <span className="text-xl font-bold">
                    {userProgress.formulasMastered}/{userProgress.totalFormulas}
                  </span>
                </div>
                <Progress value={(userProgress.formulasMastered / userProgress.totalFormulas) * 100} className="h-2" />
              </div>

              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Next Milestone: {userProgress.nextMilestone} Formulas</div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <div className="text-sm text-muted-foreground">
                    {userProgress.nextMilestone - userProgress.formulasMastered} more to unlock "Math Wizard" badge
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/calculators/math/formulas/progress">
                  View Detailed Progress
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Formula of the Day
              </CardTitle>
              <CardDescription>Complete today's challenge to maintain your streak!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <Badge className="capitalize">{dailyFormula.category}</Badge>
                <Badge
                  variant={
                    dailyFormula.difficulty === "easy"
                      ? "outline"
                      : dailyFormula.difficulty === "medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {dailyFormula.difficulty}
                </Badge>
              </div>

              <h3 className="font-bold text-lg">{dailyFormula.title}</h3>

              <div className="bg-muted p-3 rounded-md flex justify-center">
                <div className="font-mono text-lg">{dailyFormula.formula}</div>
              </div>

              <p className="text-sm text-muted-foreground">{dailyFormula.description}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full" asChild>
                <Link href={`/math-formulas/${dailyFormula.id}`}>
                  Start Today's Challenge
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Last activity: <span className="font-medium text-foreground">{userProgress.lastActivity}</span>
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="text-sm font-medium">Recently Mastered</div>
                {userProgress.recentFormulas.map((formula) => (
                  <div key={formula.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{formula.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formula.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Formula Explorer */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Formula Explorer
              </CardTitle>
              <CardDescription>Browse, search, and master essential math formulas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search formulas..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="text-sm font-medium mr-2">Difficulty:</div>
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedDifficulty(difficulty as any)}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>

              <Tabs defaultValue="all" onValueChange={(value) => setSelectedCategory(value as FormulaCategory | "all")}>
                <TabsList className="w-full justify-start overflow-auto">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category} value={category} className="space-y-4 mt-4">
                    {filteredFormulas.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No formulas found. Try adjusting your search.
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {filteredFormulas.map((formula) => (
                          <FormulaCard
                            key={formula.id}
                            formula={formula}
                            isBookmarked={bookmarkedFormulas.includes(formula.id)}
                            onToggleBookmark={(e) => toggleBookmark(e, formula.id)}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Learning Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Daily Practice
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Commit to solving at least one formula challenge each day to build your mathematical intuition.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <BookMarked className="h-4 w-4 text-primary" />
                    Connect Concepts
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Look for relationships between different formulas to deepen your understanding of mathematical
                    principles.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface FormulaCardProps {
  formula: any
  isBookmarked: boolean
  onToggleBookmark: (e: React.MouseEvent) => void
}

function FormulaCard({ formula, isBookmarked, onToggleBookmark }: FormulaCardProps) {
  // Mock mastery status - in a real app, this would come from user data
  const masteryStatus = Math.random() > 0.5 ? "mastered" : "not-started"

  return (
    <Link href={`/math-formulas/${formula.id}`}>
      <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors relative">
        <div
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white dark:bg-gray-800 border cursor-pointer"
          onClick={onToggleBookmark}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"}`} />
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
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
          </div>

          <h3 className="font-bold mb-2">{formula.title}</h3>

          <div className="bg-muted p-2 rounded-md mb-3 flex justify-center">
            <div className="font-mono">{formula.formula}</div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{formula.description}</p>

          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span>{formula.points} pts</span>
            </div>

            {masteryStatus === "mastered" ? (
              <div className="flex items-center gap-1 text-sm text-green-500">
                <CheckCircle2 className="h-3 w-3" />
                <span>Mastered</span>
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="gap-1">
                <span>Explore</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

