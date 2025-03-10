"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RetirementWithdrawalCalculator() {
  const [initialBalance, setInitialBalance] = useState(1000000)
  const [annualWithdrawal, setAnnualWithdrawal] = useState(40000)
  const [returnRate, setReturnRate] = useState(5)
  const [inflationRate, setInflationRate] = useState(2)
  const [years, setYears] = useState(30)
  const [withdrawalRate, setWithdrawalRate] = useState(4)
  const [chartData, setChartData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("amount")

  useEffect(() => {
    // Calculate withdrawal rate when amount changes
    if (activeTab === "amount" && initialBalance > 0) {
      setWithdrawalRate((annualWithdrawal / initialBalance) * 100)
    }
    // Calculate withdrawal amount when rate changes
    else if (activeTab === "rate" && initialBalance > 0) {
      setAnnualWithdrawal((withdrawalRate / 100) * initialBalance)
    }
  }, [activeTab, annualWithdrawal, initialBalance, withdrawalRate])

  useEffect(() => {
    calculateProjection()
  }, [initialBalance, annualWithdrawal, returnRate, inflationRate, years])

  const calculateProjection = () => {
    const data = []
    let balance = initialBalance
    let currentWithdrawal = annualWithdrawal

    for (let year = 0; year <= years; year++) {
      data.push({
        year,
        balance: Math.max(0, Math.round(balance)),
        withdrawal: year > 0 ? Math.round(currentWithdrawal) : 0,
      })

      // Calculate next year's values
      balance = Math.max(0, balance - currentWithdrawal)
      balance = balance * (1 + returnRate / 100)
      currentWithdrawal = currentWithdrawal * (1 + inflationRate / 100)

      // If balance depleted, break
      if (balance <= 0) break
    }

    setChartData(data)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Retirement Withdrawal Calculator</CardTitle>
        <CardDescription>Calculate how long your retirement savings will last</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="initial-balance">Initial Portfolio Balance</Label>
            <Input
              id="initial-balance"
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(Number(e.target.value))}
            />
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="amount">Withdrawal Amount</TabsTrigger>
              <TabsTrigger value="rate">Withdrawal Rate</TabsTrigger>
            </TabsList>
            <TabsContent value="amount" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="annual-withdrawal">Annual Withdrawal</Label>
                <Input
                  id="annual-withdrawal"
                  type="number"
                  value={annualWithdrawal}
                  onChange={(e) => setAnnualWithdrawal(Number(e.target.value))}
                />
                <div className="text-sm text-muted-foreground">Withdrawal Rate: {withdrawalRate.toFixed(2)}%</div>
              </div>
            </TabsContent>
            <TabsContent value="rate" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="withdrawal-rate">Withdrawal Rate (%)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="withdrawal-rate"
                    min={1}
                    max={10}
                    step={0.1}
                    value={[withdrawalRate]}
                    onValueChange={(value) => setWithdrawalRate(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{withdrawalRate.toFixed(1)}%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Annual Withdrawal: {formatCurrency(annualWithdrawal)}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-2">
            <Label htmlFor="return-rate">Expected Annual Return (%)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="return-rate"
                min={0}
                max={12}
                step={0.5}
                value={[returnRate]}
                onValueChange={(value) => setReturnRate(value[0])}
                className="flex-1"
              />
              <span className="w-12 text-right">{returnRate.toFixed(1)}%</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="inflation-rate">Expected Inflation Rate (%)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="inflation-rate"
                min={0}
                max={8}
                step={0.5}
                value={[inflationRate]}
                onValueChange={(value) => setInflationRate(value[0])}
                className="flex-1"
              />
              <span className="w-12 text-right">{inflationRate.toFixed(1)}%</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="years">Retirement Duration (Years)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="years"
                min={5}
                max={50}
                step={1}
                value={[years]}
                onValueChange={(value) => setYears(value[0])}
                className="flex-1"
              />
              <span className="w-12 text-right">{years}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Portfolio Projection</h3>
            <div className="h-[300px] w-full pr-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 50,
                    bottom: 25,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{
                      value: "Years",
                      position: "insideBottom",
                      offset: -15,
                    }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value / 1000}k`}
                    label={{
                      value: "Portfolio Balance",
                      angle: -90,
                      position: "insideLeft",
                      offset: -35,
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Balance"]}
                    labelFormatter={(label) => `Year: ${label}`}
                    separator=": "
                    contentStyle={{
                      padding: "8px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "white",
                    }}
                    itemStyle={{
                      padding: "4px 0",
                      color: "#666",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#8884d8"
                    name="Portfolio Balance"
                    dot={{ r: 1 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-2">Summary</h3>
            <p className="text-sm">
              With an initial balance of {formatCurrency(initialBalance)}, withdrawing{" "}
              {formatCurrency(annualWithdrawal)} annually (adjusted for inflation), your portfolio is projected to{" "}
              {chartData[chartData.length - 1]?.balance > 0
                ? `have ${formatCurrency(chartData[chartData.length - 1]?.balance)} remaining after ${years} years`
                : `be depleted in approximately ${chartData.length - 1} years`}
              .
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

