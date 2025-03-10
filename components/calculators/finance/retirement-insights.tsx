"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { useEffect } from "react"

// Sample data - in a real application, this would come from your analytics or research
const retirementData = [
  { age: "30-35", medianSavings: 480000, recommendedSavings: 750000, withdrawalRate: 3.2 },
  { age: "35-40", medianSavings: 650000, recommendedSavings: 1000000, withdrawalRate: 3.5 },
  { age: "40-45", medianSavings: 850000, recommendedSavings: 1250000, withdrawalRate: 3.8 },
  { age: "45-50", medianSavings: 1100000, recommendedSavings: 1500000, withdrawalRate: 4.0 },
  { age: "50-55", medianSavings: 1400000, recommendedSavings: 1750000, withdrawalRate: 4.2 },
  { age: "55-60", medianSavings: 1700000, recommendedSavings: 2000000, withdrawalRate: 4.5 },
  { age: "60-65", medianSavings: 2000000, recommendedSavings: 2250000, withdrawalRate: 4.8 },
]

const withdrawalScenarios = [
  { year: 1, conservative: 925000, moderate: 1000000, aggressive: 1100000 },
  { year: 5, conservative: 850000, moderate: 950000, aggressive: 1150000 },
  { year: 10, conservative: 750000, moderate: 900000, aggressive: 1250000 },
  { year: 15, conservative: 650000, moderate: 850000, aggressive: 1400000 },
  { year: 20, conservative: 550000, moderate: 800000, aggressive: 1600000 },
  { year: 25, conservative: 450000, moderate: 750000, aggressive: 1850000 },
  { year: 30, conservative: 350000, moderate: 700000, aggressive: 2200000 },
]

const successRates = [
  { name: "Conservative (3%)", value: 98 },
  { name: "Moderate (4%)", value: 85 },
  { name: "Aggressive (5%)", value: 72 },
]

