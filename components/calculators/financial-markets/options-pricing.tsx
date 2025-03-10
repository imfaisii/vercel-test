"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

// Black-Scholes Option Pricing Model
function calculateOptionPrice(
  stockPrice: number,
  strikePrice: number,
  timeToExpiration: number,
  volatility: number,
  riskFreeRate: number,
  dividendYield: number,
  isCall: boolean,
) {
  // Convert percentages to decimals
  const vol = volatility / 100
  const r = riskFreeRate / 100
  const q = dividendYield / 100

  // Calculate d1 and d2
  const d1 =
    (Math.log(stockPrice / strikePrice) + (r - q + (vol * vol) / 2) * timeToExpiration) /
    (vol * Math.sqrt(timeToExpiration))
  const d2 = d1 - vol * Math.sqrt(timeToExpiration)

  // Standard normal cumulative distribution function
  const cdf = (x: number) => {
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911

    const sign = x < 0 ? -1 : 1
    x = Math.abs(x) / Math.sqrt(2)

    const t = 1 / (1 + p * x)
    const erf = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return 0.5 * (1 + sign * erf)
  }

  if (isCall) {
    // Call option price
    return (
      stockPrice * Math.exp(-q * timeToExpiration) * cdf(d1) - strikePrice * Math.exp(-r * timeToExpiration) * cdf(d2)
    )
  } else {
    // Put option price
    return (
      strikePrice * Math.exp(-r * timeToExpiration) * cdf(-d2) - stockPrice * Math.exp(-q * timeToExpiration) * cdf(-d1)
    )
  }
}

// Calculate option Greeks
function calculateGreeks(
  stockPrice: number,
  strikePrice: number,
  timeToExpiration: number,
  volatility: number,
  riskFreeRate: number,
  dividendYield: number,
) {
  // Convert percentages to decimals
  const vol = volatility / 100
  const r = riskFreeRate / 100
  const q = dividendYield / 100

  // Calculate d1 and d2
  const d1 =
    (Math.log(stockPrice / strikePrice) + (r - q + (vol * vol) / 2) * timeToExpiration) /
    (vol * Math.sqrt(timeToExpiration))
  const d2 = d1 - vol * Math.sqrt(timeToExpiration)

  // Standard normal cumulative distribution function
  const cdf = (x: number) => {
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911

    const sign = x < 0 ? -1 : 1
    x = Math.abs(x) / Math.sqrt(2)

    const t = 1 / (1 + p * x)
    const erf = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return 0.5 * (1 + sign * erf)
  }

  // Standard normal probability density function
  const pdf = (x: number) => {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
  }

  // Calculate call option Greeks
  const callDelta = Math.exp(-q * timeToExpiration) * cdf(d1)
  const gamma = (Math.exp(-q * timeToExpiration) * pdf(d1)) / (stockPrice * vol * Math.sqrt(timeToExpiration))
  const callTheta =
    -((stockPrice * vol * Math.exp(-q * timeToExpiration) * pdf(d1)) / (2 * Math.sqrt(timeToExpiration))) -
    r * strikePrice * Math.exp(-r * timeToExpiration) * cdf(d2) +
    q * stockPrice * Math.exp(-q * timeToExpiration) * cdf(d1)
  const vega = (stockPrice * Math.exp(-q * timeToExpiration) * pdf(d1) * Math.sqrt(timeToExpiration)) / 100 // Divided by 100 to get per 1% change
  const callRho = (strikePrice * timeToExpiration * Math.exp(-r * timeToExpiration) * cdf(d2)) / 100 // Divided by 100 to get per 1% change

  // Calculate put option Greeks
  const putDelta = -Math.exp(-q * timeToExpiration) * cdf(-d1)
  const putTheta =
    -((stockPrice * vol * Math.exp(-q * timeToExpiration) * pdf(d1)) / (2 * Math.sqrt(timeToExpiration))) +
    r * strikePrice * Math.exp(-r * timeToExpiration) * cdf(-d2) -
    q * stockPrice * Math.exp(-q * timeToExpiration) * cdf(-d1)
  const putRho = (-strikePrice * timeToExpiration * Math.exp(-r * timeToExpiration) * cdf(-d2)) / 100 // Divided by 100 to get per 1% change

  return {
    call: {
      delta: callDelta,
      gamma: gamma,
      theta: callTheta / 365, // Convert to daily
      vega: vega,
      rho: callRho,
    },
    put: {
      delta: putDelta,
      gamma: gamma,
      theta: putTheta / 365, // Convert to daily
      vega: vega,
      rho: putRho,
    },
  }
}

