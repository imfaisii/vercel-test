"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

// Format percentage
const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`
}

// Format large numbers for Y axis
const formatYAxisValue = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value}`
}

export default function DividendYieldCalculator() {
  // Initial state
  const [initialInvestment, setInitialInvestment] = useState<number>(10000)
  const [stockPrice, setStockPrice] = useState<number>(100)
  const [dividendPerShare, setDividendPerShare] = useState<number>(3.5)
  const [dividendGrowthRate, setDividendGrowthRate] = useState<number>(5)
  const [shareGrowthRate, setShareGrowthRate] = useState<number>(2)
  const [years, setYears] = useState<number>(20)
  const [reinvestDividends, setReinvestDividends] = useState<boolean>(true)
  const [adjustForInflation, setAdjustForInflation] = useState<boolean>(false)
  const [inflationRate, setInflationRate] = useState<number>(2.5)

  // Calculated values
  const [dividendYield, setDividendYield] = useState<number>(0)
  const [initialShares, setInitialShares] = useState<number>(0)
  const [projectionData, setProjectionData] = useState<any[]>([])
  const [totalDividends, setTotalDividends] = useState<number>(0)
  const [finalValue, setFinalValue] = useState<number>(0)

  // Calculate initial values and projections
  useEffect(() => {
    // Calculate initial dividend yield
    const yield_ = (dividendPerShare / stockPrice) * 100
    setDividendYield(yield_)

    // Calculate initial shares
    const shares = initialInvestment / stockPrice
    setInitialShares(shares)

    // Generate projection data
    const data = []
    let currentShares = shares
    let currentDividendPerShare = dividendPerShare
    let totalDividendsReceived = 0
    let currentStockPrice = stockPrice

    for (let year = 1; year <= years; year++) {
      // Calculate dividends for the year
      const dividendsForYear = currentShares * currentDividendPerShare
      totalDividendsReceived += dividendsForYear

      // Increase dividend per share by growth rate
      currentDividendPerShare *= 1 + dividendGrowthRate / 100

      // Increase stock price (simplified model)
      currentStockPrice *= 1 + shareGrowthRate / 100

      // Reinvest dividends if enabled
      if (reinvestDividends) {
        const newShares = dividendsForYear / currentStockPrice
        currentShares += newShares
      }

      // Calculate portfolio value
      const portfolioValue = currentShares * currentStockPrice

      // Adjust for inflation if enabled
      let adjustedDividends = totalDividendsReceived
      let adjustedPortfolioValue = portfolioValue

      if (adjustForInflation) {
        const inflationFactor = Math.pow(1 + inflationRate / 100, year)
        adjustedDividends = totalDividendsReceived / inflationFactor
        adjustedPortfolioValue = portfolioValue / inflationFactor
      }

      data.push({
        year,
        shares: currentShares,
        dividendPerShare: currentDividendPerShare,
        dividendsForYear,
        cumulativeDividends: totalDividendsReceived,
        portfolioValue,
        adjustedDividends,
        adjustedPortfolioValue,
        stockPrice: currentStockPrice,
      })
    }

    setProjectionData(data)
    setTotalDividends(totalDividendsReceived)
    setFinalValue(currentShares * currentStockPrice)
  }, [
    initialInvestment,
    stockPrice,
    dividendPerShare,
    dividendGrowthRate,
    shareGrowthRate,
    years,
    reinvestDividends,
    adjustForInflation,
    inflationRate,
  ])

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="investment">Initial Investment ($)</Label>
                  <Input
                    id="investment"
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="stockPrice">Stock Price ($)</Label>
                  <Input
                    id="stockPrice"
                    type="number"
                    value={stockPrice}
                    onChange={(e) => setStockPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="dividendPerShare">Annual Dividend Per Share ($)</Label>
                  <Input
                    id="dividendPerShare"
                    type="number"
                    step="0.01"
                    value={dividendPerShare}
                    onChange={(e) => setDividendPerShare(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="dividendGrowth">Annual Dividend Growth Rate (%)</Label>
                  <Input
                    id="dividendGrowth"
                    type="number"
                    step="0.1"
                    value={dividendGrowthRate}
                    onChange={(e) => setDividendGrowthRate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="shareGrowth">Annual Share Price Growth Rate (%)</Label>
                  <Input
                    id="shareGrowth"
                    type="number"
                    step="0.1"
                    value={shareGrowthRate}
                    onChange={(e) => setShareGrowthRate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="years">Investment Period (Years)</Label>
                  <Input
                    id="years"
                    type="number"
                    min="1"
                    max="50"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="reinvest" checked={reinvestDividends} onCheckedChange={setReinvestDividends} />
                  <Label htmlFor="reinvest">Reinvest Dividends</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="inflation" checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
                  <Label htmlFor="inflation">Adjust for Inflation</Label>
                </div>

                {adjustForInflation && (
                  <div>
                    <Label htmlFor="inflationRate">Annual Inflation Rate (%)</Label>
                    <Input
                      id="inflationRate"
                      type="number"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Dividend Summary</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between">
                      <span>Initial Investment</span>
                      <span className="font-medium">{formatCurrency(initialInvestment)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Initial Shares</span>
                      <span className="font-medium">{initialShares.toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Current Dividend Yield</span>
                      <span className="font-medium text-green-600">{formatPercent(dividendYield)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Annual Dividend Income</span>
                      <span className="font-medium">{formatCurrency(initialShares * dividendPerShare)}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Projection Summary</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between">
                      <span>Total Dividends ({years} years)</span>
                      <span className="font-medium text-green-600">{formatCurrency(totalDividends)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Final Portfolio Value</span>
                      <span className="font-medium">{formatCurrency(finalValue)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Total Return</span>
                      <span className="font-medium">
                        {formatPercent(((finalValue + totalDividends) / initialInvestment - 1) * 100)}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Final Shares {reinvestDividends ? "(with reinvestment)" : ""}</span>
                      <span className="font-medium">
                        {projectionData.length > 0
                          ? projectionData[projectionData.length - 1].shares.toFixed(2)
                          : initialShares.toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Dividend Aristocrats</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Companies that have increased dividends for 25+ consecutive years:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>Johnson & Johnson (JNJ): ~2.6% yield</li>
                    <li>Procter & Gamble (PG): ~2.4% yield</li>
                    <li>Coca-Cola (KO): ~3.0% yield</li>
                    <li>Walmart (WMT): ~1.4% yield</li>
                    <li>McDonald's (MCD): ~2.2% yield</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Yields are approximate and subject to change.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="pt-4">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={!adjustForInflation ? "bg-primary/10" : ""}
                  onClick={() => setAdjustForInflation(false)}
                >
                  Nominal Values
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={adjustForInflation ? "bg-primary/10" : ""}
                  onClick={() => setAdjustForInflation(true)}
                >
                  Inflation Adjusted
                </Button>
              </div>

              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    portfolioValue: {
                      label: "Portfolio Value",
                      color: "hsl(142, 76%, 36%)",
                    },
                    cumulativeDividends: {
                      label: "Cumulative Dividends",
                      color: "hsl(245, 58%, 51%)",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionData} margin={{ top: 20, right: 30, left: 70, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="year"
                        label={{ value: "Year", position: "insideBottomRight", offset: -10, dy: 10 }}
                        tickCount={Math.min(10, years)}
                        type="number"
                        allowDecimals={false}
                        domain={[1, years]}
                      />
                      <YAxis
                        tickFormatter={formatYAxisValue}
                        width={70}
                        label={{ value: "Value ($)", angle: -90, position: "insideLeft", dx: -10 }}
                      />
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Area
                        type="monotone"
                        dataKey={adjustForInflation ? "adjustedPortfolioValue" : "portfolioValue"}
                        name="Portfolio Value"
                        stroke="hsl(142, 76%, 36%)"
                        fill="hsl(142, 76%, 36%)"
                        fillOpacity={0.3}
                        stackId="1"
                      />
                      <Area
                        type="monotone"
                        dataKey={adjustForInflation ? "adjustedDividends" : "cumulativeDividends"}
                        name="Cumulative Dividends"
                        stroke="hsl(245, 58%, 51%)"
                        fill="hsl(245, 58%, 51%)"
                        fillOpacity={0.3}
                        stackId="1"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    dividendsForYear: {
                      label: "Annual Dividend Income",
                      color: "hsl(245, 58%, 51%)",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectionData.filter(
                        (_, i) => i % Math.ceil(years / 10) === 0 || i === projectionData.length - 1,
                      )}
                      margin={{ top: 20, right: 30, left: 70, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="year"
                        label={{ value: "Year", position: "insideBottomRight", offset: -10, dy: 10 }}
                      />
                      <YAxis
                        tickFormatter={formatYAxisValue}
                        width={70}
                        label={{ value: "Annual Dividend Income ($)", angle: -90, position: "insideLeft", dx: -10 }}
                      />
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="dividendsForYear" name="Annual Dividend Income" fill="hsl(245, 58%, 51%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Year</th>
                    <th className="p-2 text-right">Shares</th>
                    <th className="p-2 text-right">Stock Price</th>
                    <th className="p-2 text-right">Dividend/Share</th>
                    <th className="p-2 text-right">Annual Dividends</th>
                    <th className="p-2 text-right">Cumulative Dividends</th>
                    <th className="p-2 text-right">Portfolio Value</th>
                    <th className="p-2 text-right">Total Return</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData
                    .filter((_, i) => i % Math.ceil(years / 20) === 0 || i === projectionData.length - 1)
                    .map((data) => {
                      const totalReturn =
                        ((data.portfolioValue + data.cumulativeDividends) / initialInvestment - 1) * 100
                      return (
                        <tr key={data.year} className="border-b border-muted-foreground/20">
                          <td className="p-2">{data.year}</td>
                          <td className="p-2 text-right">{data.shares.toFixed(2)}</td>
                          <td className="p-2 text-right">{formatCurrency(data.stockPrice)}</td>
                          <td className="p-2 text-right">{formatCurrency(data.dividendPerShare)}</td>
                          <td className="p-2 text-right">{formatCurrency(data.dividendsForYear)}</td>
                          <td className="p-2 text-right">{formatCurrency(data.cumulativeDividends)}</td>
                          <td className="p-2 text-right">{formatCurrency(data.portfolioValue)}</td>
                          <td className="p-2 text-right">{formatPercent(totalReturn)}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                * This table shows selected years from the projection period. The final row shows the end of the
                investment period.
              </p>
              <p>
                * Dividend reinvestment assumes dividends are reinvested at the end of each year at the then-current
                stock price.
              </p>
              {adjustForInflation && <p>* Values are adjusted for inflation at {inflationRate}% per year.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

