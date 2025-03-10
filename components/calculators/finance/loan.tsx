"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(10000)
  const [interestRate, setInterestRate] = useState(5)
  const [loanTerm, setLoanTerm] = useState(5)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  const calculateLoan = () => {
    // Convert annual interest rate to monthly
    const monthlyRate = interestRate / 100 / 12
    // Convert years to months
    const numberOfPayments = loanTerm * 12

    // Calculate monthly payment
    const x = Math.pow(1 + monthlyRate, numberOfPayments)
    const monthly = (loanAmount * x * monthlyRate) / (x - 1)

    if (isFinite(monthly)) {
      // Calculate total payment and interest
      const total = monthly * numberOfPayments
      const interest = total - loanAmount

      // Update state
      setMonthlyPayment(monthly)
      setTotalPayment(total)
      setTotalInterest(interest)
    }
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Loan Details</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="loan-amount">Loan Amount: {formatCurrency(loanAmount)}</Label>
              </div>
              <Slider
                id="loan-amount"
                min={1000}
                max={100000}
                step={1000}
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
              />
              <Input
                id="loan-amount-input"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="interest-rate">Interest Rate: {interestRate}%</Label>
              </div>
              <Slider
                id="interest-rate"
                min={0.1}
                max={20}
                step={0.1}
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
              />
              <Input
                id="interest-rate-input"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="mt-2"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="loan-term">Loan Term: {loanTerm} years</Label>
              </div>
              <Slider
                id="loan-term"
                min={1}
                max={30}
                step={1}
                value={[loanTerm]}
                onValueChange={(value) => setLoanTerm(value[0])}
              />
              <Input
                id="loan-term-input"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="mt-2"
              />
            </div>

            <Button onClick={calculateLoan} className="w-full">
              Calculate
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Loan Summary</h2>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Monthly Payment</div>
                <div className="text-3xl font-bold text-primary">
                  {monthlyPayment ? formatCurrency(monthlyPayment) : "$0.00"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Total Payment</div>
                <div className="text-2xl font-bold">{totalPayment ? formatCurrency(totalPayment) : "$0.00"}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Total Interest</div>
                <div className="text-2xl font-bold">{totalInterest ? formatCurrency(totalInterest) : "$0.00"}</div>
              </CardContent>
            </Card>

            {monthlyPayment > 0 && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Payment Breakdown</h3>
                <div className="flex justify-between text-sm">
                  <span>Principal:</span>
                  <span>{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Interest:</span>
                  <span>{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(totalPayment)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

