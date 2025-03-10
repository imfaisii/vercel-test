"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfitMarginCalculator() {
  const [revenue, setRevenue] = useState<number>(100000)
  const [cogs, setCogs] = useState<number>(60000)
  const [operatingExpenses, setOperatingExpenses] = useState<number>(20000)
  const [taxes, setTaxes] = useState<number>(5000)
  const [grossProfit, setGrossProfit] = useState<number>(0)
  const [operatingProfit, setOperatingProfit] = useState<number>(0)
  const [netProfit, setNetProfit] = useState<number>(0)
  const [grossMargin, setGrossMargin] = useState<number>(0)
  const [operatingMargin, setOperatingMargin] = useState<number>(0)
  const [netMargin, setNetMargin] = useState<number>(0)

  useEffect(() => {
    calculateProfitMargins()
  }, [revenue, cogs, operatingExpenses, taxes])

  const calculateProfitMargins = () => {
    // Calculate profit values
    const calculatedGrossProfit = revenue - cogs
    const calculatedOperatingProfit = calculatedGrossProfit - operatingExpenses
    const calculatedNetProfit = calculatedOperatingProfit - taxes

    setGrossProfit(calculatedGrossProfit)
    setOperatingProfit(calculatedOperatingProfit)
    setNetProfit(calculatedNetProfit)

    // Calculate margin percentages
    setGrossMargin(revenue > 0 ? (calculatedGrossProfit / revenue) * 100 : 0)
    setOperatingMargin(revenue > 0 ? (calculatedOperatingProfit / revenue) * 100 : 0)
    setNetMargin(revenue > 0 ? (calculatedNetProfit / revenue) * 100 : 0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const getMarginColor = (margin: number) => {
    if (margin < 0) return "text-red-500"
    if (margin < 10) return "text-yellow-500"
    if (margin < 20) return "text-green-400"
    return "text-green-500"
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="results">Profit Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                min="0"
                value={revenue}
                onChange={(e) => setRevenue(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cogs">Cost of Goods Sold ($)</Label>
              <Input
                id="cogs"
                type="number"
                min="0"
                value={cogs}
                onChange={(e) => setCogs(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operating-expenses">Operating Expenses ($)</Label>
              <Input
                id="operating-expenses"
                type="number"
                min="0"
                value={operatingExpenses}
                onChange={(e) => setOperatingExpenses(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxes">Taxes ($)</Label>
              <Input
                id="taxes"
                type="number"
                min="0"
                value={taxes}
                onChange={(e) => setTaxes(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Profit Margins</CardTitle>
              <CardDescription>Summary of your profit margins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Gross Margin</p>
                  <p className={`text-xl font-bold ${getMarginColor(grossMargin)}`}>{formatPercentage(grossMargin)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Operating Margin</p>
                  <p className={`text-xl font-bold ${getMarginColor(operatingMargin)}`}>
                    {formatPercentage(operatingMargin)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Margin</p>
                  <p className={`text-xl font-bold ${getMarginColor(netMargin)}`}>{formatPercentage(netMargin)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Profit Breakdown</CardTitle>
              <CardDescription>Detailed profit analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Revenue</p>
                  <p className="text-right">{formatCurrency(revenue)}</p>

                  <p className="font-medium">Cost of Goods Sold</p>
                  <p className="text-right text-red-500">- {formatCurrency(cogs)}</p>

                  <p className="font-medium border-t pt-2">Gross Profit</p>
                  <p className={`text-right border-t pt-2 ${grossProfit < 0 ? "text-red-500" : ""}`}>
                    {formatCurrency(grossProfit)}
                  </p>

                  <p className="text-sm text-muted-foreground">Gross Margin</p>
                  <p className={`text-right text-sm ${getMarginColor(grossMargin)}`}>{formatPercentage(grossMargin)}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Operating Expenses</p>
                  <p className="text-right text-red-500">- {formatCurrency(operatingExpenses)}</p>

                  <p className="font-medium border-t pt-2">Operating Profit (EBIT)</p>
                  <p className={`text-right border-t pt-2 ${operatingProfit < 0 ? "text-red-500" : ""}`}>
                    {formatCurrency(operatingProfit)}
                  </p>

                  <p className="text-sm text-muted-foreground">Operating Margin</p>
                  <p className={`text-right text-sm ${getMarginColor(operatingMargin)}`}>
                    {formatPercentage(operatingMargin)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Taxes</p>
                  <p className="text-right text-red-500">- {formatCurrency(taxes)}</p>

                  <p className="font-medium border-t pt-2">Net Profit</p>
                  <p className={`text-right border-t pt-2 ${netProfit < 0 ? "text-red-500" : ""}`}>
                    {formatCurrency(netProfit)}
                  </p>

                  <p className="text-sm text-muted-foreground">Net Margin</p>
                  <p className={`text-right text-sm ${getMarginColor(netMargin)}`}>{formatPercentage(netMargin)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

