"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mathFormulas, type FormulaCategory } from "@/lib/math-formulas-data"
import { Trophy, Flame, BookOpen, Star, TrendingUp } from "lucide-react"

export function ProgressDashboard() {
  const [streak, setStreak] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [masteredCount, setMasteredCount] = useState(0)

  // Simulate loading user progress
  useEffect(() => {
    // In a real app, this would come from a database or localStorage
    setStreak(3)
    setTotalPoints(120)
    setMasteredCount(6)
  }, [])

  const totalFormulas = mathFormulas.length
  const progressPercentage = Math.round((masteredCount / totalFormulas) * 100)

  // Group formulas by category for the stats
  const categoryCounts = mathFormulas.reduce(
    (acc, formula) => {
      acc[formula.category] = (acc[formula.category] || 0) + 1
      return acc
    },
    {} as Record<FormulaCategory, number>,
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Your Progress
        </CardTitle>
        <CardDescription>Track your formula mastery journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                    <h3 className="text-2xl font-bold">{streak} days</h3>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Flame className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                    <h3 className="text-2xl font-bold">{totalPoints}</h3>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Formulas Mastered</p>
                    <h3 className="text-2xl font-bold">
                      {masteredCount} / {totalFormulas}
                    </h3>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Overall Progress</h3>
              <Badge variant="outline">{progressPercentage}%</Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Tabs defaultValue="byCategory">
            <TabsList className="w-full">
              <TabsTrigger value="byCategory">By Category</TabsTrigger>
              <TabsTrigger value="byDifficulty">By Difficulty</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="byCategory" className="mt-4">
              <div className="space-y-4">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium capitalize">{category}</p>
                      <p className="text-sm text-muted-foreground">2/{count}</p>
                    </div>
                    <Progress value={(2 / count) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="byDifficulty" className="mt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">Easy</p>
                    <p className="text-sm text-muted-foreground">3/5</p>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">Medium</p>
                    <p className="text-sm text-muted-foreground">2/8</p>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">Hard</p>
                    <p className="text-sm text-muted-foreground">1/5</p>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recent" className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Mastered Pythagorean Theorem</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                  <Badge className="ml-auto">+10 pts</Badge>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Flame className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">3 Day Streak Achieved</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                  <Badge className="ml-auto">+15 pts</Badge>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Studied Quadratic Formula</p>
                    <p className="text-sm text-muted-foreground">Yesterday</p>
                  </div>
                  <Badge className="ml-auto">+5 pts</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

