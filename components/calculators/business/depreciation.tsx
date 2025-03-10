"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function DepreciationCalculator() {
  const [assetCost, setAssetCost] = useState<number>(50000)
  const [salvageValue, setSalvageValue] = useState<number>(5000)
  const [usefulLife, setUsefulLife] = useState<number>(5)
  const [method, setMethod] = useState<string>("straight-line")
  const [depreciationSchedule, setDepreciationSchedule] = useState<any[]>([])
  const [annualDepreciation, setAnnualDepreciation] = useState<number>(0)

  useEffect(() => {
    calculateDepreciation()
  }, [assetCost, salvageValue, usefulLife, method])

  const calculateDepreciation = () => {
    const depreciableAmount = assetCost - salvageValue
    const schedule = []

    if (method === "straight-line") {
      // Straight-line depreciation
      const yearlyDepreciation = depreciableAmount / usefulLife
      setAnnualDepreciation(yearlyDepreciation)

      let remainingValue = assetCost

      for (let year = 1; year <= usefulLife; year++) {
        remainingValue -= yearlyDepreciation

        schedule.push({
          year,
          depreciation: yearlyDepreciation,
          accumulatedDepreciation: year * yearlyDepreciation,
          bookValue: Math.max(remainingValue, salvageValue),
        })
      }
    } else if (method === "double-declining") {
      // Double-declining balance depreciation
      const straightLineRate = 1 / usefulLife
      const doubleRate = straightLineRate * 2
      setAnnualDepreciation(assetCost * doubleRate) // First year

      let remainingValue = assetCost
      let accumulatedDepreciation = 0

      for (let year = 1; year <= usefulLife; year++) {
        let yearlyDepreciation = remainingValue * doubleRate

        // Switch to straight-line for the remaining years if it gives higher depreciation
        const remainingYears = usefulLife - year + 1
        const straightLineRemaining = (remainingValue - salvageValue) / remainingYears

        if (straightLineRemaining > yearlyDepreciation) {
          yearlyDepreciation = straightLineRemaining
        }

        // Ensure we don't depreciate below salvage value
        if (remainingValue - yearlyDepreciation < salvageValue) {
          yearlyDepreciation = remainingValue - salvageValue
        }

        remainingValue -= yearlyDepreciation
        accumulatedDepreciation += yearlyDepreciation

        schedule.push({
          year,
          depreciation: yearlyDepreciation,
          accumulatedDepreciation,
          bookValue: remainingValue,
        })

        // Stop if we've reached salvage value
        if (remainingValue <= salvageValue) {
          break
        }
      }
    } else if (method === "sum-of-years") {
      // Sum-of-years-digits depreciation
      const sumOfYears = (usefulLife * (usefulLife + 1)) / 2
      setAnnualDepreciation(depreciableAmount * (usefulLife / sumOfYears)) // First year

      let remainingValue = assetCost
      let accumulatedDepreciation = 0

      for (let year = 1; year <= usefulLife; year++) {
        const factor = (usefulLife - year + 1) / sumOfYears
        const yearlyDepreciation = depreciableAmount * factor

        remainingValue -= yearlyDepreciation
        accumulatedDepreciation += yearlyDepreciation

        schedule.push({
          year,
          depreciation: yearlyDepreciation,
          accumulatedDepreciation,
          bookValue: remainingValue,
        })
      }
    }

    setDepreciationSchedule(schedule)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset-cost">Asset Cost ($)</Label>
              <Input
                id="asset-cost"
                type="number"
                min="0"
                value={assetCost}
                onChange={(e) => setAssetCost(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salvage-value">Salvage Value ($)</Label>
              <Input
                id="salvage-value"
                type="number"
                min="0"
                max={assetCost}
                value={salvageValue}
                onChange={(e) => setSalvageValue(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="useful-life">Useful Life (years)</Label>
              <Input
                id="useful-life"
                type="number"
                min="1"
                max="50"
                value={usefulLife}
                onChange={(e) => setUsefulLife(Number.parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Depreciation Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select depreciation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight-line">Straight-Line</SelectItem>
                  <SelectItem value="double-declining">Double-Declining Balance</SelectItem>
                  <SelectItem value="sum-of-years">Sum-of-Years-Digits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Depreciation Summary</CardTitle>
              <CardDescription>Depreciable Amount: {formatCurrency(assetCost - salvageValue)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Annual Depreciation</p>
                  <p className="text-xl font-bold">{formatCurrency(annualDepreciation)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Book Value After {usefulLife} Years</p>
                  <p className="text-xl font-bold">{formatCurrency(salvageValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Year</th>
                  <th className="text-right p-2">Depreciation</th>
                  <th className="text-right p-2">Accumulated</th>
                  <th className="text-right p-2">Book Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">0</td>
                  <td className="text-right p-2">-</td>
                  <td className="text-right p-2">-</td>
                  <td className="text-right p-2">{formatCurrency(assetCost)}</td>
                </tr>
                {depreciationSchedule.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.year}</td>
                    <td className="text-right p-2">{formatCurrency(item.depreciation)}</td>
                    <td className="text-right p-2">{formatCurrency(item.accumulatedDepreciation)}</td>
                    <td className="text-right p-2">{formatCurrency(item.bookValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="chart">
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                bookValue: {
                  label: "Book Value",
                  color: "hsl(var(--chart-1))",
                },
                depreciation: {
                  label: "Annual Depreciation",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[{ year: 0, bookValue: assetCost, depreciation: 0 }, ...depreciationSchedule]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="bookValue" stroke="var(--color-bookValue)" name="Book Value" />
                  <Line
                    type="monotone"
                    dataKey="depreciation"
                    stroke="var(--color-depreciation)"
                    name="Annual Depreciation"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

