"use client"

import { useState } from "react"
import { Calculator } from "@/components/calculator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CapRateCalculator() {
  const [propertyValue, setPropertyValue] = useState(1000000)
  const [grossIncome, setGrossIncome] = useState(120000)
  const [vacancyRate, setVacancyRate] = useState(5)
  const [operatingExpenses, setOperatingExpenses] = useState(40000)

  // Calculate results
  const calculateCapRate = () => {
    // Calculate effective gross income (accounting for vacancy)
    const effectiveGrossIncome = grossIncome * (1 - vacancyRate / 100)

    // Calculate net operating income (NOI)
    const netOperatingIncome = effectiveGrossIncome - operatingExpenses

    // Calculate cap rate
    const capRate = (netOperatingIncome / propertyValue) * 100

    // Calculate expense ratio
    const expenseRatio = (operatingExpenses / effectiveGrossIncome) * 100

    // Calculate GRM (Gross Rent Multiplier)
    const grm = propertyValue / grossIncome

    return {
      effectiveGrossIncome,
      netOperatingIncome,
      capRate,
      expenseRatio,
      grm,
      valueAt6Percent: netOperatingIncome / 0.06,
      valueAt8Percent: netOperatingIncome / 0.08,
      valueAt10Percent: netOperatingIncome / 0.1,
    }
  }

  const results = calculateCapRate()

  return (
    <Calculator>
      <Calculator.Input>
        <div className="space-y-4">
          <div>
            <Label htmlFor="property-value">Property Value ($)</Label>
            <Input
              id="property-value"
              type="number"
              min="10000"
              step="10000"
              value={propertyValue}
              onChange={(e) => setPropertyValue(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="gross-income">Annual Gross Income ($)</Label>
            <Input
              id="gross-income"
              type="number"
              min="0"
              step="1000"
              value={grossIncome}
              onChange={(e) => setGrossIncome(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground mt-1">Total annual rental income before expenses</p>
          </div>

          <div>
            <Label htmlFor="vacancy-rate">Vacancy Rate (%)</Label>
            <Input
              id="vacancy-rate"
              type="number"
              min="0"
              max="100"
              step="1"
              value={vacancyRate}
              onChange={(e) => setVacancyRate(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="operating-expenses">Annual Operating Expenses ($)</Label>
            <Input
              id="operating-expenses"
              type="number"
              min="0"
              step="1000"
              value={operatingExpenses}
              onChange={(e) => setOperatingExpenses(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include property taxes, insurance, maintenance, management fees, utilities, etc.
            </p>
          </div>
        </div>
      </Calculator.Input>

      <Calculator.Output>
        <Tabs defaultValue="caprate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="caprate">Cap Rate Analysis</TabsTrigger>
            <TabsTrigger value="valuation">Property Valuation</TabsTrigger>
          </TabsList>

          <TabsContent value="caprate" className="space-y-4 pt-4">
            <div>
              <h3 className="text-lg font-medium">Capitalization Rate</h3>
              <p className="text-3xl font-bold">{results.capRate.toFixed(2)}%</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Net Operating Income (NOI)</h4>
                <p className="text-xl font-semibold">${results.netOperatingIncome.toLocaleString()}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Expense Ratio</h4>
                <p className="text-xl font-semibold">{results.expenseRatio.toFixed(2)}%</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Gross Income:</span>
                    <span className="text-sm font-medium">${grossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Less Vacancy ({vacancyRate}%):</span>
                    <span className="text-sm font-medium">
                      -${((grossIncome * vacancyRate) / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Effective Gross Income:</span>
                    <span className="text-sm font-medium">${results.effectiveGrossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Less Operating Expenses:</span>
                    <span className="text-sm font-medium">-${operatingExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="text-sm font-medium">Net Operating Income:</span>
                    <span className="text-sm font-medium">${results.netOperatingIncome.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="valuation" className="space-y-4 pt-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Gross Rent Multiplier (GRM)</h4>
              <p className="text-xl font-semibold">{results.grm.toFixed(2)}x</p>
              <p className="text-xs text-muted-foreground">Property Value ÷ Annual Gross Income</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Property Value at Different Cap Rates</h4>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">At 6% Cap Rate:</span>
                      <span className="text-sm font-medium">${results.valueAt6Percent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">At 8% Cap Rate:</span>
                      <span className="text-sm font-medium">${results.valueAt8Percent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">At 10% Cap Rate:</span>
                      <span className="text-sm font-medium">${results.valueAt10Percent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="text-sm font-medium">Current Value:</span>
                      <span className="text-sm font-medium">${propertyValue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Cap Rate = Net Operating Income (NOI) ÷ Property Value. Higher cap rates generally indicate higher risk and
            potentially higher returns.
          </p>
        </div>
      </Calculator.Output>
    </Calculator>
  )
}

