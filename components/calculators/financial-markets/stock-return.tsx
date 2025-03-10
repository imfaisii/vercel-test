"use client"

import { useState, useMemo } from "react"
import { Calculator } from "@/components/calculator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export default function StockReturnCalculator() {
  // Basic inputs
  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [additionalContribution, setAdditionalContribution] = useState(200)
  const [contributionFrequency, setContributionFrequency] = useState("monthly")
  const [years, setYears] = useState(20)
  const [annualReturn, setAnnualReturn] = useState(8)
  const [dividendYield, setDividendYield] = useState(2)
  const [reinvestDividends, setReinvestDividends] = useState(true)
  const [inflationRate, setInflationRate] = useState(2.5)
  const [showInflationAdjusted, setShowInflationAdjusted] = useState(false)

  // Calculate results
  const calculateResults = useMemo(() => {
    try {
      // Convert annual rates to decimal
      const annualReturnRate = annualReturn / 100
      const dividendYieldRate = dividendYield / 100
      const inflationRateDecimal = inflationRate / 100

      // Determine number of contributions per year
      const contributionsPerYear =
        contributionFrequency === "monthly"
          ? 12
          : contributionFrequency === "quarterly"
            ? 4
            : contributionFrequency === "annually"
              ? 1
              : 0

      // Calculate total contribution amount per year
      const yearlyContribution = additionalContribution * contributionsPerYear

      // Initialize data arrays for chart
      const chartData = []

      // Initialize tracking variables
      let totalContributions = initialInvestment
      let totalValue = initialInvestment
      let totalDividends = 0
      let totalGrowth = 0

      // Calculate year by year
      for (let year = 0; year <= years; year++) {
        if (year === 0) {
          // Initial year (just the initial investment)
          chartData.push({
            year,
            totalValue,
            principal: totalContributions,
            growth: 0,
            dividends: 0,
            inflationAdjustedValue: totalValue,
          })
          continue
        }

        // Calculate growth for the year (excluding dividends)
        const growthForYear = totalValue * annualReturnRate
        totalGrowth += growthForYear

        // Calculate dividends for the year
        const dividendsForYear = totalValue * dividendYieldRate
        totalDividends += dividendsForYear

        // Add contributions for the year
        totalContributions += yearlyContribution

        // Update total value based on growth, dividends, and contributions
        if (reinvestDividends) {
          // If reinvesting dividends, they contribute to compound growth
          totalValue = totalValue + growthForYear + dividendsForYear + yearlyContribution
        } else {
          // If not reinvesting, dividends are taken out
          totalValue = totalValue + growthForYear + yearlyContribution
        }

        // Calculate inflation-adjusted value
        const inflationAdjustedValue = totalValue / Math.pow(1 + inflationRateDecimal, year)

        // Add data point for the chart
        chartData.push({
          year,
          totalValue,
          principal: totalContributions,
          growth: totalValue - totalContributions,
          dividends: reinvestDividends ? null : totalDividends,
          inflationAdjustedValue,
        })
      }

      // Calculate final results
      const finalValue = chartData[years].totalValue
      const totalReturn = (finalValue / totalContributions - 1) * 100
      const annualizedReturn = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100
      const inflationAdjustedValue = chartData[years].inflationAdjustedValue
      const inflationAdjustedReturn = (inflationAdjustedValue / totalContributions - 1) * 100

      return {
        chartData,
        finalValue,
        totalContributions,
        totalReturn,
        annualizedReturn,
        inflationAdjustedValue,
        inflationAdjustedReturn,
      }
    } catch (error) {
      console.error("Error calculating results:", error)
      return {
        chartData: [],
        finalValue: 0,
        totalContributions: 0,
        totalReturn: 0,
        annualizedReturn: 0,
        inflationAdjustedValue: 0,
        inflationAdjustedReturn: 0,
      }
    }
  }, [
    initialInvestment,
    additionalContribution,
    contributionFrequency,
    years,
    annualReturn,
    dividendYield,
    reinvestDividends,
    inflationRate,
  ])

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format currency for y-axis (compact for large numbers)
  const formatYAxisValue = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    } else {
      return `$${value}`
    }
  }

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null

    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-medium">Year {label}</div>
          </div>
          <div className="grid gap-1">
            {payload.map((item) => {
              if (item.value === null) return null

              return (
                <div key={item.dataKey} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="text-xs font-medium">{formatCurrency(item.value)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Calculator>
      <Calculator.Input>
        <div className="space-y-4">
          <div>
            <Label htmlFor="initial-investment">Initial Investment</Label>
            <Input
              id="initial-investment"
              type="number"
              min="100"
              step="100"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="additional-contribution">Additional Contribution</Label>
              <Input
                id="additional-contribution"
                type="number"
                min="0"
                step="50"
                value={additionalContribution}
                onChange={(e) => setAdditionalContribution(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="contribution-frequency">Frequency</Label>
              <Select value={contributionFrequency} onValueChange={setContributionFrequency}>
                <SelectTrigger id="contribution-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <Label htmlFor="years">Investment Period (Years)</Label>
              <span className="text-sm">{years} years</span>
            </div>
            <Slider
              id="years"
              min={1}
              max={50}
              step={1}
              value={[years]}
              onValueChange={(value) => setYears(value[0])}
              className="my-2"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <Label htmlFor="annual-return">Annual Return (%)</Label>
              <span className="text-sm">{annualReturn}%</span>
            </div>
            <Slider
              id="annual-return"
              min={0}
              max={20}
              step={0.5}
              value={[annualReturn]}
              onValueChange={(value) => setAnnualReturn(value[0])}
              className="my-2"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <Label htmlFor="dividend-yield">Dividend Yield (%)</Label>
              <span className="text-sm">{dividendYield}%</span>
            </div>
            <Slider
              id="dividend-yield"
              min={0}
              max={10}
              step={0.1}
              value={[dividendYield]}
              onValueChange={(value) => setDividendYield(value[0])}
              className="my-2"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="reinvest-dividends" checked={reinvestDividends} onCheckedChange={setReinvestDividends} />
            <Label htmlFor="reinvest-dividends">Reinvest Dividends</Label>
          </div>

          <div>
            <div className="flex justify-between">
              <Label htmlFor="inflation-rate">Inflation Rate (%)</Label>
              <span className="text-sm">{inflationRate}%</span>
            </div>
            <Slider
              id="inflation-rate"
              min={0}
              max={10}
              step={0.1}
              value={[inflationRate]}
              onValueChange={(value) => setInflationRate(value[0])}
              className="my-2"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="show-inflation-adjusted"
              checked={showInflationAdjusted}
              onCheckedChange={setShowInflationAdjusted}
            />
            <Label htmlFor="show-inflation-adjusted">Show Inflation-Adjusted Values</Label>
          </div>
        </div>
      </Calculator.Input>

      <Calculator.Output>
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="chart">Growth Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Final Investment Value</h3>
                  <p className="text-2xl font-bold">{formatCurrency(calculateResults.finalValue)}</p>
                  {showInflationAdjusted && (
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(calculateResults.inflationAdjustedValue)} after inflation
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Contributions</h3>
                  <p className="text-2xl font-bold">{formatCurrency(calculateResults.totalContributions)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(calculateResults.finalValue - calculateResults.totalContributions)} in growth
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Return</h3>
                  <p className="text-2xl font-bold">{calculateResults.totalReturn.toFixed(2)}%</p>
                  {showInflationAdjusted && (
                    <p className="text-sm text-muted-foreground">
                      {calculateResults.inflationAdjustedReturn.toFixed(2)}% after inflation
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Annualized Return</h3>
                  <p className="text-2xl font-bold">{calculateResults.annualizedReturn.toFixed(2)}%</p>
                  <p className="text-sm text-muted-foreground">Compound annual growth rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="h-[300px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={calculateResults.chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{ value: "Years", position: "insideBottom", offset: -5 }}
                    tickCount={6}
                    domain={[0, "dataMax"]}
                    type="number"
                    allowDecimals={false}
                  />
                  <YAxis tickFormatter={formatYAxisValue} width={60} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="principal"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    name="Principal"
                  />
                  <Area
                    type="monotone"
                    dataKey="growth"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    name="Growth"
                  />
                  {showInflationAdjusted && (
                    <Area
                      type="monotone"
                      dataKey="inflationAdjustedValue"
                      stroke="hsl(var(--destructive))"
                      fill="none"
                      strokeDasharray="5 5"
                      name="Inflation-Adjusted"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="pt-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={calculateResults.chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{ value: "Years", position: "insideBottom", offset: -5 }}
                    tickCount={10}
                    domain={[0, "dataMax"]}
                    type="number"
                    allowDecimals={false}
                  />
                  <YAxis tickFormatter={formatYAxisValue} width={60} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="principal"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    name="Principal"
                  />
                  <Area
                    type="monotone"
                    dataKey="growth"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    name="Growth"
                  />
                  {showInflationAdjusted && (
                    <Area
                      type="monotone"
                      dataKey="inflationAdjustedValue"
                      stroke="hsl(var(--destructive))"
                      fill="none"
                      strokeDasharray="5 5"
                      name="Inflation-Adjusted"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Investment Growth Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Year</th>
                      <th className="text-right py-2">Principal</th>
                      <th className="text-right py-2">Growth</th>
                      <th className="text-right py-2">Total Value</th>
                      {showInflationAdjusted && <th className="text-right py-2">Inflation-Adjusted</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {calculateResults.chartData
                      .filter((_, index) => index % 5 === 0 || index === calculateResults.chartData.length - 1)
                      .map((data) => (
                        <tr key={data.year} className="border-b">
                          <td className="py-2">{data.year}</td>
                          <td className="text-right py-2">{formatCurrency(data.principal)}</td>
                          <td className="text-right py-2">{formatCurrency(data.growth)}</td>
                          <td className="text-right py-2">{formatCurrency(data.totalValue)}</td>
                          {showInflationAdjusted && (
                            <td className="text-right py-2">{formatCurrency(data.inflationAdjustedValue)}</td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            This calculator provides estimates based on constant returns. Actual market returns vary year to year and
            may differ significantly from these projections.
          </p>
        </div>
      </Calculator.Output>
    </Calculator>
  )
}

