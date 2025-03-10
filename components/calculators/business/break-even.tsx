"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState<number>(10000)
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(5)
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState<number>(15)
  const [breakEvenUnits, setBreakEvenUnits] = useState<number>(0)
  const [breakEvenRevenue, setBreakEvenRevenue] = useState<number>(0)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    calculateBreakEven()
  }, [fixedCosts, variableCostPerUnit, sellingPricePerUnit])

  const calculateBreakEven = () => {
    // Break-even point in units = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit)
    const contributionMargin = sellingPricePerUnit - variableCostPerUnit

    if (contributionMargin <= 0) {
      setBreakEvenUnits(Number.POSITIVE_INFINITY)
      setBreakEvenRevenue(Number.POSITIVE_INFINITY)
      setChartData([])
      return
    }

    const units = fixedCosts / contributionMargin
    setBreakEvenUnits(Math.ceil(units))
    setBreakEvenRevenue(Math.ceil(units) * sellingPricePerUnit)

    // Generate chart data
    generateChartData(Math.ceil(units))
  }

  const generateChartData = (breakEvenPoint: number) => {
    const data = []
    const maxUnits = breakEvenPoint * 2

    for (let units = 0; units <= maxUnits; units += Math.ceil(maxUnits / 10)) {
      const revenue = units * sellingPricePerUnit
      const totalCosts = fixedCosts + units * variableCostPerUnit
      const profit = revenue - totalCosts

      data.push({
        units,
        revenue,
        totalCosts,
        profit,
      })
    }

    // Add the break-even point specifically
    data.push({
      units: breakEvenPoint,
      revenue: breakEvenPoint * sellingPricePerUnit,
      totalCosts: fixedCosts + breakEvenPoint * variableCostPerUnit,
      profit: 0,
    })

    // Sort the data by units
    data.sort((a, b) => a.units - b.units)

    setChartData(data)
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="chart">Break-Even Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="fixed-costs">Fixed Costs ($)</Label>
              <Input
                id="fixed-costs"
                type="number"
                min="0"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable-cost">Variable Cost per Unit ($)</Label>
              <Input
                id="variable-cost"
                type="number"
                min="0"
                step="0.01"
                value={variableCostPerUnit}
                onChange={(e) => setVariableCostPerUnit(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="selling-price">Selling Price per Unit ($)</Label>
              <Input
                id="selling-price"
                type="number"
                min="0"
                step="0.01"
                value={sellingPricePerUnit}
                onChange={(e) => setSellingPricePerUnit(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Break-Even Analysis</CardTitle>
              <CardDescription>
                Contribution Margin: {formatCurrency(sellingPricePerUnit - variableCostPerUnit)} per unit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Break-Even Point (Units)</p>
                  <p className="text-2xl font-bold">
                    {breakEvenUnits === Number.POSITIVE_INFINITY ? "N/A" : breakEvenUnits.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Break-Even Revenue</p>
                  <p className="text-2xl font-bold">
                    {breakEvenRevenue === Number.POSITIVE_INFINITY ? "N/A" : formatCurrency(breakEvenRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          {chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  totalCosts: {
                    label: "Total Costs",
                    color: "hsl(var(--chart-2))",
                  },
                  profit: {
                    label: "Profit",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="units"
                      label={{ value: "Units Sold", position: "insideBottomRight", offset: -10 }}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${value}`}
                      label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" name="Revenue" />
                    <Line type="monotone" dataKey="totalCosts" stroke="var(--color-totalCosts)" name="Total Costs" />
                    <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-muted-foreground">
                {sellingPricePerUnit <= variableCostPerUnit
                  ? "Break-even point cannot be calculated when selling price is less than or equal to variable cost."
                  : "No data available. Please enter valid values."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

