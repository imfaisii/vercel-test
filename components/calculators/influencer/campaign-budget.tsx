"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function CampaignBudget() {
  const [totalBudget, setTotalBudget] = useState(10000)
  const [microAllocation, setMicroAllocation] = useState(20)
  const [macroAllocation, setMacroAllocation] = useState(30)
  const [megaAllocation, setMegaAllocation] = useState(50)
  const [activeTab, setActiveTab] = useState("calculator")

  // Derived state
  const microBudget = (totalBudget * microAllocation) / 100
  const macroBudget = (totalBudget * macroAllocation) / 100
  const megaBudget = (totalBudget * megaAllocation) / 100

  // Estimated reach calculations
  const microReach = microBudget * 100 // Simplified calculation
  const macroReach = macroBudget * 50
  const megaReach = megaBudget * 20
  const totalReach = microReach + macroReach + megaReach

  const updateMicroAllocation = (value: number[]) => {
    const newMicro = value[0]
    const remaining = 100 - newMicro - megaAllocation
    if (remaining >= 0) {
      setMicroAllocation(newMicro)
      setMacroAllocation(remaining)
    }
  }

  const updateMacroAllocation = (value: number[]) => {
    const newMacro = value[0]
    const remaining = 100 - newMacro - microAllocation
    if (remaining >= 0) {
      setMacroAllocation(newMacro)
      setMegaAllocation(remaining)
    }
  }

  const updateMegaAllocation = (value: number[]) => {
    const newMega = value[0]
    const remaining = 100 - newMega - microAllocation
    if (remaining >= 0) {
      setMegaAllocation(newMega)
      setMacroAllocation(remaining)
    }
  }

  const chartData = [
    {
      name: "Micro",
      budget: microBudget,
      reach: microReach,
    },
    {
      name: "Macro",
      budget: macroBudget,
      reach: macroReach,
    },
    {
      name: "Mega",
      budget: megaBudget,
      reach: megaReach,
    },
  ]

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Tabs defaultValue="calculator" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="results">Results & Visualizations</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Campaign Budget</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="totalBudget">Total Budget ($)</Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                  />
                </div>

                <Card className="p-4">
                  <h4 className="font-medium mb-4">Budget Allocation</h4>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="microAllocation">Micro Influencers ({microAllocation}%)</Label>
                        <span className="text-sm text-muted-foreground">${microBudget.toLocaleString()}</span>
                      </div>
                      <Slider
                        id="microAllocation"
                        value={[microAllocation]}
                        onValueChange={updateMicroAllocation}
                        max={100}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">1K-10K followers</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="macroAllocation">Macro Influencers ({macroAllocation}%)</Label>
                        <span className="text-sm text-muted-foreground">${macroBudget.toLocaleString()}</span>
                      </div>
                      <Slider
                        id="macroAllocation"
                        value={[macroAllocation]}
                        onValueChange={updateMacroAllocation}
                        max={100}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">10K-100K followers</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="megaAllocation">Mega Influencers ({megaAllocation}%)</Label>
                        <span className="text-sm text-muted-foreground">${megaBudget.toLocaleString()}</span>
                      </div>
                      <Slider
                        id="megaAllocation"
                        value={[megaAllocation]}
                        onValueChange={updateMegaAllocation}
                        max={100}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">100K+ followers</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Button onClick={() => setActiveTab("results")} className="w-full">
                View Budget Breakdown
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <h3 className="text-2xl font-bold">${totalBudget.toLocaleString()}</h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Estimated Reach</p>
                    <h3 className="text-2xl font-bold">{totalReach.toLocaleString()}</h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">CPM (Cost per 1000)</p>
                    <h3 className="text-2xl font-bold">${((totalBudget / totalReach) * 1000).toFixed(2)}</h3>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">Budget Allocation</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, ""]} />
                        <Legend />
                        <Bar dataKey="budget" fill="#8884d8" name="Budget ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">Estimated Reach</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="reach" fill="#82ca9d" name="Reach" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={() => setActiveTab("calculator")} variant="outline" className="w-full">
                Back to Calculator
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

