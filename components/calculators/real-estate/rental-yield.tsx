"use client"

import { useState } from "react"
import { Calculator } from "@/components/calculator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RentalYieldCalculator() {
  const [propertyValue, setPropertyValue] = useState(300000)
  const [purchaseCosts, setPurchaseCosts] = useState(10000)
  const [monthlyRent, setMonthlyRent] = useState(1800)
  const [annualExpenses, setAnnualExpenses] = useState(3000)
  const [vacancyRate, setVacancyRate] = useState(5)

  // Calculate results
  const calculateYields = () => {
    // Annual rent accounting for vacancy
    const effectiveAnnualRent = monthlyRent * 12 * (1 - vacancyRate / 100)

    // Gross yield calculation
    const totalInvestment = propertyValue + purchaseCosts
    const grossYield = (effectiveAnnualRent / totalInvestment) * 100

    // Net yield calculation
    const netRentalIncome = effectiveAnnualRent - annualExpenses
    const netYield = (netRentalIncome / totalInvestment) * 100

    // Cap rate (uses property value only, not purchase costs)
    const capRate = (netRentalIncome / propertyValue) * 100

    // Cash on cash return (assuming 20% down payment + purchase costs)
    const downPayment = propertyValue * 0.2 + purchaseCosts
    const mortgageAmount = propertyValue * 0.8
    const annualMortgagePayment = calculateMortgagePayment(mortgageAmount, 4.5, 30) * 12
    const cashFlow = effectiveAnnualRent - annualExpenses - annualMortgagePayment
    const cashOnCashReturn = (cashFlow / downPayment) * 100

    return {
      grossYield: grossYield.toFixed(2),
      netYield: netYield.toFixed(2),
      capRate: capRate.toFixed(2),
      cashOnCashReturn: cashOnCashReturn.toFixed(2),
      annualRentalIncome: effectiveAnnualRent.toFixed(2),
      netRentalIncome: netRentalIncome.toFixed(2),
      cashFlow: cashFlow.toFixed(2),
    }
  }

  // Helper function to calculate monthly mortgage payment
  const calculateMortgagePayment = (principal: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 100 / 12
    const numPayments = years * 12
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    )
  }

  const results = calculateYields()

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
              step="1000"
              value={propertyValue}
              onChange={(e) => setPropertyValue(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="purchase-costs">Purchase Costs ($)</Label>
            <Input
              id="purchase-costs"
              type="number"
              min="0"
              step="100"
              value={purchaseCosts}
              onChange={(e) => setPurchaseCosts(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground mt-1">Include closing costs, legal fees, inspections, etc.</p>
          </div>

          <div>
            <Label htmlFor="monthly-rent">Monthly Rent ($)</Label>
            <Input
              id="monthly-rent"
              type="number"
              min="0"
              step="50"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="annual-expenses">Annual Expenses ($)</Label>
            <Input
              id="annual-expenses"
              type="number"
              min="0"
              step="100"
              value={annualExpenses}
              onChange={(e) => setAnnualExpenses(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include property taxes, insurance, maintenance, management fees, etc.
            </p>
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
        </div>
      </Calculator.Input>

      <Calculator.Output>
        <Tabs defaultValue="yields">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="yields">Yield Metrics</TabsTrigger>
            <TabsTrigger value="income">Income Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="yields" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Gross Yield</h4>
                <p className="text-2xl font-semibold">{results.grossYield}%</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Net Yield</h4>
                <p className="text-2xl font-semibold">{results.netYield}%</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Cap Rate</h4>
                <p className="text-2xl font-semibold">{results.capRate}%</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Cash on Cash Return</h4>
                <p className="text-2xl font-semibold">{results.cashOnCashReturn}%</p>
                <p className="text-xs text-muted-foreground">(Assumes 20% down payment)</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-4 pt-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Annual Rental Income</h4>
              <p className="text-2xl font-semibold">${Number(results.annualRentalIncome).toLocaleString()}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Annual Expenses</h4>
              <p className="text-2xl font-semibold">${annualExpenses.toLocaleString()}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Net Rental Income</h4>
              <p className="text-2xl font-semibold">${Number(results.netRentalIncome).toLocaleString()}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Monthly Cash Flow</h4>
              <p className="text-2xl font-semibold">${(Number(results.cashFlow) / 12).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">(Assumes 20% down payment, 30-year mortgage at 4.5%)</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            This calculator provides estimates based on the information provided. Actual returns may vary based on
            market conditions and property performance.
          </p>
        </div>
      </Calculator.Output>
    </Calculator>
  )
}

