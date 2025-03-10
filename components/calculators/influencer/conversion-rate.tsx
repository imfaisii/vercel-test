"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function ConversionRate() {
  const [impressions, setImpressions] = useState(100000)
  const [clicks, setClicks] = useState(5000)
  const [addToCart, setAddToCart] = useState(1000)
  const [purchases, setPurchases] = useState(200)
  const [averageOrderValue, setAverageOrderValue] = useState(50)
  const [campaignCost, setCampaignCost] = useState(2000)
  const [activeTab, setActiveTab] = useState("calculator")

  // Derived metrics
  const clickThroughRate = (clicks / impressions) * 100
  const cartConversionRate = (addToCart / clicks) * 100
  const purchaseConversionRate = (purchases / addToCart) * 100
  const overallConversionRate = (purchases / impressions) * 100

  const revenue = purchases * averageOrderValue
  const profit = revenue - campaignCost
  const roi = (profit / campaignCost) * 100

  const funnelData = [
    { name: "Impressions", value: impressions },
    { name: "Clicks", value: clicks },
    { name: "Add to Cart", value: addToCart },
    { name: "Purchases", value: purchases },
  ]

  const conversionData = [
    { name: "CTR", rate: clickThroughRate },
    { name: "Cart Rate", rate: cartConversionRate },
    { name: "Purchase Rate", rate: purchaseConversionRate },
    { name: "Overall", rate: overallConversionRate },
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
              <h3 className="text-lg font-medium">Marketing Funnel Metrics</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="impressions">Impressions</Label>
                  <Input
                    id="impressions"
                    type="number"
                    value={impressions}
                    onChange={(e) => setImpressions(Number(e.target.value))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="clicks">Clicks</Label>
                  <Input id="clicks" type="number" value={clicks} onChange={(e) => setClicks(Number(e.target.value))} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="addToCart">Add to Cart</Label>
                  <Input
                    id="addToCart"
                    type="number"
                    value={addToCart}
                    onChange={(e) => setAddToCart(Number(e.target.value))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="purchases">Purchases</Label>
                  <Input
                    id="purchases"
                    type="number"
                    value={purchases}
                    onChange={(e) => setPurchases(Number(e.target.value))}
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
                  <Label htmlFor="campaignCost">Campaign Cost ($)</Label>
                  <Input
                    id="campaignCost"
                    type="number"
                    value={campaignCost}
                    onChange={(e) => setCampaignCost(Number(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={() => setActiveTab("results")} className="w-full">
                Calculate Conversion Metrics
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Overall Conversion</p>
                    <h3 className="text-2xl font-bold">{overallConversionRate.toFixed(2)}%</h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <h3 className="text-2xl font-bold">${revenue.toLocaleString()}</h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <h3 className={`text-2xl font-bold ${roi >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {roi.toFixed(2)}%
                    </h3>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">Marketing Funnel</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value.toLocaleString(), ""]} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" name="Users" isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">Conversion Rates</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={conversionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, "Conversion Rate"]} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          stroke="#82ca9d"
                          name="Conversion Rate (%)"
                          isAnimationActive={false}
                        />
                      </LineChart>
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

