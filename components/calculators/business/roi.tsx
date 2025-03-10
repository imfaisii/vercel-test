"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [netProfit, setNetProfit] = useState(15000)
  const [timeframe, setTimeframe] = useState(1)

  const [roi, setRoi] = useState(0)
  const [roiPercentage, setRoiPercentage] = useState(0)
  const [annualizedRoi, setAnnualizedRoi] = useState(0)

  const calculateROI = () => {
    // Calculate ROI
    const calculatedRoi = netProfit - initialInvestment
    const calculatedRoiPercentage = (calculatedRoi / initialInvestment) * 100

    // Calculate annualized ROI for investments longer than 1 year
    const calculatedAnnualizedRoi =
      timeframe > 1 ? (Math.pow(1 + calculatedRoiPercentage / 100, 1 / timeframe) - 1) * 100 : calculatedRoiPercentage

    setRoi(calculatedRoi)
    setRoiPercentage(calculatedRoiPercentage)
    setAnnualizedRoi(calculatedAnnualizedRoi)
  }

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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="about">About ROI</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Investment Details</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="initial-investment">Initial Investment</Label>
                  <Input
                    id="initial-investment"
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="net-profit">Net Profit (Total Return)</Label>
                  <Input
                    id="net-profit"
                    type="number"
                    value={netProfit}
                    onChange={(e) => setNetProfit(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="timeframe">Investment Timeframe (Years)</Label>
                  <Input
                    id="timeframe"
                    type="number"
                    value={timeframe}
                    onChange={(e) => setTimeframe(Number(e.target.value))}
                    className="mt-1"
                    min="0.1"
                    step="0.1"
                  />
                </div>

                <Button onClick={calculateROI} className="w-full">
                  Calculate ROI
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">ROI Results</h2>

              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Return on Investment</div>
                    <div className="text-3xl font-bold text-primary">
                      {roiPercentage ? formatPercentage(roiPercentage) : "0%"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Net Profit</div>
                    <div className="text-2xl font-bold">{roi ? formatCurrency(roi) : "$0.00"}</div>
                  </CardContent>
                </Card>

                {timeframe > 1 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Annualized ROI</div>
                      <div className="text-2xl font-bold">{annualizedRoi ? formatPercentage(annualizedRoi) : "0%"}</div>
                    </CardContent>
                  </Card>
                )}

                {roi !== 0 && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Investment Summary</h3>
                    <div className="flex justify-between text-sm">
                      <span>Initial Investment:</span>
                      <span>{formatCurrency(initialInvestment)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Return:</span>
                      <span>{formatCurrency(netProfit)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Net Profit:</span>
                      <span>{formatCurrency(roi)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t">
                      <span>ROI:</span>
                      <span>{formatPercentage(roiPercentage)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <div className="prose max-w-none">
            <h3>What is ROI?</h3>
            <p>
              Return on Investment (ROI) is a performance measure used to evaluate the efficiency or profitability of an
              investment. ROI tries to directly measure the amount of return on a particular investment, relative to the
              investment's cost.
            </p>

            <h3>How to Calculate ROI</h3>
            <p>The basic formula for ROI is:</p>
            <pre className="bg-muted p-4 rounded-md">ROI = (Net Profit / Initial Investment) × 100%</pre>

            <h3>Annualized ROI</h3>
            <p>
              For investments that span multiple years, annualized ROI provides a better measure of annual performance:
            </p>
            <pre className="bg-muted p-4 rounded-md">Annualized ROI = ((1 + ROI)^(1/n) - 1) × 100%</pre>
            <p>Where n is the number of years.</p>

            <h3>Interpreting ROI</h3>
            <p>
              A positive ROI means the investment generated a profit, while a negative ROI means there was a loss. The
              higher the ROI, the more efficient the investment.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

