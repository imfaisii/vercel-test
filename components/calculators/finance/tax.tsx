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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Tax brackets for 2023 (simplified)
const TAX_BRACKETS = {
  single: [
    { min: 0, max: 11000, rate: 10 },
    { min: 11001, max: 44725, rate: 12 },
    { min: 44726, max: 95375, rate: 22 },
    { min: 95376, max: 182100, rate: 24 },
    { min: 182101, max: 231250, rate: 32 },
    { min: 231251, max: 578125, rate: 35 },
    { min: 578126, max: Number.POSITIVE_INFINITY, rate: 37 },
  ],
  married: [
    { min: 0, max: 22000, rate: 10 },
    { min: 22001, max: 89450, rate: 12 },
    { min: 89451, max: 190750, rate: 22 },
    { min: 190751, max: 364200, rate: 24 },
    { min: 364201, max: 462500, rate: 32 },
    { min: 462501, max: 693750, rate: 35 },
    { min: 693751, max: Number.POSITIVE_INFINITY, rate: 37 },
  ],
  head: [
    { min: 0, max: 15700, rate: 10 },
    { min: 15701, max: 59850, rate: 12 },
    { min: 59851, max: 95350, rate: 22 },
    { min: 95351, max: 182100, rate: 24 },
    { min: 182101, max: 231250, rate: 32 },
    { min: 231251, max: 578100, rate: 35 },
    { min: 578101, max: Number.POSITIVE_INFINITY, rate: 37 },
  ],
}

// Standard deductions for 2023
const STANDARD_DEDUCTIONS = {
  single: 13850,
  married: 27700,
  head: 20800,
}