export default function OptionsPricingCalculator() {
  // State for input parameters
  const [stockPrice, setStockPrice] = useState(100)
  const [strikePrice, setStrikePrice] = useState(100)
  const [timeToExpiration, setTimeToExpiration] = useState(1)
  const [volatility, setVolatility] = useState(20)
  const [riskFreeRate, setRiskFreeRate] = useState(3)
  const [dividendYield, setDividendYield] = useState(0)

  // State for chart variable selection
  const [chartVariable, setChartVariable] = useState("stockPrice")

  // State for calculated values
  const [callPrice, setCallPrice] = useState(0)
  const [putPrice, setPutPrice] = useState(0)
  const [greeks, setGreeks] = useState({
    call: { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 },
    put: { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 },
  })
  const [chartData, setChartData] = useState<any[]>([])

  // Calculate option prices and Greeks
  useEffect(() => {
    // Validate inputs to prevent calculation errors
    if (stockPrice <= 0 || strikePrice <= 0 || timeToExpiration <= 0 || volatility <= 0) {
      return
    }

    // Calculate option prices
    const call = calculateOptionPrice(
      stockPrice,
      strikePrice,
      timeToExpiration,
      volatility,
      riskFreeRate,
      dividendYield,
      true,
    )

    const put = calculateOptionPrice(
      stockPrice,
      strikePrice,
      timeToExpiration,
      volatility,
      riskFreeRate,
      dividendYield,
      false,
    )

    // Calculate Greeks
    const optionGreeks = calculateGreeks(
      stockPrice,
      strikePrice,
      timeToExpiration,
      volatility,
      riskFreeRate,
      dividendYield,
    )

    setCallPrice(call)
    setPutPrice(put)
    setGreeks(optionGreeks)

    // Generate chart data based on selected variable
    generateChartData()
  }, [stockPrice, strikePrice, timeToExpiration, volatility, riskFreeRate, dividendYield, chartVariable])

  // Generate chart data based on selected variable
  const generateChartData = () => {
    const data = []

    if (chartVariable === "stockPrice") {
      // Generate data for different stock prices
      const minPrice = stockPrice * 0.7
      const maxPrice = stockPrice * 1.3
      const step = (maxPrice - minPrice) / 20

      for (let price = minPrice; price <= maxPrice; price += step) {
        const call = calculateOptionPrice(
          price,
          strikePrice,
          timeToExpiration,
          volatility,
          riskFreeRate,
          dividendYield,
          true,
        )

        const put = calculateOptionPrice(
          price,
          strikePrice,
          timeToExpiration,
          volatility,
          riskFreeRate,
          dividendYield,
          false,
        )

        data.push({
          stockPrice: price.toFixed(2),
          callPrice: call.toFixed(2),
          putPrice: put.toFixed(2),
        })
      }
    } else if (chartVariable === "timeToExpiration") {
      // Generate data for different expiration times
      const maxTime = Math.min(timeToExpiration * 2, 2)
      const step = maxTime / 20

      for (let time = step; time <= maxTime; time += step) {
        const call = calculateOptionPrice(stockPrice, strikePrice, time, volatility, riskFreeRate, dividendYield, true)

        const put = calculateOptionPrice(stockPrice, strikePrice, time, volatility, riskFreeRate, dividendYield, false)

        data.push({
          timeToExpiration: time.toFixed(2),
          callPrice: call.toFixed(2),
          putPrice: put.toFixed(2),
        })
      }
    } else if (chartVariable === "volatility") {
      // Generate data for different volatility levels
      const minVol = Math.max(volatility * 0.5, 5)
      const maxVol = volatility * 2
      const step = (maxVol - minVol) / 20

      for (let vol = minVol; vol <= maxVol; vol += step) {
        const call = calculateOptionPrice(
          stockPrice,
          strikePrice,
          timeToExpiration,
          vol,
          riskFreeRate,
          dividendYield,
          true,
        )

        const put = calculateOptionPrice(
          stockPrice,
          strikePrice,
          timeToExpiration,
          vol,
          riskFreeRate,
          dividendYield,
          false,
        )

        data.push({
          volatility: vol.toFixed(1),
          callPrice: call.toFixed(2),
          putPrice: put.toFixed(2),
        })
      }
    }

    setChartData(data)
  }

  // Handle input changes with validation
  const handleStockPriceChange = (value: string) => {
    const price = Number.parseFloat(value)
    if (!isNaN(price) && price > 0) {
      setStockPrice(price)
    }
  }

  const handleStrikePriceChange = (value: string) => {
    const price = Number.parseFloat(value)
    if (!isNaN(price) && price > 0) {
      setStrikePrice(price)
    }
  }

  const handleTimeToExpirationChange = (value: string) => {
    const time = Number.parseFloat(value)
    if (!isNaN(time) && time > 0) {
      setTimeToExpiration(time)
    }
  }

  const handleVolatilityChange = (value: string) => {
    const vol = Number.parseFloat(value)
    if (!isNaN(vol) && vol > 0) {
      setVolatility(vol)
    }
  }

  const handleRiskFreeRateChange = (value: string) => {
    const rate = Number.parseFloat(value)
    if (!isNaN(rate) && rate >= 0) {
      setRiskFreeRate(rate)
    }
  }

  const handleDividendYieldChange = (value: string) => {
    const yield_ = Number.parseFloat(value)
    if (!isNaN(yield_) && yield_ >= 0) {
      setDividendYield(yield_)
    }
  }

  // Format numbers for display
  const formatNumber = (num: number, decimals = 2) => {
    return num.toFixed(decimals)
  }

  return (
    <Tabs defaultValue="calculator" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="calculator">Calculator</TabsTrigger>
        <TabsTrigger value="chart">Price Chart</TabsTrigger>
        <TabsTrigger value="results">Detailed Results</TabsTrigger>
      </TabsList>

      <TabsContent value="calculator">
        <Card>
          <CardHeader>
            <CardTitle>Options Pricing Calculator</CardTitle>
            <CardDescription>
              Calculate theoretical prices for call and put options using the Black-Scholes model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="stockPrice">Stock Price ($)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="stockPriceSlider"
                      min={1}
                      max={500}
                      step={1}
                      value={[stockPrice]}
                      onValueChange={(value) => setStockPrice(value[0])}
                      className="flex-1"
                    />
                    <Input
                      id="stockPrice"
                      type="number"
                      value={stockPrice}
                      onChange={(e) => handleStockPriceChange(e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strikePrice">Strike Price ($)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="strikePriceSlider"
                      min={1}
                      max={500}
                      step={1}
                      value={[strikePrice]}
                      onValueChange={(value) => setStrikePrice(value[0])}
                      className="flex-1"
                    />
                    <Input
                      id="strikePrice"
                      type="number"
                      value={strikePrice}
                      onChange={(e) => handleStrikePriceChange(e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeToExpiration">Time to Expiration (Years)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="timeToExpirationSlider"
                      min={0.01}
                      max={3}
                      step={0.01}
                      value={[timeToExpiration]}
                      onValueChange={(value) => setTimeToExpiration(value[0])}
                      className="flex-1"
                    />
                    <Input
                      id="timeToExpiration"
                      type="number"
                      value={timeToExpiration}
                      onChange={(e) => handleTimeToExpirationChange(e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="volatility">Volatility (%)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="volatilitySlider"
                      min={1}
                      max={100}
                      step={1}
                      value={[volatility]}
                      onValueChange={(value) => setVolatility(value[0])}
                      className="flex-1"
                    />
                    <Input
                      id="volatility"
                      type="number"
                      value={volatility}
                      onChange={(e) => handleVolatilityChange(e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="riskFreeRateSlider"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[riskFreeRate]}
                      onValueChange={(value) => setRiskFreeRate(value[0])}
                      className="flex-1"
                    />
                    <Input
                      id="riskFreeRate"
                      type="number"
                      value={riskFreeRate}
                      onChange={(e) => handleRiskFreeRateChange(e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dividendYield">Dividend Yield (%)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="dividendYieldSlider"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[dividendYield]}
                      onValueChange={(value) => setDividendYield(value[0])}
                      className="flex-1"
                    />
                    <Input
                      id="dividendYield"
                      type="number"
                      value={dividendYield}
                      onChange={(e) => handleDividendYieldChange(e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Call Option</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${formatNumber(callPrice)}</div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Delta:</span> {formatNumber(greeks.call.delta, 4)}
                    </div>
                    <div>
                      <span className="font-medium">Gamma:</span> {formatNumber(greeks.call.gamma, 4)}
                    </div>
                    <div>
                      <span className="font-medium">Theta:</span> {formatNumber(greeks.call.theta, 4)}
                    </div>
                    <div>
                      <span className="font-medium">Vega:</span> {formatNumber(greeks.call.vega, 4)}
                    </div>
                    <div>
                      <span className="font-medium">Rho:</span> {formatNumber(greeks.call.rho, 4)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Put Option</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${formatNumber(putPrice)}</div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Delta:</span> {formatNumber(greeks.put.delta, 4)}
                    </div>
                    <div>
                      <span className="font-medium">Gamma:</span> {formatNumber(greeks.put.gamma, 4)}
                    </div>
                    <div>
                      <span className="font-medium">Theta:</span> {formatNumber(greeks.put.theta, 4)}
                    </div>
                    <div>
                      <span className="font-medium">Vega:</span> {formatNumber(greeks.put.vega, 4)}
                    </div>
                    <div>
                      <span className="font-medium">Rho:</span> {formatNumber(greeks.put.rho, 4)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="chart">
        <Card>
          <CardHeader>
            <CardTitle>Option Price Sensitivity</CardTitle>
            <CardDescription>Visualize how option prices change as different variables change</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="chartVariable">Chart Variable</Label>
              <Select value={chartVariable} onValueChange={setChartVariable}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Select variable to chart" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stockPrice">Stock Price</SelectItem>
                  <SelectItem value="timeToExpiration">Time to Expiration</SelectItem>
                  <SelectItem value="volatility">Volatility</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-[400px] mt-6">
              <ChartContainer
                config={{
                  callPrice: {
                    label: "Call Option Price",
                    color: "hsl(var(--chart-1))",
                  },
                  putPrice: {
                    label: "Put Option Price",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={chartVariable}
                      label={{
                        value:
                          chartVariable === "stockPrice"
                            ? "Stock Price ($)"
                            : chartVariable === "timeToExpiration"
                              ? "Time to Expiration (Years)"
                              : "Volatility (%)",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis label={{ value: "Option Price ($)", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="callPrice"
                      stroke="var(--color-callPrice)"
                      name="Call Option"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="putPrice" stroke="var(--color-putPrice)" name="Put Option" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="results">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
            <CardDescription>Comprehensive breakdown of option prices and Greeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Input Parameters</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock Price:</span>
                    <span className="font-medium">${formatNumber(stockPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Strike Price:</span>
                    <span className="font-medium">${formatNumber(strikePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time to Expiration:</span>
                    <span className="font-medium">{formatNumber(timeToExpiration)} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volatility:</span>
                    <span className="font-medium">{formatNumber(volatility)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk-Free Rate:</span>
                    <span className="font-medium">{formatNumber(riskFreeRate)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dividend Yield:</span>
                    <span className="font-medium">{formatNumber(dividendYield)}%</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mt-8 mb-4">Option Prices</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Call Option Price:</span>
                    <span className="font-medium">${formatNumber(callPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Put Option Price:</span>
                    <span className="font-medium">${formatNumber(putPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Put-Call Parity:</span>
                    <span className="font-medium">
                      {Math.abs(
                        callPrice -
                          putPrice -
                          stockPrice +
                          strikePrice * Math.exp((-riskFreeRate / 100) * timeToExpiration),
                      ) < 0.01
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Option Greeks</h3>
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Call Option Greeks</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delta:</span>
                      <span className="font-medium">{formatNumber(greeks.call.delta, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gamma:</span>
                      <span className="font-medium">{formatNumber(greeks.call.gamma, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Theta (per day):</span>
                      <span className="font-medium">{formatNumber(greeks.call.theta, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vega (per 1% vol):</span>
                      <span className="font-medium">{formatNumber(greeks.call.vega, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rho (per 1% rate):</span>
                      <span className="font-medium">{formatNumber(greeks.call.rho, 4)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Put Option Greeks</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delta:</span>
                      <span className="font-medium">{formatNumber(greeks.put.delta, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gamma:</span>
                      <span className="font-medium">{formatNumber(greeks.put.gamma, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Theta (per day):</span>
                      <span className="font-medium">{formatNumber(greeks.put.theta, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vega (per 1% vol):</span>
                      <span className="font-medium">{formatNumber(greeks.put.vega, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rho (per 1% rate):</span>
                      <span className="font-medium">{formatNumber(greeks.put.rho, 4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

