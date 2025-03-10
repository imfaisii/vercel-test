"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Info } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Asset class types and colors
const ASSET_CLASSES = [
  { name: "Stocks", color: "hsl(var(--chart-1))" },
  { name: "Bonds", color: "hsl(var(--chart-2))" },
  { name: "Cash", color: "hsl(var(--chart-3))" },
  { name: "Real Estate", color: "hsl(var(--chart-4))" },
  { name: "Commodities", color: "hsl(var(--chart-5))" },
]

// Risk profiles
const RISK_PROFILES = {
  conservative: [20, 50, 20, 5, 5],
  moderate: [40, 30, 10, 15, 5],
  aggressive: [70, 10, 5, 10, 5],
  custom: [20, 20, 20, 20, 20],
}

type RiskProfile = "conservative" | "moderate" | "aggressive" | "custom"

export default function PortfolioAllocationCalculator() {
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("moderate")
  const [allocation, setAllocation] = useState<number[]>(RISK_PROFILES.moderate)
  const [totalInvestment, setTotalInvestment] = useState<number>(100000)
  const [expectedReturns, setExpectedReturns] = useState<number[]>([8, 3, 1, 6, 4])
  const [portfolioReturn, setPortfolioReturn] = useState<number>(0)
  const [portfolioRisk, setPortfolioRisk] = useState<number>(0)

  // Risk levels for each asset class (standard deviation)
  const riskLevels = [15, 5, 1, 12, 20]

  // Update allocation when risk profile changes
  useEffect(() => {
    if (riskProfile !== "custom") {
      setAllocation(RISK_PROFILES[riskProfile])
    }
  }, [riskProfile])

  // Calculate portfolio return and risk
  useEffect(() => {
    // Calculate weighted average return
    const weightedReturn = allocation.reduce((sum, value, index) => sum + (value / 100) * expectedReturns[index], 0)

    // Calculate portfolio risk (simplified)
    const weightedRisk = allocation.reduce((sum, value, index) => sum + (value / 100) * riskLevels[index], 0)

    setPortfolioReturn(weightedReturn)
    setPortfolioRisk(weightedRisk)
  }, [allocation, expectedReturns])

  // Handle slider changes
  const handleSliderChange = (index: number, value: number[]) => {
    setRiskProfile("custom")
    const newAllocation = [...allocation]

    // Calculate the difference
    const diff = value[0] - newAllocation[index]

    // Adjust other allocations proportionally
    if (diff !== 0) {
      const otherIndices = Array.from({ length: 5 }, (_, i) => i).filter((i) => i !== index)
      const totalOther = otherIndices.reduce((sum, i) => sum + newAllocation[i], 0)

      if (totalOther > 0) {
        otherIndices.forEach((i) => {
          newAllocation[i] = Math.max(0, newAllocation[i] - (diff * newAllocation[i]) / totalOther)
        })
      }
    }

    newAllocation[index] = value[0]

    // Normalize to ensure sum is 100%
    const total = newAllocation.reduce((sum, val) => sum + val, 0)
    const normalized = newAllocation.map((val) => Math.round((val / total) * 100))

    // Adjust for rounding errors
    const roundingError = 100 - normalized.reduce((sum, val) => sum + val, 0)
    normalized[0] += roundingError

    setAllocation(normalized)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Prepare data for pie chart
  const chartData = allocation.map((value, index) => ({
    name: ASSET_CLASSES[index].name,
    value: value,
    amount: (totalInvestment * value) / 100,
  }))

  // Prepare data for growth projection chart
  const growthData = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1
    const value = totalInvestment * Math.pow(1 + portfolioReturn / 100, year)
    return {
      year,
      value: Math.round(value),
    }
  })

  // Get risk assessment text
  const getRiskAssessment = () => {
    if (portfolioRisk < 6) {
      return "Low Risk: This portfolio has relatively low volatility and is suitable for conservative investors."
    } else if (portfolioRisk < 12) {
      return "Moderate Risk: This portfolio balances growth potential with reasonable volatility."
    } else {
      return "High Risk: This portfolio has higher volatility but offers greater growth potential."
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Tabs defaultValue="allocation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="returns">Expected Returns</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="allocation" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="investment">Total Investment</Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">The total amount you plan to invest across all asset classes.</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="investment"
                    type="number"
                    min="1000"
                    step="1000"
                    value={totalInvestment}
                    onChange={(e) => setTotalInvestment(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Risk Profile</Label>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Conservative: Lower risk, lower returns
                            <br />
                            Moderate: Balanced risk and returns
                            <br />
                            Aggressive: Higher risk, higher potential returns
                            <br />
                            Custom: Your personalized allocation
                          </p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant={riskProfile === "conservative" ? "default" : "outline"}
                      onClick={() => setRiskProfile("conservative")}
                      className="w-full"
                    >
                      Conservative
                    </Button>
                    <Button
                      variant={riskProfile === "moderate" ? "default" : "outline"}
                      onClick={() => setRiskProfile("moderate")}
                      className="w-full"
                    >
                      Moderate
                    </Button>
                    <Button
                      variant={riskProfile === "aggressive" ? "default" : "outline"}
                      onClick={() => setRiskProfile("aggressive")}
                      className="w-full"
                    >
                      Aggressive
                    </Button>
                    <Button
                      variant={riskProfile === "custom" ? "default" : "outline"}
                      onClick={() => setRiskProfile("custom")}
                      className="w-full"
                    >
                      Custom
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {ASSET_CLASSES.map((assetClass, index) => (
                    <div key={assetClass.name} className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor={`slider-${assetClass.name}`}>{assetClass.name}</Label>
                        <span className="text-sm font-medium">{allocation[index]}%</span>
                      </div>
                      <Slider
                        id={`slider-${assetClass.name}`}
                        value={[allocation[index]]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => handleSliderChange(index, value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Portfolio Allocation</h3>
                </div>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={ASSET_CLASSES[index].color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${formatCurrency(props.payload.amount)} (${value}%)`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="returns" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Adjust the expected annual returns for each asset class. These are used to calculate your portfolio's
                  expected return.
                </p>

                {ASSET_CLASSES.map((assetClass, index) => (
                  <div key={assetClass.name} className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor={`return-${assetClass.name}`}>{assetClass.name}</Label>
                      <span className="text-sm font-medium">{expectedReturns[index]}%</span>
                    </div>
                    <Slider
                      id={`return-${assetClass.name}`}
                      value={[expectedReturns[index]]}
                      min={-5}
                      max={20}
                      step={0.5}
                      onValueChange={(value) => {
                        const newReturns = [...expectedReturns]
                        newReturns[index] = value[0]
                        setExpectedReturns(newReturns)
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Historical Average Returns</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>US Stocks (S&P 500)</span>
                      <span className="font-medium">10.0%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>US Bonds</span>
                      <span className="font-medium">3.5%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cash/Money Market</span>
                      <span className="font-medium">1.0%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Real Estate (REITs)</span>
                      <span className="font-medium">7.0%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Commodities</span>
                      <span className="font-medium">3.0%</span>
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Historical returns are not indicative of future results.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Risk Levels (Volatility)</h3>
                  <ul className="space-y-2">
                    {ASSET_CLASSES.map((assetClass, index) => (
                      <li key={assetClass.name} className="flex justify-between">
                        <span>{assetClass.name}</span>
                        <span className="font-medium">{riskLevels[index]}%</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Risk is measured as standard deviation of annual returns.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Portfolio Summary</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between">
                      <span>Total Investment</span>
                      <span className="font-medium">{formatCurrency(totalInvestment)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Expected Annual Return</span>
                      <span className="font-medium text-green-600">{portfolioReturn.toFixed(2)}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Expected Risk (Volatility)</span>
                      <span className="font-medium text-amber-600">{portfolioRisk.toFixed(2)}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Expected Annual Income</span>
                      <span className="font-medium">{formatCurrency((totalInvestment * portfolioReturn) / 100)}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Asset Allocation</h3>
                  <ul className="space-y-2">
                    {ASSET_CLASSES.map((assetClass, index) => (
                      <li key={assetClass.name} className="flex justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: assetClass.color }}
                          ></div>
                          <span>{assetClass.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency((totalInvestment * allocation[index]) / 100)}
                          </div>
                          <div className="text-xs text-muted-foreground">{allocation[index]}%</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Projected Growth (10 Years)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Assuming consistent annual returns and no additional contributions.
                  </p>

                  <div className="h-[200px] mb-4">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Portfolio Value",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growthData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
                          <YAxis
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            label={{ value: "Value ($)", angle: -90, position: "insideLeft" }}
                          />
                          <ChartTooltip
                            content={<ChartTooltipContent formatter={(value) => formatCurrency(value)} />}
                          />
                          <Line type="monotone" dataKey="value" stroke="var(--color-value)" name="Portfolio Value" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>

                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2">Year</th>
                        <th className="pb-2 text-right">Value</th>
                        <th className="pb-2 text-right">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {growthData.map((data) => {
                        const growth = data.value - totalInvestment
                        return (
                          <tr key={data.year} className="border-b border-muted-foreground/20">
                            <td className="py-2">Year {data.year}</td>
                            <td className="py-2 text-right">{formatCurrency(data.value)}</td>
                            <td className="py-2 text-right text-green-600">+{formatCurrency(growth)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Risk Assessment</h3>
                  <p className="text-sm mb-4">{getRiskAssessment()}</p>

                  <div className="mt-4">
                    <Label className="mb-2 block">Risk Level</Label>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (portfolioRisk / 20) * 100)}%`,
                          background: `linear-gradient(90deg, green, ${portfolioRisk < 10 ? "yellow" : "red"})`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Low</span>
                      <span>Moderate</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

