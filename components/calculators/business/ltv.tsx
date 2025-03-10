"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Info } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function LTVCalculator() {
  const [averagePurchaseValue, setAveragePurchaseValue] = useState(100)
  const [purchaseFrequency, setPurchaseFrequency] = useState(4)
  const [customerLifespan, setCustomerLifespan] = useState(3)
  const [acquisitionCost, setAcquisitionCost] = useState(50)
  const [retentionRate, setRetentionRate] = useState(70)
  const [profitMargin, setProfitMargin] = useState(30)
  const [discountRate, setDiscountRate] = useState(10)
  const [useSliders, setUseSliders] = useState(true)

  // Calculate LTV
  const calculateLTV = () => {
    // Simple LTV calculation
    const simpleLTV = averagePurchaseValue * purchaseFrequency * customerLifespan

    // LTV with profit margin
    const ltvWithMargin = simpleLTV * (profitMargin / 100)

    // LTV with retention rate
    const ltvWithRetention = averagePurchaseValue * purchaseFrequency * (1 / (1 - retentionRate / 100))

    // LTV with discount rate (Net Present Value calculation)
    let npvLTV = 0
    for (let year = 0; year < customerLifespan; year++) {
      const yearlyRevenue = averagePurchaseValue * purchaseFrequency * Math.pow(retentionRate / 100, year)
      const yearlyProfit = yearlyRevenue * (profitMargin / 100)
      npvLTV += yearlyProfit / Math.pow(1 + discountRate / 100, year)
    }

    // ROI calculation
    const roi = ((npvLTV - acquisitionCost) / acquisitionCost) * 100

    return {
      simpleLTV,
      ltvWithMargin,
      ltvWithRetention,
      npvLTV,
      roi,
      cac: acquisitionCost,
      ltvCacRatio: npvLTV / acquisitionCost,
    }
  }

  const results = calculateLTV()

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  // Prepare data for comparison chart
  const getComparisonData = () => {
    return [
      { name: "Simple LTV", value: results.simpleLTV },
      { name: "LTV with Margin", value: results.ltvWithMargin },
      { name: "LTV with Retention", value: results.ltvWithRetention },
      { name: "NPV LTV", value: results.npvLTV },
    ]
  }

  // Prepare data for projection chart
  const getProjectionData = () => {
    const data = []
    for (let year = 1; year <= Math.max(5, customerLifespan); year++) {
      const yearlyRevenue = averagePurchaseValue * purchaseFrequency * Math.pow(retentionRate / 100, year - 1)
      const yearlyProfit = yearlyRevenue * (profitMargin / 100)
      const discountedProfit = yearlyProfit / Math.pow(1 + discountRate / 100, year - 1)

      data.push({
        year: `Year ${year}`,
        revenue: yearlyRevenue,
        profit: yearlyProfit,
        npv: discountedProfit,
      })
    }
    return data
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="about">About LTV/CLV</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Customer Metrics</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="use-sliders">Use Sliders</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="use-sliders"
                      checked={useSliders}
                      onChange={(e) => setUseSliders(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="average-purchase-value">
                      Average Purchase Value: {formatCurrency(averagePurchaseValue)}
                    </Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="average-purchase-value-slider"
                      min={10}
                      max={1000}
                      step={10}
                      value={[averagePurchaseValue]}
                      onValueChange={(value) => setAveragePurchaseValue(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="average-purchase-value"
                      type="number"
                      value={averagePurchaseValue}
                      onChange={(e) => setAveragePurchaseValue(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="purchase-frequency">Purchase Frequency (per year): {purchaseFrequency}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="purchase-frequency-slider"
                      min={1}
                      max={52}
                      step={1}
                      value={[purchaseFrequency]}
                      onValueChange={(value) => setPurchaseFrequency(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="purchase-frequency"
                      type="number"
                      value={purchaseFrequency}
                      onChange={(e) => setPurchaseFrequency(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="customer-lifespan">Customer Lifespan (years): {customerLifespan}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="customer-lifespan-slider"
                      min={1}
                      max={10}
                      step={1}
                      value={[customerLifespan]}
                      onValueChange={(value) => setCustomerLifespan(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="customer-lifespan"
                      type="number"
                      value={customerLifespan}
                      onChange={(e) => setCustomerLifespan(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="acquisition-cost">
                      Customer Acquisition Cost (CAC): {formatCurrency(acquisitionCost)}
                    </Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="acquisition-cost-slider"
                      min={0}
                      max={500}
                      step={5}
                      value={[acquisitionCost]}
                      onValueChange={(value) => setAcquisitionCost(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="acquisition-cost"
                      type="number"
                      value={acquisitionCost}
                      onChange={(e) => setAcquisitionCost(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="retention-rate">Annual Retention Rate: {formatPercentage(retentionRate)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="retention-rate-slider"
                      min={0}
                      max={100}
                      step={1}
                      value={[retentionRate]}
                      onValueChange={(value) => setRetentionRate(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="retention-rate"
                      type="number"
                      value={retentionRate}
                      onChange={(e) => setRetentionRate(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="profit-margin">Profit Margin: {formatPercentage(profitMargin)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="profit-margin-slider"
                      min={0}
                      max={100}
                      step={1}
                      value={[profitMargin]}
                      onValueChange={(value) => setProfitMargin(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="profit-margin"
                      type="number"
                      value={profitMargin}
                      onChange={(e) => setProfitMargin(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="discount-rate">Discount Rate: {formatPercentage(discountRate)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="discount-rate-slider"
                      min={0}
                      max={30}
                      step={0.5}
                      value={[discountRate]}
                      onValueChange={(value) => setDiscountRate(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="discount-rate"
                      type="number"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(Number(e.target.value))}
                      className="mt-1"
                      step="0.5"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">LTV Results</h2>

              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Customer Lifetime Value (NPV)</div>
                    <div className="text-3xl font-bold text-primary flex items-center">
                      {formatCurrency(results.npvLTV)}
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Net Present Value of future customer profits</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">LTV:CAC Ratio</div>
                    <div className="text-2xl font-bold">{results.ltvCacRatio.toFixed(2)}:1</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {results.ltvCacRatio >= 3
                        ? "Excellent"
                        : results.ltvCacRatio >= 2
                          ? "Good"
                          : results.ltvCacRatio >= 1
                            ? "Acceptable"
                            : "Poor"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">ROI on Customer Acquisition</div>
                    <div className="text-2xl font-bold">{results.roi.toFixed(1)}%</div>
                  </CardContent>
                </Card>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">LTV Calculation Methods</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Simple LTV:</span>
                      <span className="font-medium">{formatCurrency(results.simpleLTV)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LTV with Profit Margin:</span>
                      <span className="font-medium">{formatCurrency(results.ltvWithMargin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LTV with Retention:</span>
                      <span className="font-medium">{formatCurrency(results.ltvWithRetention)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NPV LTV:</span>
                      <span className="font-medium">{formatCurrency(results.npvLTV)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">LTV Comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getComparisonData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Value"]} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Customer Value Projection</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getProjectionData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Value"]} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" />
                    <Line type="monotone" dataKey="npv" stroke="#f59e0b" name="NPV" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <div className="prose max-w-none">
            <h3>What is Customer Lifetime Value (CLV/LTV)?</h3>
            <p>
              Customer Lifetime Value (CLV), also known as Lifetime Value (LTV), is a prediction of the net profit
              attributed to the entire future relationship with a customer. It's a crucial metric that helps businesses
              understand the long-term value of acquiring and retaining customers.
            </p>

            <h3>Why LTV Matters</h3>
            <p>Understanding LTV helps businesses make informed decisions about:</p>
            <ul>
              <li>How much to spend on customer acquisition</li>
              <li>Which customer segments to focus on</li>
              <li>How to optimize marketing and retention strategies</li>
              <li>Forecasting future revenue and business growth</li>
            </ul>

            <h3>Calculation Methods</h3>
            <p>There are several ways to calculate LTV, from simple to complex:</p>

            <h4>1. Simple LTV</h4>
            <pre className="bg-muted p-4 rounded-md text-foreground">
              Simple LTV = Average Purchase Value × Purchase Frequency × Customer Lifespan
            </pre>

            <h4>2. LTV with Profit Margin</h4>
            <pre className="bg-muted p-4 rounded-md text-foreground">LTV with Margin = Simple LTV × Profit Margin</pre>

            <h4>3. LTV with Retention Rate</h4>
            <pre className="bg-muted p-4 rounded-md text-foreground">
              LTV with Retention = Average Purchase Value × Purchase Frequency × (1 / (1 - Retention Rate))
            </pre>

            <h4>4. Net Present Value (NPV) LTV</h4>
            <p>This method accounts for the time value of money by discounting future cash flows:</p>
            <pre className="bg-muted p-4 rounded-md text-foreground">
              NPV LTV = Sum of (Yearly Profit / (1 + Discount Rate)^Year) for each year in the customer lifespan
            </pre>

            <h3>LTV:CAC Ratio</h3>
            <p>The LTV:CAC ratio compares the lifetime value of a customer to the cost of acquiring that customer:</p>
            <pre className="bg-muted p-4 rounded-md text-foreground">
              LTV:CAC Ratio = Customer Lifetime Value / Customer Acquisition Cost
            </pre>
            <p>
              A healthy business typically aims for an LTV:CAC ratio of 3:1 or higher, meaning the customer generates 3
              times more value than it costs to acquire them.
            </p>

            <h3>Improving LTV</h3>
            <p>Businesses can improve LTV by:</p>
            <ul>
              <li>Increasing average purchase value (upselling, cross-selling)</li>
              <li>Increasing purchase frequency (engagement, loyalty programs)</li>
              <li>Improving customer retention (better service, personalization)</li>
              <li>Reducing costs to improve profit margins</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

