"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  Award,
  BookmarkCheck,
  Filter,
  CheckCircle2,
  Star,
  BookOpen,
  Sparkles,
  ArrowUpDown,
  Clock,
  ChevronRight,
  Bookmark,
  X,
  Lightbulb,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import type { MathFormula } from "@/lib/math-formulas-data"

interface FormulaExplorerProps {
  formulas: MathFormula[]
}

export function FormulaExplorer({ formulas }: FormulaExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("default")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [filteredFormulas, setFilteredFormulas] = useState<MathFormula[]>(formulas)
  const [masteredFormulas, setMasteredFormulas] = useState<string[]>([])
  const [bookmarkedFormulas, setBookmarkedFormulas] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [showOnlyMastered, setShowOnlyMastered] = useState(false)
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false)
  const [showOnlyRecent, setShowOnlyRecent] = useState(false)

  // Get unique categories from formulas
  const categories = useMemo(() => Array.from(new Set(formulas.map((formula) => formula.category))), [formulas])

  // Get unique difficulties from formulas
  const difficulties = useMemo(() => Array.from(new Set(formulas.map((formula) => formula.difficulty))), [formulas])

  // Calculate progress statistics
  const progressStats = useMemo(() => {
    const totalFormulas = formulas.length
    const masteredCount = masteredFormulas.length
    const masteryPercentage = totalFormulas > 0 ? (masteredCount / totalFormulas) * 100 : 0

    // Calculate points
    const totalPoints = formulas.reduce(
      (sum, formula) => (masteredFormulas.includes(formula.id) ? sum + formula.points : sum),
      0,
    )

    // Calculate category breakdown
    const categoryBreakdown = categories.map((category) => {
      const categoryFormulas = formulas.filter((f) => f.category === category)
      const masteredInCategory = categoryFormulas.filter((f) => masteredFormulas.includes(f.id))
      return {
        category,
        total: categoryFormulas.length,
        mastered: masteredInCategory.length,
        percentage: categoryFormulas.length > 0 ? (masteredInCategory.length / categoryFormulas.length) * 100 : 0,
      }
    })

    return {
      totalFormulas,
      masteredCount,
      masteryPercentage,
      totalPoints,
      categoryBreakdown,
    }
  }, [formulas, masteredFormulas, categories])

  // Recommended formulas based on user progress
  const recommendedFormulas = useMemo(() => {
    // Logic: Recommend formulas that are:
    // 1. Not mastered yet
    // 2. In categories the user has started but not completed
    // 3. Of appropriate difficulty (not too hard compared to what they've mastered)

    // Find categories user has started
    const startedCategories = new Set(formulas.filter((f) => masteredFormulas.includes(f.id)).map((f) => f.category))

    // Find the highest difficulty user has mastered
    const difficultyLevels = ["easy", "medium", "hard"]
    const masteredDifficulties = new Set(
      formulas.filter((f) => masteredFormulas.includes(f.id)).map((f) => f.difficulty),
    )

    const maxMasteredDifficultyIndex = Math.max(
      ...Array.from(masteredDifficulties).map((d) => difficultyLevels.indexOf(d)),
    )

    // Allow recommendations up to one level higher than max mastered
    const maxRecommendedDifficultyIndex = Math.min(maxMasteredDifficultyIndex + 1, difficultyLevels.length - 1)

    // Get recommendations
    return formulas
      .filter(
        (f) =>
          !masteredFormulas.includes(f.id) &&
          startedCategories.has(f.category) &&
          difficultyLevels.indexOf(f.difficulty) <= maxRecommendedDifficultyIndex,
      )
      .slice(0, 3)
  }, [formulas, masteredFormulas])

  useEffect(() => {
    // Load mastered and bookmarked formulas from localStorage
    const mastered = JSON.parse(localStorage.getItem("masteredFormulas") || "[]")
    const bookmarked = JSON.parse(localStorage.getItem("bookmarkedFormulas") || "[]")
    const recent = JSON.parse(localStorage.getItem("recentlyViewedFormulas") || "[]")

    setMasteredFormulas(mastered)
    setBookmarkedFormulas(bookmarked)
    setRecentlyViewed(recent)
  }, [])

  useEffect(() => {
    // Update active filters array for the filter badges
    const filters = []
    if (selectedCategory !== "all") filters.push(`Category: ${selectedCategory}`)
    if (selectedDifficulty !== "all") filters.push(`Difficulty: ${selectedDifficulty}`)
    if (showOnlyMastered) filters.push("Mastered only")
    if (showOnlyBookmarked) filters.push("Bookmarked only")
    if (showOnlyRecent) filters.push("Recently viewed")
    if (sortBy !== "default") filters.push(`Sorted by: ${sortBy}`)

    setActiveFilters(filters)
  }, [selectedCategory, selectedDifficulty, showOnlyMastered, showOnlyBookmarked, showOnlyRecent, sortBy])

  useEffect(() => {
    // Filter formulas based on all criteria
    let filtered = formulas

    if (searchTerm) {
      filtered = filtered.filter(
        (formula) =>
          formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formula.formula.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((formula) => formula.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((formula) => formula.difficulty === selectedDifficulty)
    }

    if (showOnlyMastered) {
      filtered = filtered.filter((formula) => masteredFormulas.includes(formula.id))
    }

    if (showOnlyBookmarked) {
      filtered = filtered.filter((formula) => bookmarkedFormulas.includes(formula.id))
    }

    if (showOnlyRecent) {
      filtered = filtered.filter((formula) => recentlyViewed.includes(formula.id))
    }

    // Sort formulas
    switch (sortBy) {
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "difficulty-asc":
        filtered.sort((a, b) => {
          const order = { easy: 1, medium: 2, hard: 3 }
          return order[a.difficulty] - order[b.difficulty]
        })
        break
      case "difficulty-desc":
        filtered.sort((a, b) => {
          const order = { easy: 1, medium: 2, hard: 3 }
          return order[b.difficulty] - order[a.difficulty]
        })
        break
      case "points-asc":
        filtered.sort((a, b) => a.points - b.points)
        break
      case "points-desc":
        filtered.sort((a, b) => b.points - a.points)
        break
      case "recently-viewed":
        filtered.sort((a, b) => {
          const aIndex = recentlyViewed.indexOf(a.id)
          const bIndex = recentlyViewed.indexOf(b.id)
          if (aIndex === -1) return 1
          if (bIndex === -1) return -1
          return aIndex - bIndex
        })
        break
      default:
        // Default sorting by category then difficulty
        filtered.sort((a, b) => {
          if (a.category !== b.category) return a.category.localeCompare(b.category)
          const order = { easy: 1, medium: 2, hard: 3 }
          return order[a.difficulty] - order[b.difficulty]
        })
    }

    setFilteredFormulas(filtered)
  }, [
    formulas,
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    showOnlyMastered,
    showOnlyBookmarked,
    showOnlyRecent,
    sortBy,
    masteredFormulas,
    bookmarkedFormulas,
    recentlyViewed,
  ])

  const toggleBookmark = (e: React.MouseEvent, formulaId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const updated = bookmarkedFormulas.includes(formulaId)
      ? bookmarkedFormulas.filter((id) => id !== formulaId)
      : [...bookmarkedFormulas, formulaId]

    setBookmarkedFormulas(updated)
    localStorage.setItem("bookmarkedFormulas", JSON.stringify(updated))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSortBy("default")
    setShowOnlyMastered(false)
    setShowOnlyBookmarked(false)
    setShowOnlyRecent(false)
  }

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Category:")) setSelectedCategory("all")
    else if (filter.startsWith("Difficulty:")) setSelectedDifficulty("all")
    else if (filter === "Mastered only") setShowOnlyMastered(false)
    else if (filter === "Bookmarked only") setShowOnlyBookmarked(false)
    else if (filter === "Recently viewed") setShowOnlyRecent(false)
    else if (filter.startsWith("Sorted by:")) setSortBy("default")
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="explorer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="explorer">Formula Explorer</TabsTrigger>
          <TabsTrigger value="progress">Your Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="explorer" className="space-y-6 pt-4">
          {/* Search and Filter Bar */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search formulas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category.replace(/-/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty} className="capitalize">
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Advanced Filters</h4>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="mastered-only" className="text-sm font-medium flex items-center">
                            <Award className="h-4 w-4 mr-2 text-yellow-500" />
                            Show only mastered
                          </label>
                          <input
                            id="mastered-only"
                            type="checkbox"
                            checked={showOnlyMastered}
                            onChange={(e) => setShowOnlyMastered(e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <label htmlFor="bookmarked-only" className="text-sm font-medium flex items-center">
                            <BookmarkCheck className="h-4 w-4 mr-2 text-blue-500" />
                            Show only bookmarked
                          </label>
                          <input
                            id="bookmarked-only"
                            type="checkbox"
                            checked={showOnlyBookmarked}
                            onChange={(e) => setShowOnlyBookmarked(e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <label htmlFor="recent-only" className="text-sm font-medium flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-green-500" />
                            Show only recently viewed
                          </label>
                          <input
                            id="recent-only"
                            type="checkbox"
                            checked={showOnlyRecent}
                            onChange={(e) => setShowOnlyRecent(e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          Sort by
                        </label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                            <SelectItem value="difficulty-asc">Difficulty (Easy to Hard)</SelectItem>
                            <SelectItem value="difficulty-desc">Difficulty (Hard to Easy)</SelectItem>
                            <SelectItem value="points-asc">Points (Low to High)</SelectItem>
                            <SelectItem value="points-desc">Points (High to Low)</SelectItem>
                            <SelectItem value="recently-viewed">Recently Viewed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                          <Sparkles className="h-4 w-4 mr-2" />
                          View mode
                        </label>
                        <div className="flex gap-2">
                          <Button
                            variant={viewMode === "grid" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="flex-1"
                          >
                            Grid
                          </Button>
                          <Button
                            variant={viewMode === "list" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="flex-1"
                          >
                            List
                          </Button>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                        Clear All Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                    {filter}
                    <button onClick={() => removeFilter(filter)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
                  Clear All
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                {filteredFormulas.length} formulas
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                <Award className="h-3 w-3 mr-1" />
                {masteredFormulas.length} mastered
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                <BookmarkCheck className="h-3 w-3 mr-1" />
                {bookmarkedFormulas.length} bookmarked
              </Badge>
            </div>
          </div>

          {/* Recommended Formulas */}
          {recommendedFormulas.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Recommended for You
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {recommendedFormulas.map((formula) => (
                  <Link key={formula.id} href={`/math-formulas/${formula.id}`}>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-1">
                        <Badge className="capitalize">{formula.category}</Badge>
                        <Badge variant="outline" className="capitalize">
                          {formula.difficulty}
                        </Badge>
                      </div>
                      <h4 className="font-medium">{formula.title}</h4>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                        {formula.points} points
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Formula Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFormulas.map((formula) => (
                <Link key={formula.id} href={`/math-formulas/${formula.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-primary/10 relative">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{formula.title}</CardTitle>
                        <div className="flex gap-1">
                          {masteredFormulas.includes(formula.id) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full p-1">
                                    <Award className="h-4 w-4" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>You've mastered this formula</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  onClick={(e) => toggleBookmark(e, formula.id)}
                                  className={`rounded-full p-1 ${
                                    bookmarkedFormulas.includes(formula.id)
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                  }`}
                                >
                                  <Bookmark className="h-4 w-4" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {bookmarkedFormulas.includes(formula.id)
                                    ? "Remove bookmark"
                                    : "Bookmark this formula"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="capitalize">{formula.category}</Badge>
                        <Badge
                          variant={
                            formula.difficulty === "easy"
                              ? "outline"
                              : formula.difficulty === "medium"
                                ? "secondary"
                                : "destructive"
                          }
                          className="capitalize"
                        >
                          {formula.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="bg-muted p-3 rounded-md my-2 flex justify-center">
                        <span className="font-mono">{formula.formula}</span>
                      </div>
                      <p className="text-sm line-clamp-2">{formula.description}</p>
                    </CardContent>

                    <CardFooter className="border-t pt-3 flex justify-between">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                        {formula.points} points
                      </div>

                      {recentlyViewed.includes(formula.id) && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Recently viewed
                        </Badge>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFormulas.map((formula) => (
                <Link key={formula.id} href={`/math-formulas/${formula.id}`}>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{formula.title}</span>
                        <div className="flex gap-2 mt-1">
                          <Badge className="capitalize text-xs">{formula.category}</Badge>
                          <Badge
                            variant={
                              formula.difficulty === "easy"
                                ? "outline"
                                : formula.difficulty === "medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="capitalize text-xs"
                          >
                            {formula.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                            {formula.points} pts
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {masteredFormulas.includes(formula.id) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full p-1">
                                <Award className="h-4 w-4" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>You've mastered this formula</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              onClick={(e) => toggleBookmark(e, formula.id)}
                              className={`rounded-full p-1 ${
                                bookmarkedFormulas.includes(formula.id)
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                              }`}
                            >
                              <Bookmark className="h-4 w-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {bookmarkedFormulas.includes(formula.id) ? "Remove bookmark" : "Bookmark this formula"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredFormulas.length === 0 && (
            <div className="text-center py-12">
              <div className="text-lg font-medium">No formulas found</div>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear All Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6 pt-4">
          {/* Progress Overview */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Your Progress Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground mb-1">Formulas Mastered</div>
                <div className="text-2xl font-bold">
                  {progressStats.masteredCount} / {progressStats.totalFormulas}
                </div>
                <Progress value={progressStats.masteryPercentage} className="h-2 mt-2" />
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground mb-1">Total Points Earned</div>
                <div className="text-2xl font-bold">{progressStats.totalPoints}</div>
                <div className="text-xs text-muted-foreground mt-2">Keep learning to earn more points!</div>
              </div>
            </div>

            {/* Category Breakdown */}
            <h4 className="font-medium mb-3">Progress by Category</h4>
            <div className="space-y-4">
              {progressStats.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{cat.category.replace(/-/g, " ")}</span>
                    <span>
                      {cat.mastered} / {cat.total}
                    </span>
                  </div>
                  <Progress value={cat.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Mastered Formulas */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Mastered Formulas</h3>

            {masteredFormulas.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h4 className="text-lg font-medium">No formulas mastered yet</h4>
                <p className="text-muted-foreground">Start learning and practicing to master formulas</p>
                <Button className="mt-4" asChild>
                  <Link href="/math-formulas">Explore Formulas</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {formulas
                  .filter((formula) => masteredFormulas.includes(formula.id))
                  .map((formula) => (
                    <Link key={formula.id} href={`/math-formulas/${formula.id}`}>
                      <div className="border rounded-lg p-3 hover:bg-muted/20 transition-colors">
                        <div className="flex justify-between">
                          <Badge className="capitalize">{formula.category}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {formula.difficulty}
                          </Badge>
                        </div>
                        <h4 className="font-medium mt-2">{formula.title}</h4>
                        <div className="bg-muted p-2 rounded-md my-2 flex justify-center">
                          <span className="font-mono text-sm">{formula.formula}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                            {formula.points} points
                          </div>
                          <div className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            Mastered
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>

          {/* Bookmarked Formulas */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Bookmarked Formulas</h3>

            {bookmarkedFormulas.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h4 className="text-lg font-medium">No bookmarked formulas</h4>
                <p className="text-muted-foreground">Bookmark formulas to save them for later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {formulas
                  .filter((formula) => bookmarkedFormulas.includes(formula.id))
                  .map((formula) => (
                    <Link key={formula.id} href={`/math-formulas/${formula.id}`}>
                      <div className="border rounded-lg p-3 hover:bg-muted/20 transition-colors">
                        <div className="flex justify-between">
                          <Badge className="capitalize">{formula.category}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {formula.difficulty}
                          </Badge>
                        </div>
                        <h4 className="font-medium mt-2">{formula.title}</h4>
                        <div className="bg-muted p-2 rounded-md my-2 flex justify-center">
                          <span className="font-mono text-sm">{formula.formula}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                            {formula.points} points
                          </div>
                          <div className="flex items-center">
                            <BookmarkCheck className="h-3 w-3 mr-1 text-blue-500" />
                            Bookmarked
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

