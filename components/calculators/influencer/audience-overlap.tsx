"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function AudienceOverlap() {
  const [influencers, setInfluencers] = useState([
    { id: 1, name: "Influencer 1", platform: "instagram", followers: 100000, audience: [] },
    { id: 2, name: "Influencer 2", platform: "tiktok", followers: 200000, audience: [] },
  ])

  const [overlapPercentage, setOverlapPercentage] = useState(20)
  const [activeTab, setActiveTab] = useState("calculator")
  const [totalReach, setTotalReach] = useState(0)
  const [uniqueReach, setUniqueReach] = useState(0)
  const [overlapReach, setOverlapReach] = useState(0)

  const addInfluencer = () => {
    const newId = influencers.length > 0 ? Math.max(...influencers.map((inf) => inf.id)) + 1 : 1
    setInfluencers([
      ...influencers,
      {
        id: newId,
        name: `Influencer ${newId}`,
        platform: "instagram",
        followers: 100000,
        audience: [],
      },
    ])
  }

  const removeInfluencer = (id: number) => {
    if (influencers.length <= 2) return
    setInfluencers(influencers.filter((inf) => inf.id !== id))
  }

  const updateInfluencer = (id: number, field: string, value: any) => {
    setInfluencers(influencers.map((inf) => (inf.id === id ? { ...inf, [field]: value } : inf)))
  }

  const calculateReach = () => {
    // Simple calculation for demo purposes
    const totalFollowers = influencers.reduce((sum, inf) => sum + inf.followers, 0)
    const overlapAmount = (totalFollowers * overlapPercentage) / 100

    setTotalReach(totalFollowers)
    setOverlapReach(overlapAmount)
    setUniqueReach(totalFollowers - overlapAmount)
    setActiveTab("results")
  }

  const chartData = [
    { name: "Unique Reach", value: uniqueReach },
    { name: "Overlap", value: overlapReach },
  ]

  const COLORS = ["#0088FE", "#FF8042"]

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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Influencers</h3>
                <Button onClick={addInfluencer} size="sm">
                  Add Influencer
                </Button>
              </div>

              {influencers.map((influencer) => (
                <Card key={influencer.id} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">{influencer.name}</h4>
                    <Button
                      onClick={() => removeInfluencer(influencer.id)}
                      variant="outline"
                      size="sm"
                      disabled={influencers.length <= 2}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`platform-${influencer.id}`}>Platform</Label>
                      <Select
                        value={influencer.platform}
                        onValueChange={(value) => updateInfluencer(influencer.id, "platform", value)}
                      >
                        <SelectTrigger id={`platform-${influencer.id}`}>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`followers-${influencer.id}`}>Followers</Label>
                      <Input
                        id={`followers-${influencer.id}`}
                        type="number"
                        value={influencer.followers}
                        onChange={(e) => updateInfluencer(influencer.id, "followers", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </Card>
              ))}

              <div className="grid gap-2">
                <Label htmlFor="overlapPercentage">Estimated Audience Overlap (%)</Label>
                <Input
                  id="overlapPercentage"
                  type="number"
                  value={overlapPercentage}
                  onChange={(e) => setOverlapPercentage(Number(e.target.value))}
                  min={0}
                  max={100}
                />
              </div>

              <Button onClick={calculateReach} className="w-full">
                Calculate Reach
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Total Potential Reach</p>
                    <h3 className="text-2xl font-bold">{totalReach.toLocaleString()}</h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Unique Reach</p>
                    <h3 className="text-2xl font-bold">{uniqueReach.toLocaleString()}</h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Reach Efficiency</p>
                    <h3 className="text-2xl font-bold">{((uniqueReach / totalReach) * 100).toFixed(1)}%</h3>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">Audience Overlap Visualization</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value.toLocaleString(), "Audience"]} />
                        <Legend />
                      </PieChart>
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

