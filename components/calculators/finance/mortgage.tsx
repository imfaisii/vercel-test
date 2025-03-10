"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  LineChart,
  Line,
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

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000)
  const [interestRate, setInterestRate] = useState(4.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [downPayment, setDownPayment] = useState(60000)
  const [propertyTax, setPropertyTax] = useState(3000)
  const [homeInsurance, setHomeInsurance] = useState(1200)
  const [pmi, setPmi] = useState(0)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([])
  const [useSliders, setUseSliders] = useState(true)

  // Calculate PMI based on down payment percentage
  useEffect(() => {
    const homePrice = loanAmount + downPayment
    const downPaymentPercentage = (downPayment / homePrice) * 100

    // PMI is typically required if down payment is less than 20%
    if (downPaymentPercentage < 20) {
      // Approximate PMI calculation (0.5-1% of loan amount annually)
      const annualPmi = loanAmount * 0.005
      setPmi(Math.round(annualPmi / 12))
    } else {
      setPmi(0)
    }
  }, [loanAmount, downPayment])

  const calculateMortgage = () => {
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12

    // Total number of payments
    const numberOfPayments = loanTerm * 12

    // Calculate principal and interest payment
    const x = Math.pow(1 + monthlyRate, numberOfPayments)
    const principalInterest = (loanAmount * x * monthlyRate) / (x - 1)

    // Monthly property tax and insurance
    const monthlyPropertyTax = propertyTax / 12
    const monthlyInsurance = homeInsurance / 12

    // Total monthly payment
    const total = principalInterest + monthlyPropertyTax + monthlyInsurance + pmi

    // Update state
    setMonthlyPayment(total)
    setTotalPayment(total * numberOfPayments)
    setTotalInterest(total * numberOfPayments - loanAmount)

    // Generate amortization schedule
    generateAmortizationSchedule(loanAmount, monthlyRate, numberOfPayments, principalInterest)
  }

  const generateAmortizationSchedule = (
    principal: number,
    monthlyRate: number,
    numberOfPayments: number,
    monthlyPayment: number,
  ) => {
    let balance = principal
    let totalInterest = 0
    const schedule = []

    // Generate data for each year (not each month to keep it manageable)
    for (let year = 1; year <= loanTerm; year++) {
      let yearlyPrincipal = 0
      let yearlyInterest = 0

      // Calculate monthly payments for the entire year
      for (let month = 1; month <= 12; month++) {
        const interestPayment = balance * monthlyRate
        const principalPayment = monthlyPayment - interestPayment

        yearlyInterest += interestPayment
        yearlyPrincipal += principalPayment
        balance -= principalPayment

        if (balance < 0) balance = 0
      }

      totalInterest += yearlyInterest

      schedule.push({
        year,
        principalPayment: yearlyPrincipal,
        interestPayment: yearlyInterest,
        remainingBalance: balance,
        totalInterest,
      })

      if (balance <= 0) break
    }

    setAmortizationSchedule(schedule)
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

  // Get payment breakdown data for pie chart
  const getPaymentBreakdown = () => {
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12

    // Total number of payments
    const numberOfPayments = loanTerm * 12

    // Calculate principal and interest payment
    const x = Math.pow(1 + monthlyRate, numberOfPayments)
    const principalInterest = (loanAmount * x * monthlyRate) / (x - 1)

    // Calculate interest portion of first payment
    const interestPortion = loanAmount * monthlyRate
    const principalPortion = principalInterest - interestPortion

    return [
      { name: "Principal", value: principalPortion },
      { name: "Interest", value: interestPortion },
      { name: "Property Tax", value: propertyTax / 12 },
      { name: "Insurance", value: homeInsurance / 12 },
      { name: "PMI", value: pmi },
    ].filter((item) => item.value > 0)
  }

  // Colors for pie chart
  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#FF0000"]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="amortization">Amortization Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Mortgage Details</h2>

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
                    <Label htmlFor="home-price">Home Price: {formatCurrency(loanAmount + downPayment)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="home-price-slider"
                      min={50000}
                      max={1000000}
                      step={5000}
                      value={[loanAmount + downPayment]}
                      onValueChange={(value) => {
                        const homePrice = value[0]
                        // Keep down payment percentage the same
                        const percentage = downPayment / (loanAmount + downPayment)
                        const newDownPayment = Math.round(homePrice * percentage)
                        setDownPayment(newDownPayment)
                        setLoanAmount(homePrice - newDownPayment)
                      }}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="home-price"
                      type="number"
                      value={loanAmount + downPayment}
                      onChange={(e) => {
                        const homePrice = Number(e.target.value)
                        // Keep down payment percentage the same
                        const percentage = downPayment / (loanAmount + downPayment)
                        const newDownPayment = Math.round(homePrice * percentage)
                        setDownPayment(newDownPayment)
                        setLoanAmount(homePrice - newDownPayment)
                      }}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="down-payment">Down Payment: {formatCurrency(downPayment)}</Label>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((downPayment / (loanAmount + downPayment)) * 100)}%
                    </span>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="down-payment-slider"
                      min={0}
                      max={loanAmount + downPayment}
                      step={5000}
                      value={[downPayment]}
                      onValueChange={(value) => {
                        setDownPayment(value[0])
                        setLoanAmount(loanAmount + downPayment - value[0])
                      }}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="down-payment"
                      type="number"
                      value={downPayment}
                      onChange={(e) => {
                        const newDownPayment = Number(e.target.value)
                        setDownPayment(newDownPayment)
                        setLoanAmount(loanAmount + downPayment - newDownPayment)
                      }}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="loan-amount">Loan Amount: {formatCurrency(loanAmount)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="loan-amount-slider"
                      min={10000}
                      max={900000}
                      step={5000}
                      value={[loanAmount]}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="loan-amount"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="interest-rate">Interest Rate: {interestRate}%</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="interest-rate-slider"
                      min={1}
                      max={10}
                      step={0.125}
                      value={[interestRate]}
                      onValueChange={(value) => setInterestRate(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="interest-rate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="mt-1"
                      step="0.125"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="loan-term">Loan Term: {loanTerm} years</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="loan-term-slider"
                      min={5}
                      max={30}
                      step={5}
                      value={[loanTerm]}
                      onValueChange={(value) => setLoanTerm(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="loan-term"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="property-tax">Annual Property Tax: {formatCurrency(propertyTax)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="property-tax-slider"
                      min={0}
                      max={10000}
                      step={100}
                      value={[propertyTax]}
                      onValueChange={(value) => setPropertyTax(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="property-tax"
                      type="number"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="home-insurance">Annual Home Insurance: {formatCurrency(homeInsurance)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="home-insurance-slider"
                      min={0}
                      max={5000}
                      step={100}
                      value={[homeInsurance]}
                      onValueChange={(value) => setHomeInsurance(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="home-insurance"
                      type="number"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <Button onClick={calculateMortgage} className="w-full">
                  Calculate Mortgage
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Mortgage Summary</h2>

              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Monthly Payment</div>
                    <div className="text-3xl font-bold text-primary">
                      {monthlyPayment ? formatCurrency(monthlyPayment) : "$0"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Principal, Interest, Taxes & Insurance</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Total of All Payments</div>
                    <div className="text-2xl font-bold">{totalPayment ? formatCurrency(totalPayment) : "$0"}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Total Interest Paid</div>
                    <div className="text-2xl font-bold">{totalInterest ? formatCurrency(totalInterest) : "$0"}</div>
                  </CardContent>
                </Card>

                {monthlyPayment > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Monthly Payment Breakdown</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPaymentBreakdown()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {getPaymentBreakdown().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="amortization">
          <div className="mt-6 space-y-6">
            {amortizationSchedule.length > 0 ? (
              <>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={amortizationSchedule} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: "Year", position: "insideBottomRight", offset: -5 }} />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line type="monotone" dataKey="remainingBalance" name="Remaining Balance" stroke="#0088FE" />
                      <Line type="monotone" dataKey="totalInterest" name="Total Interest Paid" stroke="#FF8042" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Principal Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interest Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Remaining Balance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Interest Paid
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {amortizationSchedule.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(row.principalPayment)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(row.interestPayment)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(row.remainingBalance)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(row.totalInterest)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Calculate your mortgage to see the amortization schedule</p>
                <Button onClick={calculateMortgage} className="mt-4">
                  Calculate Mortgage
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

