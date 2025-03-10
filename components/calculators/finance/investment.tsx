"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

export default function InvestmentCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [annualReturnRate, setAnnualReturnRate] = useState(7)
  const [investmentTimeframe, setInvestmentTimeframe] = useState(20)
  const [compoundingFrequency, setCompoundingFrequency] = useState("monthly")
  const [inflationRate, setInflationRate] = useState(2.5)
  const [taxRate, setTaxRate] = useState(25)
  const [results, setResults] = useState<any>(null)
  const [useSliders, setUseSliders] = useState(true)

  const calculateInvestment = () => {
    // Convert annual rates to decimal
    const annualReturn = annualReturnRate / 100
    const inflation = inflationRate / 100
    const tax = taxRate / 100

    // Determine compounding periods per year
    let periodsPerYear = 1
    switch (compoundingFrequency) {
      case "daily":
        periodsPerYear = 365
        break
      case "weekly":
        periodsPerYear = 52
        break
      case "monthly":
        periodsPerYear = 12
        break
      case "quarterly":
        periodsPerYear = 4
        break
      case "annually":
        periodsPerYear = 1
        break
    }

    // Calculate rate per period
    const ratePerPeriod = annualReturn / periodsPerYear

    // Total number of periods
    const totalPeriods = investmentTimeframe * periodsPerYear

    // Monthly contribution converted to per-period contribution
    const contributionPerPeriod = monthlyContribution * (12 / periodsPerYear)

    // Initialize results
    let balance = initialInvestment
    let totalContributions = initialInvestment
    let totalInterest = 0

    // Yearly data for charts
    const yearlyData = []

    // Calculate for each year
    for (let year = 1; year <= investmentTimeframe; year++) {
      // Calculate for each period within the year
      for (let period = 1; period <= periodsPerYear; period++) {
        // Add contribution
        balance += contributionPerPeriod
        totalContributions += contributionPerPeriod

        // Apply interest
        const interestEarned = balance * ratePerPeriod
        balance += interestEarned
        totalInterest += interestEarned
      }

      // Calculate inflation-adjusted value
      const inflationAdjustedValue = balance / Math.pow(1 + inflation, year)

      // Calculate tax on interest (simplified)
      const taxOnInterest = totalInterest * tax
      const afterTaxValue = balance - taxOnInterest

      yearlyData.push({
        year,
        balance: Math.round(balance),
        contributions: Math.round(totalContributions),
        interest: Math.round(totalInterest),
        inflationAdjusted: Math.round(inflationAdjustedValue),
        afterTax: Math.round(afterTaxValue),
      })
    }

    // Final results
    setResults({
      finalBalance: Math.round(balance),
      totalContributions: Math.round(totalContributions),
      totalInterest: Math.round(totalInterest),
      inflationAdjustedValue: Math.round(balance / Math.pow(1 + inflation, investmentTimeframe)),
      taxOnInterest: Math.round(totalInterest * tax),
      afterTaxValue: Math.round(balance - totalInterest * tax),
      yearlyData,
    })
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="results">Results & Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Investment Details</h2>

              <div className="space-y-6">
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

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="initial-investment">Initial Investment: {formatCurrency(initialInvestment)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="initial-investment-slider"
                      min={0}
                      max={100000}
                      step={1000}
                      value={[initialInvestment]}
                      onValueChange={(value) => setInitialInvestment(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="initial-investment"
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="monthly-contribution">
                      Monthly Contribution: {formatCurrency(monthlyContribution)}
                    </Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="monthly-contribution-slider"
                      min={0}
                      max={5000}
                      step={50}
                      value={[monthlyContribution]}
                      onValueChange={(value) => setMonthlyContribution(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="monthly-contribution"
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="annual-return-rate">Annual Return Rate: {annualReturnRate}%</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="annual-return-rate-slider"
                      min={0}
                      max={20}
                      step={0.1}
                      value={[annualReturnRate]}
                      onValueChange={(value) => setAnnualReturnRate(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="annual-return-rate"
                      type="number"
                      value={annualReturnRate}
                      onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                      className="mt-1"
                      step="0.1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="investment-timeframe">Investment Timeframe: {investmentTimeframe} years</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="investment-timeframe-slider"
                      min={1}
                      max={50}
                      step={1}
                      value={[investmentTimeframe]}
                      onValueChange={(value) => setInvestmentTimeframe(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="investment-timeframe"
                      type="number"
                      value={investmentTimeframe}
                      onChange={(e) => setInvestmentTimeframe(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compounding-frequency">Compounding Frequency</Label>
                  <Select
                    id="compounding-frequency"
                    value={compoundingFrequency}
                    onValueChange={setCompoundingFrequency}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="inflation-rate">Inflation Rate: {inflationRate}%</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="inflation-rate-slider"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[inflationRate]}
                      onValueChange={(value) => setInflationRate(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="inflation-rate"
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="mt-1"
                      step="0.1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="tax-rate">Tax Rate: {taxRate}%</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="tax-rate-slider"
                      min={0}
                      max={50}
                      step={1}
                      value={[taxRate]}
                      onValueChange={(value) => setTaxRate(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="tax-rate"
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <Button onClick={calculateInvestment} className="w-full">
                  Calculate Investment
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Investment Summary</h2>

              <div className="space-y-4">
                {results ? (
                  <>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Final Balance</div>
                        <div className="text-3xl font-bold text-primary">{formatCurrency(results.finalBalance)}</div>
                        <div className="text-xs text-muted-foreground mt-1">After {investmentTimeframe} years</div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Total Contributions</div>
                          <div className="text-xl font-bold">{formatCurrency(results.totalContributions)}</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Total Interest</div>
                          <div className="text-xl font-bold">{formatCurrency(results.totalInterest)}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Inflation-Adjusted Value</div>
                          <div className="text-xl font-bold">{formatCurrency(results.inflationAdjustedValue)}</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">After-Tax Value</div>
                          <div className="text-xl font-bold">{formatCurrency(results.afterTaxValue)}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-4">Growth Projection</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={results.yearlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Line type="monotone" dataKey="balance" name="Balance" stroke="#0088FE" />
                            <Line type="monotone" dataKey="contributions" name="Contributions" stroke="#00C49F" />
                            <Line type="monotone" dataKey="interest" name="Interest" stroke="#FFBB28" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Enter your investment details and calculate to see results</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="mt-6 space-y-6">
            {results ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Balance Breakdown</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Contributions",
                              value: results.totalContributions,
                            },
                            {
                              name: "Interest",
                              value: results.totalInterest,
                            },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Bar dataKey="value" fill="#0088FE" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Value Comparison</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Nominal",
                              value: results.finalBalance,
                            },
                            {
                              name: "Inflation-Adjusted",
                              value: results.inflationAdjustedValue,
                            },
                            {
                              name: "After-Tax",
                              value: results.afterTaxValue,
                            },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Bar dataKey="value" fill="#00C49F" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Year-by-Year Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Year
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Balance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contributions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interest
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Inflation-Adjusted
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            After-Tax
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.yearlyData.map((row: any, index: number) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {row.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(row.balance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(row.contributions)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(row.interest)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(row.inflationAdjusted)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(row.afterTax)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Calculate your investment to see detailed results</p>
                <Button onClick={calculateInvestment} className="mt-4">
                  Calculate Investment
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

