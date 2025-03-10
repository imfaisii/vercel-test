"use client"

import { useState, useEffect, Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useSearchParams } from "next/navigation"

// Create a client component wrapper for the parts that use useSearchParams
function InfluencerROIWithParams() {
  const searchParams = useSearchParams()
  // Rest of the component that uses searchParams
  // ...

  // For now, let's just pass through to the main component
  return <InfluencerROIContent />
}

// Main component content that doesn't directly use useSearchParams
function InfluencerROIContent() {
  const [platform, setPlatform] = useState("instagram")
  const [followers, setFollowers] = useState(10000)
  const [engagementRate, setEngagementRate] = useState(3)
  const [conversionRate, setConversionRate] = useState(2)
  const [averageOrderValue, setAverageOrderValue] = useState(50)
  const [influencerCost, setInfluencerCost] = useState(500)
  const [productionCost, setProductionCost] = useState(100)
  const [activeTab, setActiveTab] = useState("calculator")

  const [roi, setRoi] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [profit, setProfit] = useState(0)

  useEffect(() => {
    // Calculate reach based on followers
    const reach = followers * (platform === "tiktok" ? 0.3 : 0.25)

    // Calculate engagements
    const engagements = reach * (engagementRate / 100)

    // Calculate conversions
    const conversions = engagements * (conversionRate / 100)

    // Calculate revenue
    const calculatedRevenue = conversions * averageOrderValue
    setRevenue(calculatedRevenue)

    // Calculate total cost
    const calculatedTotalCost = influencerCost + productionCost
    setTotalCost(calculatedTotalCost)

    // Calculate profit
    const calculatedProfit = calculatedRevenue - calculatedTotalCost
    setProfit(calculatedProfit)

    // Calculate ROI
    const calculatedRoi = (calculatedProfit / calculatedTotalCost) * 100
    setRoi(calculatedRoi)
  }, [platform, followers, engagementRate, conversionRate, averageOrderValue, influencerCost, productionCost])

  const chartData = [
    {
      name: "Revenue",
      value: revenue,
    },
    {
      name: "Cost",
      value: totalCost,
    },
    {
      name: "Profit",
      value: profit,
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
              <h3 className="text-lg font-medium">Campaign Details</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="platform">Social Media Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform">
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
                  <Label htmlFor="followers">Influencer Followers</Label>
                  <Input
                    id="followers"
                    type="number"
                    value={followers}
                    onChange={(e) => setFollowers(Number(e.target.value))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="engagementRate">Average Engagement Rate (%)</Label>
                  <Input
                    id="engagementRate"
                    type="number"
                    value={engagementRate}
                    onChange={(e) => setEngagementRate(Number(e.target.value))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
                  <Input
                    id="conversionRate"
                    type="number"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="averageOrderValue">Average Order Value ($)</Label>
                  <Input
                    id="averageOrderValue"
                    type="number"
                    value={averageOrderValue}
                    onChange={(e) => setAverageOrderValue(Number(e.target.value))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="influencerCost">Influencer Cost ($)</Label>
                  <Input
                    id="influencerCost"
                    type="number"
                    value={influencerCost}
                    onChange={(e) => setInfluencerCost(Number(e.target.value))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="productionCost">Content Production Cost ($)</Label>
                  <Input
                    id="productionCost"
                    type="number"
                    value={productionCost}
                    onChange={(e) => setProductionCost(Number(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={() => setActiveTab("results")} className="w-full">
                Calculate ROI
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <h3 className={`text-2xl font-bold ${roi >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {roi.toFixed(2)}%
                    </h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <h3 className="text-2xl font-bold">${revenue.toFixed(2)}</h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Profit</p>
                    <h3 className={`text-2xl font-bold ${profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                      ${profit.toFixed(2)}
                    </h3>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">Campaign Performance</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, ""]} />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Amount ($)" isAnimationActive={false} />
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

// Export the wrapped component
export function InfluencerROI() {
  return (
    <Suspense fallback={<div>Loading calculator...</div>}>
      <InfluencerROIWithParams />
    </Suspense>
  )
}

