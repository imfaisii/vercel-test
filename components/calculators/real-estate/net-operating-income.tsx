"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"
import { Calculator } from "@/components/calculator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Info, DollarSign, TrendingUp } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define expense categories with default percentages
const DEFAULT_EXPENSE_CATEGORIES = [
  { name: "Property Management", percentage: 8, color: "#8b5cf6" },
  { name: "Property Tax", percentage: 15, color: "#6366f1" },
  { name: "Insurance", percentage: 5, color: "#3b82f6" },
  { name: "Maintenance", percentage: 7, color: "#0ea5e9" },
  { name: "Utilities", percentage: 5, color: "#06b6d4" },
  { name: "Vacancy", percentage: 5, color: "#14b8a6" },
]

export default function NetOperatingIncomeCalculator() {
  // State for input values
  const [grossRentalIncome, setGrossRentalIncome] = useState(10000)
  const [otherIncome, setOtherIncome] = useState(1000)
  const [vacancyRate, setVacancyRate] = useState(5)
  const [expenseCategories, setExpenseCategories] = useState(DEFAULT_EXPENSE_CATEGORIES)
  const [activeTab, setActiveTab] = useState("basic")
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  // Calculate results
  const potentialGrossIncome = grossRentalIncome + otherIncome
  const vacancyLoss = (potentialGrossIncome * vacancyRate) / 100
  const effectiveGrossIncome = potentialGrossIncome - vacancyLoss

  // Calculate expenses
  const expenses = expenseCategories.map((category) => ({
    ...category,
    amount: (effectiveGrossIncome * category.percentage) / 100,
  }))

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netOperatingIncome = effectiveGrossIncome - totalExpenses
  const capRate = 7.5 // Default cap rate for property valuation
  const estimatedPropertyValue = netOperatingIncome * (100 / capRate)

  // Prepare data for charts
  const incomeData = [
    { name: "Gross Rental Income", value: grossRentalIncome, color: "#8b5cf6" },
    { name: "Other Income", value: otherIncome, color: "#6366f1" },
    { name: "Vacancy Loss", value: -vacancyLoss, color: "#ef4444" },
  ]

  const breakdownData = [
    { name: "Net Operating Income", value: netOperatingIncome, color: "#22c55e" },
    { name: "Total Expenses", value: totalExpenses, color: "#ef4444" },
  ]

  // Handle expense category update
  const handleExpenseUpdate = (index, field, value) => {
    const updatedExpenses = [...expenseCategories]
    updatedExpenses[index][field] = value
    setExpenseCategories(updatedExpenses)
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value) => {
    return `${value}%`
  }

  return (
    <Calculator>
      <Calculator.Input>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Property Income & Expenses</CardTitle>
            <CardDescription>Enter your property's income and expense details to calculate NOI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="grossRentalIncome" className="flex items-center gap-2">
                        Annual Gross Rental Income
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Total annual rental income before any deductions</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm text-muted-foreground">{formatCurrency(grossRentalIncome)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        id="grossRentalIncome"
                        min={0}
                        max={100000}
                        step={1000}
                        value={[grossRentalIncome]}
                        onValueChange={(value) => setGrossRentalIncome(value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="otherIncome" className="flex items-center gap-2">
                        Annual Other Income
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Additional income from laundry, parking, etc.</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm text-muted-foreground">{formatCurrency(otherIncome)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        id="otherIncome"
                        min={0}
                        max={20000}
                        step={100}
                        value={[otherIncome]}
                        onValueChange={(value) => setOtherIncome(value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vacancyRate" className="flex items-center gap-2">
                        Vacancy Rate
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Expected percentage of time the property will be vacant</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm text-muted-foreground">{formatPercentage(vacancyRate)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        id="vacancyRate"
                        min={0}
                        max={20}
                        step={0.5}
                        value={[vacancyRate]}
                        onValueChange={(value) => setVacancyRate(value[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                >
                  {showAdvancedOptions ? "Hide" : "Show"} Expense Breakdown
                </Button>

                {showAdvancedOptions && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-medium">Operating Expenses (% of Effective Gross Income)</h3>
                    {expenseCategories.map((category, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                          <Label htmlFor={`expense-${index}`} className="text-sm">
                            {category.name}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`expense-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            value={category.percentage}
                            onChange={(e) =>
                              handleExpenseUpdate(index, "percentage", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="grossRentalIncomeAdvanced">Annual Gross Rental Income</Label>
                      <div className="flex items-center mt-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="grossRentalIncomeAdvanced"
                          type="number"
                          min="0"
                          value={grossRentalIncome}
                          onChange={(e) => setGrossRentalIncome(Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="otherIncomeAdvanced">Annual Other Income</Label>
                      <div className="flex items-center mt-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="otherIncomeAdvanced"
                          type="number"
                          min="0"
                          value={otherIncome}
                          onChange={(e) => setOtherIncome(Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="vacancyRateAdvanced">Vacancy Rate (%)</Label>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="vacancyRateAdvanced"
                          type="number"
                          min="0"
                          max="100"
                          value={vacancyRate}
                          onChange={(e) => setVacancyRate(Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3">Operating Expenses</h3>
                    {expenseCategories.map((category, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 items-center mb-3">
                        <div className="flex items-center gap-2 col-span-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                          <Label htmlFor={`expense-adv-${index}`} className="text-sm">
                            {category.name}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`expense-adv-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            value={category.percentage}
                            onChange={(e) =>
                              handleExpenseUpdate(index, "percentage", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-full"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Calculator.Input>

      <Calculator.Output>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Net Operating Income Results</CardTitle>
            <CardDescription>Analysis of your property's financial performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Net Operating Income (NOI)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{formatCurrency(netOperatingIncome)}</div>
                  <p className="text-sm text-muted-foreground mt-1">Annual</p>
                  <div className="text-xl font-medium mt-2">{formatCurrency(netOperatingIncome / 12)}</div>
                  <p className="text-sm text-muted-foreground">Monthly</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Estimated Property Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(estimatedPropertyValue)}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-sm text-muted-foreground">Based on {capRate}% cap rate</p>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Property value estimated using the capitalization rate method: NOI ÷ Cap Rate
                          </p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Income Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={incomeData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), "Amount"]}
                          contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                          {incomeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Potential Gross Income:</span>
                      <span className="text-sm font-medium">{formatCurrency(potentialGrossIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Vacancy Loss:</span>
                      <span className="text-sm font-medium text-red-500">-{formatCurrency(vacancyLoss)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Effective Gross Income:</span>
                      <span className="text-sm font-medium">{formatCurrency(effectiveGrossIncome)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={expenses}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={false} />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), "Amount"]}
                          contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="amount" name="Expense Amount" radius={[4, 4, 0, 0]}>
                          {expenses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Operating Expenses:</span>
                      <span className="text-sm font-medium text-red-500">{formatCurrency(totalExpenses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expense Ratio:</span>
                      <span className="text-sm font-medium">
                        {formatPercentage((totalExpenses / effectiveGrossIncome) * 100)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Net Operating Income?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Net Operating Income (NOI) is a calculation used to analyze the profitability of income-generating
                    real estate investments. It equals all revenue from the property minus all reasonably necessary
                    operating expenses.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    NOI is a before-tax figure that excludes principal and interest payments on loans, capital
                    expenditures, depreciation, and amortization.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How is NOI used in real estate investing?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">NOI is used to:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Calculate the capitalization rate (cap rate) of a property</li>
                    <li>Determine the property's value using income capitalization</li>
                    <li>Measure property performance over time</li>
                    <li>Compare different investment properties</li>
                    <li>Calculate the debt service coverage ratio (DSCR) for financing</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What expenses are included in NOI?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Operating expenses typically included in NOI calculations:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Property management fees</li>
                    <li>Property taxes</li>
                    <li>Insurance</li>
                    <li>Utilities (if paid by owner)</li>
                    <li>Maintenance and repairs</li>
                    <li>Landscaping and snow removal</li>
                    <li>Legal and accounting fees related to property operations</li>
                    <li>Property marketing and advertising</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    NOI does NOT include mortgage payments, capital expenditures, depreciation, or income taxes.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </Calculator.Output>
    </Calculator>
  )
}