export default function TaxCalculator() {
  const [income, setIncome] = useState(75000)
  const [filingStatus, setFilingStatus] = useState("single")
  const [deductions, setDeductions] = useState(0)
  const [useStandardDeduction, setUseStandardDeduction] = useState(true)
  const [retirement401k, setRetirement401k] = useState(5000)
  const [otherIncome, setOtherIncome] = useState(0)
  const [stateRate, setStateRate] = useState(5)
  const [results, setResults] = useState<any>(null)
  const [useSliders, setUseSliders] = useState(true)

  const calculateTax = () => {
    // Calculate adjusted gross income
    const totalIncome = income + otherIncome
    const agi = totalIncome - retirement401k

    // Determine deduction amount
    const standardDeduction = STANDARD_DEDUCTIONS[filingStatus as keyof typeof STANDARD_DEDUCTIONS]
    const deductionAmount = useStandardDeduction ? standardDeduction : deductions

    // Calculate taxable income
    const taxableIncome = Math.max(0, agi - deductionAmount)

    // Calculate federal income tax
    const brackets = TAX_BRACKETS[filingStatus as keyof typeof TAX_BRACKETS]
    let federalTax = 0
    const bracketTaxes = []

    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i]
      const nextBracketMin = i < brackets.length - 1 ? brackets[i + 1].min : Number.POSITIVE_INFINITY

      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome, nextBracketMin - 1) - bracket.min
        const taxInBracket = taxableInBracket * (bracket.rate / 100)
        federalTax += taxInBracket

        bracketTaxes.push({
          bracket: `${bracket.rate}%`,
          min: bracket.min,
          max: nextBracketMin - 1,
          taxableAmount: taxableInBracket,
          tax: taxInBracket,
        })
      }
    }

    // Calculate state tax (simplified)
    const stateTax = taxableIncome * (stateRate / 100)

    // Calculate FICA taxes (Social Security and Medicare)
    const socialSecurityTax = Math.min(income, 160200) * 0.062 // 6.2% up to wage base limit
    const medicareTax = income * 0.0145 // 1.45% on all earnings

    // Additional Medicare tax for high earners
    const additionalMedicareTax = income > 200000 ? (income - 200000) * 0.009 : 0

    // Total FICA taxes
    const ficaTax = socialSecurityTax + medicareTax + additionalMedicareTax

    // Total tax
    const totalTax = federalTax + stateTax + ficaTax

    // Effective tax rates
    const federalEffectiveRate = (federalTax / totalIncome) * 100
    const stateEffectiveRate = (stateTax / totalIncome) * 100
    const ficaEffectiveRate = (ficaTax / totalIncome) * 100
    const totalEffectiveRate = (totalTax / totalIncome) * 100

    // Take-home pay
    const takeHomePay = totalIncome - totalTax - retirement401k
    const monthlyTakeHome = takeHomePay / 12

    // Set results
    setResults({
      totalIncome,
      agi,
      taxableIncome,
      federalTax,
      stateTax,
      ficaTax,
      totalTax,
      takeHomePay,
      monthlyTakeHome,
      federalEffectiveRate,
      stateEffectiveRate,
      ficaEffectiveRate,
      totalEffectiveRate,
      bracketTaxes,
      deductionAmount,
      socialSecurityTax,
      medicareTax,
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

  // Format percentage
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  // Get tax breakdown data for pie chart
  const getTaxBreakdown = () => {
    if (!results) return []

    return [
      { name: "Federal Tax", value: results.federalTax },
      { name: "State Tax", value: results.stateTax },
      { name: "Social Security", value: results.socialSecurityTax },
      { name: "Medicare", value: results.medicareTax },
    ]
  }

  // Get income allocation data for pie chart
  const getIncomeAllocation = () => {
    if (!results) return []

    return [
      { name: "Take-Home Pay", value: results.takeHomePay },
      { name: "Federal Tax", value: results.federalTax },
      { name: "State Tax", value: results.stateTax },
      { name: "FICA Taxes", value: results.ficaTax },
      { name: "401(k) Contribution", value: retirement401k },
    ]
  }

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="breakdown">Tax Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Income & Deductions</h2>

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
                    <Label htmlFor="income">Annual Salary: {formatCurrency(income)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="income-slider"
                      min={0}
                      max={500000}
                      step={1000}
                      value={[income]}
                      onValueChange={(value) => setIncome(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="income"
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="other-income">Other Income: {formatCurrency(otherIncome)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="other-income-slider"
                      min={0}
                      max={100000}
                      step={500}
                      value={[otherIncome]}
                      onValueChange={(value) => setOtherIncome(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="other-income"
                      type="number"
                      value={otherIncome}
                      onChange={(e) => setOtherIncome(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filing-status">Filing Status</Label>
                  <Select id="filing-status" value={filingStatus} onValueChange={setFilingStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filing status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married Filing Jointly</SelectItem>
                      <SelectItem value="head">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="401k">401(k) Contribution: {formatCurrency(retirement401k)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="401k-slider"
                      min={0}
                      max={22500}
                      step={500}
                      value={[retirement401k]}
                      onValueChange={(value) => setRetirement401k(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="401k"
                      type="number"
                      value={retirement401k}
                      onChange={(e) => setRetirement401k(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-standard-deduction">Use Standard Deduction</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="use-standard-deduction"
                        checked={useStandardDeduction}
                        onChange={(e) => setUseStandardDeduction(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  {!useStandardDeduction && (
                    <div className="mt-2">
                      <Label htmlFor="deductions">Itemized Deductions: {formatCurrency(deductions)}</Label>
                      {useSliders ? (
                        <Slider
                          id="deductions-slider"
                          min={0}
                          max={50000}
                          step={500}
                          value={[deductions]}
                          onValueChange={(value) => setDeductions(value[0])}
                          className="mt-2"
                        />
                      ) : (
                        <Input
                          id="deductions"
                          type="number"
                          value={deductions}
                          onChange={(e) => setDeductions(Number(e.target.value))}
                          className="mt-1"
                        />
                      )}
                    </div>
                  )}
                  {useStandardDeduction && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Standard deduction:{" "}
                      {formatCurrency(STANDARD_DEDUCTIONS[filingStatus as keyof typeof STANDARD_DEDUCTIONS])}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="state-rate">State Tax Rate: {stateRate}%</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="state-rate-slider"
                      min={0}
                      max={13}
                      step={0.1}
                      value={[stateRate]}
                      onValueChange={(value) => setStateRate(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="state-rate"
                      type="number"
                      value={stateRate}
                      onChange={(e) => setStateRate(Number(e.target.value))}
                      className="mt-1"
                      step="0.1"
                    />
                  )}
                </div>

                <Button onClick={calculateTax} className="w-full">
                  Calculate Taxes
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Tax Summary</h2>

              <div className="space-y-4">
                {results ? (
                  <>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Annual Take-Home Pay</div>
                        <div className="text-3xl font-bold text-primary">{formatCurrency(results.takeHomePay)}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Monthly: {formatCurrency(results.monthlyTakeHome)}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Total Tax</div>
                          <div className="text-xl font-bold">{formatCurrency(results.totalTax)}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Effective Rate: {formatPercentage(results.totalEffectiveRate)}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Federal Tax</div>
                          <div className="text-xl font-bold">{formatCurrency(results.federalTax)}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Effective Rate: {formatPercentage(results.federalEffectiveRate)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">State Tax</div>
                          <div className="text-xl font-bold">{formatCurrency(results.stateTax)}</div>
                          <div className="text-xs text-muted-foreground mt-1">Rate: {stateRate}%</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">FICA Taxes</div>
                          <div className="text-xl font-bold">{formatCurrency(results.ficaTax)}</div>
                          <div className="text-xs text-muted-foreground mt-1">Social Security & Medicare</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-4">Income Allocation</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getIncomeAllocation()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {getIncomeAllocation().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Enter your income details and calculate to see results</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="breakdown">
          <div className="mt-6 space-y-6">
            {results ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Tax Breakdown</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getTaxBreakdown()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {getTaxBreakdown().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Federal Tax Brackets</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.bracketTaxes} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="bracket" />
                          <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Bar dataKey="tax" name="Tax Amount" fill="#0088FE" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Tax Calculation Details</h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Total Income:</span>
                      <span className="font-medium">{formatCurrency(results.totalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>401(k) Contribution:</span>
                      <span className="font-medium">{formatCurrency(retirement401k)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adjusted Gross Income:</span>
                      <span className="font-medium">{formatCurrency(results.agi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deductions:</span>
                      <span className="font-medium">{formatCurrency(results.deductionAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxable Income:</span>
                      <span className="font-medium">{formatCurrency(results.taxableIncome)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="font-medium mb-1">Federal Income Tax Breakdown:</div>
                      {results.bracketTaxes.map((bracket: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {bracket.bracket} bracket ({formatCurrency(bracket.min)} - {formatCurrency(bracket.max)}):
                          </span>
                          <span>{formatCurrency(bracket.tax)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span>Federal Income Tax:</span>
                        <span className="font-medium">{formatCurrency(results.federalTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>State Income Tax ({stateRate}%):</span>
                        <span className="font-medium">{formatCurrency(results.stateTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Social Security Tax (6.2%):</span>
                        <span className="font-medium">{formatCurrency(results.socialSecurityTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medicare Tax (1.45%):</span>
                        <span className="font-medium">{formatCurrency(results.medicareTax)}</span>
                      </div>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Tax:</span>
                        <span>{formatCurrency(results.totalTax)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Take-Home Pay:</span>
                        <span>{formatCurrency(results.takeHomePay)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Calculate your taxes to see the detailed breakdown</p>
                <Button onClick={calculateTax} className="mt-4">
                  Calculate Taxes
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