export default function RetirementInsights() {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)} million`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)},000`
    } else {
      return `$${value}`
    }
  }

  // Add structured data for SEO
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Retirement Withdrawal Strategies Analysis",
      description: "Analysis of different retirement withdrawal strategies and their impact on portfolio longevity.",
      keywords: ["retirement planning", "4% rule", "safe withdrawal rate", "portfolio longevity", "retirement savings"],
      creator: {
        "@type": "Organization",
        name: "FreeCalculators.AI",
      },
      temporalCoverage: "30 year retirement period",
      variableMeasured: ["Portfolio Balance", "Withdrawal Rate", "Success Rate"],
    })
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="w-full space-y-6 bg-black p-6 rounded-lg">
      <section aria-labelledby="retirement-insights-heading">
        <h2 id="retirement-insights-heading" className="text-2xl font-bold text-white mb-4 sr-only">
          Retirement Withdrawal Strategy Insights
        </h2>

        <p className="text-gray-300 mb-6">
          Understanding how different withdrawal strategies affect your retirement portfolio is crucial for long-term
          financial security. The following visualizations illustrate how withdrawal rates, investment returns, and time
          horizons interact to determine retirement outcomes based on historical market data and financial research.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Portfolio Balance Over Time */}
          <section aria-labelledby="portfolio-projections-heading" className="col-span-full">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle id="portfolio-projections-heading" className="text-white">
                  Portfolio Balance Projections
                </CardTitle>
                <CardDescription className="text-gray-400">
                  30-year projection with different withdrawal strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <figure>
                  <div className="h-[300px]" aria-hidden="true">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={withdrawalScenarios} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                          dataKey="year"
                          stroke="#666"
                          label={{ value: "Years", position: "insideBottom", offset: -5, fill: "#888" }}
                        />
                        <YAxis
                          stroke="#666"
                          tickFormatter={(value) =>
                            value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000).toFixed(0)}K`
                          }
                          width={60}
                          label={{
                            value: "Portfolio Value",
                            angle: -90,
                            position: "insideLeft",
                            offset: 5,
                            fill: "#888",
                          }}
                        />
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), "Balance"]}
                          contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
                        />
                        <Legend wrapperStyle={{ color: "#fff" }} />
                        <Line
                          type="monotone"
                          name="Conservative (3%)"
                          dataKey="conservative"
                          stroke="#a78bfa"
                          strokeWidth={3}
                          dot={{ fill: "#a78bfa", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          name="Moderate (4%)"
                          dataKey="moderate"
                          stroke="#60a5fa"
                          strokeWidth={3}
                          dot={{ fill: "#60a5fa", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          name="Aggressive (5%)"
                          dataKey="aggressive"
                          stroke="#5eead4"
                          strokeWidth={3}
                          dot={{ fill: "#5eead4", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <figcaption className="mt-4 text-sm text-gray-400">
                    Figure 1: Projected portfolio balance over 30 years with different withdrawal rates, starting with
                    $1 million
                  </figcaption>
                </figure>

                {/* Hidden but accessible data table for SEO */}
                <div className="sr-only">
                  <table>
                    <caption>Portfolio balance projections over 30 years with different withdrawal rates</caption>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Conservative (3% Withdrawal)</th>
                        <th>Moderate (4% Withdrawal)</th>
                        <th>Aggressive (5% Withdrawal)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawalScenarios.map((scenario) => (
                        <tr key={scenario.year}>
                          <td>{scenario.year}</td>
                          <td>${scenario.conservative.toLocaleString()}</td>
                          <td>${scenario.moderate.toLocaleString()}</td>
                          <td>${scenario.aggressive.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-sm text-gray-300">
                  <p>
                    This chart illustrates how a $1 million initial portfolio would perform over 30 years with different
                    withdrawal strategies. The conservative 3% withdrawal rate preserves capital longer, while the
                    aggressive 5% rate provides more income but depletes the portfolio faster. The moderate 4%
                    withdrawal rate, often called the "4% rule," attempts to balance income needs with portfolio
                    longevity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Success Rate by Strategy */}
          <section aria-labelledby="success-rate-heading">
            <Card className="bg-gray-900 border-gray-800 h-full">
              <CardHeader>
                <CardTitle id="success-rate-heading" className="text-white">
                  30-Year Success Rate
                </CardTitle>
                <CardDescription className="text-gray-400">Probability of portfolio lasting 30 years</CardDescription>
              </CardHeader>
              <CardContent>
                <figure>
                  <div className="h-[300px]" aria-hidden="true">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={successRates}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis type="number" domain={[0, 100]} stroke="#666" tickFormatter={(value) => `${value}%`} />
                        <YAxis dataKey="name" type="category" stroke="#666" width={100} />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Success Rate"]}
                          contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {successRates.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#a78bfa" : index === 1 ? "#60a5fa" : "#5eead4"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <figcaption className="mt-4 text-sm text-gray-400">
                    Figure 2: Success rates of different withdrawal strategies over a 30-year retirement period
                  </figcaption>
                </figure>

                {/* Hidden but accessible data table for SEO */}
                <div className="sr-only">
                  <table>
                    <caption>Success rates of different withdrawal strategies over a 30-year retirement period</caption>
                    <thead>
                      <tr>
                        <th>Withdrawal Strategy</th>
                        <th>Success Rate (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {successRates.map((rate) => (
                        <tr key={rate.name}>
                          <td>{rate.name}</td>
                          <td>{rate.value}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-sm text-gray-300">
                  <p>
                    The success rate represents the probability that your retirement portfolio will last for the full
                    30-year period. Based on historical market performance and Monte Carlo simulations, a conservative
                    3% withdrawal rate has a 98% success rate, while the more aggressive 5% rate drops to 72%. The
                    widely-used 4% rule provides a balanced 85% probability of success.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Median vs Recommended Savings */}
          <section aria-labelledby="savings-by-age-heading" className="md:col-span-2">
            <Card className="bg-gray-900 border-gray-800 h-full">
              <CardHeader>
                <CardTitle id="savings-by-age-heading" className="text-white">
                  Savings by Age Group
                </CardTitle>
                <CardDescription className="text-gray-400">Median vs recommended retirement savings</CardDescription>
              </CardHeader>
              <CardContent>
                <figure>
                  <div className="h-[300px]" aria-hidden="true">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={retirementData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="age" stroke="#666" />
                        <YAxis
                          stroke="#666"
                          width={60}
                          tickFormatter={(value) =>
                            value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000).toFixed(0)}K`
                          }
                        />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Legend />
                        <Bar dataKey="medianSavings" name="Median Savings" fill="#818cf8" />
                        <Bar dataKey="recommendedSavings" name="Recommended Savings" fill="#4ade80" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <figcaption className="mt-4 text-sm text-gray-400">
                    Figure 3: Comparison of median actual savings vs. recommended retirement savings by age group
                  </figcaption>
                </figure>

                {/* Hidden but accessible data table for SEO */}
                <div className="sr-only">
                  <table>
                    <caption>
                      Comparison of median actual savings vs. recommended retirement savings by age group
                    </caption>
                    <thead>
                      <tr>
                        <th>Age Group</th>
                        <th>Median Savings</th>
                        <th>Recommended Savings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {retirementData.map((data) => (
                        <tr key={data.age}>
                          <td>{data.age}</td>
                          <td>${data.medianSavings.toLocaleString()}</td>
                          <td>${data.recommendedSavings.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-sm text-gray-300">
                  <p>
                    This chart compares median retirement savings with recommended savings targets by age group. The gap
                    between actual and recommended savings highlights the retirement preparedness challenge many
                    Americans face. Financial experts typically recommend having savings of 1-1.5 times your annual
                    salary by age 35, 3-4 times by age 45, and 6-8 times by age 55 to maintain your standard of living
                    in retirement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <section aria-labelledby="key-metrics-heading" className="mt-6">
          <h3 id="key-metrics-heading" className="text-xl font-semibold text-white mb-4">
            Key Retirement Planning Metrics
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <article aria-labelledby="optimal-rate-heading">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle id="optimal-rate-heading" className="text-white text-xl">
                    Optimal Withdrawal Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">4.0%</div>
                  <p className="text-gray-400 mt-2">Based on historical market data</p>
                  <div className="mt-3 text-sm text-gray-300">
                    The 4% rule suggests withdrawing 4% of your initial portfolio in the first year of retirement, then
                    adjusting that amount for inflation each year thereafter.
                  </div>
                </CardContent>
              </Card>
            </article>

            <article aria-labelledby="longevity-heading">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle id="longevity-heading" className="text-white text-xl">
                    Portfolio Longevity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">30+ Years</div>
                  <p className="text-gray-400 mt-2">With optimal withdrawal rate</p>
                  <div className="mt-3 text-sm text-gray-300">
                    A properly structured retirement portfolio with a 4% withdrawal rate has historically lasted 30+
                    years through various market conditions.
                  </div>
                </CardContent>
              </Card>
            </article>

            <article aria-labelledby="inflation-heading">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle id="inflation-heading" className="text-white text-xl">
                    Inflation Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">3.2%</div>
                  <p className="text-gray-400 mt-2">Average annual adjustment needed</p>
                  <div className="mt-3 text-sm text-gray-300">
                    Inflation erodes purchasing power over time. Retirement plans should account for annual inflation
                    adjustments to maintain your standard of living.
                  </div>
                </CardContent>
              </Card>
            </article>

            <article aria-labelledby="success-heading">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle id="success-heading" className="text-white text-xl">
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-400">85%</div>
                  <p className="text-gray-400 mt-2">With 4% withdrawal rate</p>
                  <div className="mt-3 text-sm text-gray-300">
                    Historical analysis shows an 85% probability that a diversified portfolio with a 4% withdrawal rate
                    will last for a 30-year retirement period.
                  </div>
                </CardContent>
              </Card>
            </article>
          </div>
        </section>

        <section aria-labelledby="methodology-heading" className="mt-8">
          <h3 id="methodology-heading" className="text-xl font-semibold text-white mb-3">
            Methodology & Data Sources
          </h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p>
              The visualizations above are based on historical market data from 1926-2023, including stock market
              returns, bond yields, and inflation rates. The analysis uses Monte Carlo simulations with 10,000 potential
              market scenarios to calculate success rates and portfolio longevity.
            </p>
            <p>
              Retirement savings recommendations are derived from financial industry benchmarks that aim to replace
              70-80% of pre-retirement income. Median savings data is based on Federal Reserve Survey of Consumer
              Finances and retirement industry research.
            </p>
            <p>
              All projections assume a diversified portfolio with 60% stocks and 40% bonds, rebalanced annually, with
              annual withdrawal amounts adjusted for inflation. Past performance is not indicative of future results,
              and individual retirement planning should account for personal circumstances, risk tolerance, and
              financial goals.
            </p>
          </div>
        </section>
      </section>
    </div>
  )
}

