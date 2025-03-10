"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts"

export function MortgageInsights() {
  const [activeTab, setActiveTab] = useState("amortization")

  // Sample data for amortization schedule
  const amortizationData = Array.from({ length: 30 }, (_, i) => {
    const year = i + 1
    const totalPaid = (360000 * (1 - Math.pow(1 - 0.045 / 12, year * 12))) / (0.045 / 12)
    const principalPaid = Math.min(300000, 300000 * (year / 30) * 1.5)
    const interestPaid = totalPaid - principalPaid

    return {
      year,
      principalPaid,
      interestPaid,
      remainingBalance: Math.max(0, 300000 - principalPaid),
    }
  })

  // Sample data for payment breakdown
  const paymentBreakdownData = [
    { name: "Principal", value: 1520 },
    { name: "Interest", value: 1125 },
    { name: "Property Tax", value: 250 },
    { name: "Insurance", value: 100 },
    { name: "PMI", value: 75 },
  ]

  // Sample data for term comparison
  const termComparisonData = [
    { term: "15-Year", monthlyPayment: 2200, totalInterest: 96000, totalPaid: 396000 },
    { term: "20-Year", monthlyPayment: 1900, totalInterest: 156000, totalPaid: 456000 },
    { term: "30-Year", monthlyPayment: 1520, totalInterest: 247200, totalPaid: 547200 },
  ]

  // Sample data for interest rate impact
  const interestRateData = [
    { rate: "3.0%", monthlyPayment: 1265, totalInterest: 155400 },
    { rate: "3.5%", monthlyPayment: 1347, totalInterest: 184920 },
    { rate: "4.0%", monthlyPayment: 1432, totalInterest: 215520 },
    { rate: "4.5%", monthlyPayment: 1520, totalInterest: 247200 },
    { rate: "5.0%", monthlyPayment: 1610, totalInterest: 279600 },
    { rate: "5.5%", monthlyPayment: 1703, totalInterest: 313080 },
    { rate: "6.0%", monthlyPayment: 1799, totalInterest: 347640 },
  ]

  // Colors for charts - using brighter colors for better visibility on dark background
  const COLORS = ["#00C6FF", "#FF9A3C", "#00E396", "#FFC83D", "#FF5757"]

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Mortgage Insights</CardTitle>
        <CardDescription>
          Visualize your mortgage payments, amortization schedule, and explore different scenarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="amortization">Amortization</TabsTrigger>
            <TabsTrigger value="breakdown">Payment Breakdown</TabsTrigger>
            <TabsTrigger value="terms">Loan Terms</TabsTrigger>
            <TabsTrigger value="rates">Interest Rates</TabsTrigger>
          </TabsList>

          <TabsContent value="amortization" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Amortization Schedule</h3>
              <p className="text-sm text-muted-foreground">
                This chart shows how your mortgage balance decreases over time, and how your payments are split between
                principal and interest.
              </p>
              <div className="h-[400px] w-full bg-black rounded-md p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={amortizationData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="year" stroke="#fff">
                      <Label value="Years" position="bottom" offset={-25} fill="#fff" />
                    </XAxis>
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} stroke="#fff" />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend height={36} verticalAlign="top" wrapperStyle={{ color: "#fff" }} />
                    <Area
                      type="monotone"
                      dataKey="principalPaid"
                      stackId="1"
                      stroke="#00C6FF"
                      fill="#00C6FF"
                      name="Principal Paid"
                    />
                    <Area
                      type="monotone"
                      dataKey="interestPaid"
                      stackId="1"
                      stroke="#FF9A3C"
                      fill="#FF9A3C"
                      name="Interest Paid"
                    />
                    <Line
                      type="monotone"
                      dataKey="remainingBalance"
                      stroke="#00E396"
                      strokeWidth={2}
                      dot={false}
                      name="Remaining Balance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Key Insight:</strong> In the early years of your mortgage, most of your payment goes toward
                  interest. As time passes, more of your payment goes toward reducing the principal.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Monthly Payment Breakdown</h3>
              <p className="text-sm text-muted-foreground">
                This chart shows how your monthly payment is distributed across principal, interest, taxes, insurance,
                and PMI.
              </p>
              <div className="h-[400px] w-full bg-black rounded-md p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <Pie
                      data={paymentBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend height={36} verticalAlign="top" wrapperStyle={{ color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Key Insight:</strong> Principal and interest typically make up the largest portions of your
                  monthly payment, but don't overlook the impact of property taxes and insurance.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="terms" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Loan Term Comparison</h3>
              <p className="text-sm text-muted-foreground">
                Compare how different loan terms affect your monthly payment and total interest paid.
              </p>
              <div className="h-[400px] w-full bg-black rounded-md p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={termComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="term" stroke="#fff">
                      <Label value="Loan Term" position="bottom" offset={-25} fill="#fff" />
                    </XAxis>
                    <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} stroke="#fff" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(value) => `$${value / 1000}k`}
                      stroke="#fff"
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend height={36} verticalAlign="top" wrapperStyle={{ color: "#fff" }} />
                    <Bar yAxisId="left" dataKey="monthlyPayment" fill="#00C6FF" name="Monthly Payment" />
                    <Bar yAxisId="right" dataKey="totalInterest" fill="#FF9A3C" name="Total Interest" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Key Insight:</strong> Shorter loan terms have higher monthly payments but significantly lower
                  total interest costs over the life of the loan.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rates" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Interest Rate Impact</h3>
              <p className="text-sm text-muted-foreground">
                See how different interest rates affect your monthly payment and total interest paid.
              </p>
              <div className="h-[400px] w-full bg-black rounded-md p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={interestRateData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="rate" stroke="#fff">
                      <Label value="Interest Rate" position="bottom" offset={-25} fill="#fff" />
                    </XAxis>
                    <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} stroke="#fff" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(value) => `$${value / 1000}k`}
                      stroke="#fff"
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend height={36} verticalAlign="top" wrapperStyle={{ color: "#fff" }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="monthlyPayment"
                      stroke="#00C6FF"
                      strokeWidth={2}
                      name="Monthly Payment"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="totalInterest"
                      stroke="#FF9A3C"
                      strokeWidth={2}
                      name="Total Interest"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Key Insight:</strong> Even a small change in interest rate can have a significant impact on
                  both your monthly payment and the total interest paid over the life of the loan.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Hidden data tables for SEO */}
        <div className="sr-only">
          <h3>Amortization Schedule Data</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Principal Paid</th>
                <th>Interest Paid</th>
                <th>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortizationData.map((data) => (
                <tr key={data.year}>
                  <td>{data.year}</td>
                  <td>${data.principalPaid.toFixed(2)}</td>
                  <td>${data.interestPaid.toFixed(2)}</td>
                  <td>${data.remainingBalance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Payment Breakdown Data</h3>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {paymentBreakdownData.map((data) => (
                <tr key={data.name}>
                  <td>{data.name}</td>
                  <td>${data.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Loan Term Comparison Data</h3>
          <table>
            <thead>
              <tr>
                <th>Term</th>
                <th>Monthly Payment</th>
                <th>Total Interest</th>
                <th>Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {termComparisonData.map((data) => (
                <tr key={data.term}>
                  <td>{data.term}</td>
                  <td>${data.monthlyPayment}</td>
                  <td>${data.totalInterest}</td>
                  <td>${data.totalPaid}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Interest Rate Impact Data</h3>
          <table>
            <thead>
              <tr>
                <th>Interest Rate</th>
                <th>Monthly Payment</th>
                <th>Total Interest</th>
              </tr>
            </thead>
            <tbody>
              {interestRateData.map((data) => (
                <tr key={data.rate}>
                  <td>{data.rate}</td>
                  <td>${data.monthlyPayment}</td>
                  <td>${data.totalInterest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-4 bg-muted p-4 rounded-md">
          <h3 className="text-lg font-medium">Mortgage Tips</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Making extra principal payments can significantly reduce your loan term and total interest paid.</li>
            <li>Consider refinancing if interest rates drop at least 1% below your current rate.</li>
            <li>A 20% down payment helps you avoid Private Mortgage Insurance (PMI).</li>
            <li>
              Compare 15-year and 30-year mortgages to find the right balance between monthly payment and total cost.
            </li>
            <li>
              Don't forget to factor in property taxes, insurance, and potential HOA fees when budgeting for your home.
            </li>
          </ul>
        </div>

        {/* Schema.org structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dataset",
              name: "Mortgage Calculator Data",
              description: "Data visualizations for mortgage payments, amortization schedules, and loan comparisons",
              keywords: [
                "mortgage calculator",
                "amortization schedule",
                "loan term comparison",
                "interest rate impact",
                "mortgage payment breakdown",
              ],
              creator: {
                "@type": "Organization",
                name: "Calculator Directory",
              },
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is an amortization schedule?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "An amortization schedule is a table that shows each payment throughout the life of your mortgage, breaking down how much goes toward principal and interest. Early in your mortgage, most of your payment goes toward interest, but this shifts toward principal over time.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does my down payment affect my mortgage?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A larger down payment reduces your loan amount, which lowers your monthly payment and total interest paid. Additionally, a down payment of 20% or more typically allows you to avoid Private Mortgage Insurance (PMI), which can save you hundreds of dollars per month.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Should I choose a 15-year or 30-year mortgage?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A 15-year mortgage typically has a lower interest rate and significantly reduces the total interest paid, but comes with higher monthly payments. A 30-year mortgage offers lower monthly payments but costs more in total interest over the life of the loan. Choose based on your financial situation and goals.",
                  },
                },
              ],
            }),
          }}
        />
      </CardContent>
    </Card>
  )
}

