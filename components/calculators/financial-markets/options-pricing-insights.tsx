"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

// Sample data for visualizations
const optionsPricingData = {
  volatilityImpact: [
    { volatility: 10, callPrice: 3.78, putPrice: 2.12 },
    { volatility: 15, callPrice: 5.31, putPrice: 3.65 },
    { volatility: 20, callPrice: 6.76, putPrice: 5.1 },
    { volatility: 25, callPrice: 8.17, putPrice: 6.51 },
    { volatility: 30, callPrice: 9.54, putPrice: 7.88 },
    { volatility: 35, callPrice: 10.89, putPrice: 9.23 },
    { volatility: 40, callPrice: 12.22, putPrice: 10.56 },
    { volatility: 45, callPrice: 13.53, putPrice: 11.87 },
    { volatility: 50, callPrice: 14.83, putPrice: 13.17 },
  ],
  timeDecay: [
    { daysToExpiry: 90, callTheta: -0.052, putTheta: -0.037 },
    { daysToExpiry: 60, callTheta: -0.078, putTheta: -0.063 },
    { daysToExpiry: 45, callTheta: -0.104, putTheta: -0.089 },
    { daysToExpiry: 30, callTheta: -0.156, putTheta: -0.141 },
    { daysToExpiry: 21, callTheta: -0.223, putTheta: -0.208 },
    { daysToExpiry: 14, callTheta: -0.334, putTheta: -0.319 },
    { daysToExpiry: 7, callTheta: -0.668, putTheta: -0.653 },
    { daysToExpiry: 3, callTheta: -1.557, putTheta: -1.542 },
    { daysToExpiry: 1, callTheta: -4.671, putTheta: -4.656 },
  ],
  optionStrategies: [
    { strategy: "Long Call", maxLoss: -5, maxGain: 15, probability: 35, complexity: 1 },
    { strategy: "Long Put", maxLoss: -5, maxGain: 15, probability: 35, complexity: 1 },
    { strategy: "Covered Call", maxLoss: -45, maxGain: 5, probability: 65, complexity: 2 },
    { strategy: "Cash-Secured Put", maxLoss: -45, maxGain: 5, probability: 65, complexity: 2 },
    { strategy: "Bull Call Spread", maxLoss: -3, maxGain: 7, probability: 45, complexity: 3 },
    { strategy: "Bear Put Spread", maxLoss: -3, maxGain: 7, probability: 45, complexity: 3 },
    { strategy: "Iron Condor", maxLoss: -6, maxGain: 4, probability: 70, complexity: 4 },
    { strategy: "Butterfly", maxLoss: -2, maxGain: 8, probability: 25, complexity: 5 },
  ],
  greeksSensitivity: [
    { moneyness: -20, delta: 0.12, gamma: 0.028, vega: 0.15 },
    { moneyness: -15, delta: 0.24, gamma: 0.042, vega: 0.19 },
    { moneyness: -10, delta: 0.37, gamma: 0.053, vega: 0.21 },
    { moneyness: -5, delta: 0.48, gamma: 0.059, vega: 0.22 },
    { moneyness: 0, delta: 0.5, gamma: 0.06, vega: 0.22 },
    { moneyness: 5, delta: 0.62, gamma: 0.059, vega: 0.21 },
    { moneyness: 10, delta: 0.73, gamma: 0.053, vega: 0.19 },
    { moneyness: 15, delta: 0.82, gamma: 0.042, vega: 0.15 },
    { moneyness: 20, delta: 0.89, gamma: 0.028, vega: 0.1 },
  ],
}

export const OptionsPricingInsights = () => {
  return (
    <div className="mt-10 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Options Pricing Insights</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Explore key concepts in options pricing, volatility effects, time decay, and popular trading strategies.
        </p>
      </div>

      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <Tabs defaultValue="volatility" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="volatility">Volatility Impact</TabsTrigger>
              <TabsTrigger value="timeDecay">Time Decay</TabsTrigger>
              <TabsTrigger value="strategies">Option Strategies</TabsTrigger>
              <TabsTrigger value="greeks">Greeks Sensitivity</TabsTrigger>
            </TabsList>

            <TabsContent value="volatility" className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Impact of Volatility on Option Prices</h3>
                <p className="text-gray-300 mb-6">
                  Volatility is one of the most significant factors affecting option prices. Higher implied volatility
                  leads to higher option premiums for both calls and puts.
                </p>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={optionsPricingData.volatilityImpact}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                      <XAxis
                        dataKey="volatility"
                        label={{
                          value: "Implied Volatility (%)",
                          position: "insideBottom",
                          offset: -25,
                          fill: "#fff",
                        }}
                        tick={{ fill: "#fff" }}
                      />
                      <YAxis
                        label={{
                          value: "Option Price ($)",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                          fill: "#fff",
                        }}
                        tick={{ fill: "#fff" }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                        formatter={(value) => [`$${value}`, ""]}
                        labelFormatter={(label) => `Volatility: ${label}%`}
                      />
                      <Legend wrapperStyle={{ color: "#fff" }} verticalAlign="top" height={36} />
                      <Line
                        type="monotone"
                        dataKey="callPrice"
                        name="Call Option Price"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ fill: "#8884d8", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="putPrice"
                        name="Put Option Price"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={{ fill: "#82ca9d", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-gray-300">
                  <p className="text-sm">
                    <strong>Key Insight:</strong> A 10% increase in implied volatility can increase option prices by
                    30-50%, depending on strike price and time to expiration.
                  </p>
                </div>
              </div>

              {/* Hidden table for SEO */}
              <table className="sr-only">
                <caption>Impact of Volatility on Option Prices</caption>
                <thead>
                  <tr>
                    <th>Implied Volatility (%)</th>
                    <th>Call Option Price ($)</th>
                    <th>Put Option Price ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {optionsPricingData.volatilityImpact.map((item, index) => (
                    <tr key={index}>
                      <td>{item.volatility}%</td>
                      <td>${item.callPrice.toFixed(2)}</td>
                      <td>${item.putPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="timeDecay" className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Option Time Decay (Theta)</h3>
                <p className="text-gray-300 mb-6">
                  Time decay accelerates as options approach expiration. This chart shows how theta (daily time decay)
                  increases exponentially in the final weeks.
                </p>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={optionsPricingData.timeDecay}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                      <XAxis
                        dataKey="daysToExpiry"
                        label={{ value: "Days to Expiration", position: "insideBottom", offset: -25, fill: "#fff" }}
                        tick={{ fill: "#fff" }}
                      />
                      <YAxis
                        label={{
                          value: "Daily Theta Value ($)",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                          fill: "#fff",
                        }}
                        tick={{ fill: "#fff" }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                        formatter={(value) => [`$${Math.abs(value).toFixed(3)}`, ""]}
                        labelFormatter={(label) => `Days to Expiry: ${label}`}
                      />
                      <Legend wrapperStyle={{ color: "#fff" }} verticalAlign="top" height={36} />
                      <Area
                        type="monotone"
                        dataKey="callTheta"
                        name="Call Theta (Daily Loss)"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="putTheta"
                        name="Put Theta (Daily Loss)"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-gray-300">
                  <p className="text-sm">
                    <strong>Key Insight:</strong> Time decay is not linear. It accelerates dramatically in the final 30
                    days before expiration, with the steepest decay in the last week.
                  </p>
                </div>
              </div>

              {/* Hidden table for SEO */}
              <table className="sr-only">
                <caption>Option Time Decay (Theta)</caption>
                <thead>
                  <tr>
                    <th>Days to Expiration</th>
                    <th>Call Theta (Daily Loss)</th>
                    <th>Put Theta (Daily Loss)</th>
                  </tr>
                </thead>
                <tbody>
                  {optionsPricingData.timeDecay.map((item, index) => (
                    <tr key={index}>
                      <td>{item.daysToExpiry} days</td>
                      <td>${Math.abs(item.callTheta).toFixed(3)}</td>
                      <td>${Math.abs(item.putTheta).toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="strategies" className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Popular Option Strategies: Risk vs. Reward</h3>
                <p className="text-gray-300 mb-6">
                  Different option strategies offer varying risk-reward profiles and probability of success. Size
                  represents strategy complexity.
                </p>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                      <XAxis
                        type="number"
                        dataKey="maxLoss"
                        name="Max Loss"
                        label={{ value: "Maximum Loss ($)", position: "insideBottom", offset: -25, fill: "#fff" }}
                        domain={[-50, 0]}
                        tick={{ fill: "#fff" }}
                      />
                      <YAxis
                        type="number"
                        dataKey="maxGain"
                        name="Max Gain"
                        label={{
                          value: "Maximum Gain ($)",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                          fill: "#fff",
                        }}
                        tick={{ fill: "#fff" }}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-gray-800 p-3 rounded shadow-lg border border-gray-700">
                                <p className="font-bold text-white">{data.strategy}</p>
                                <p className="text-gray-300">Max Loss: ${data.maxLoss}</p>
                                <p className="text-gray-300">Max Gain: ${data.maxGain}</p>
                                <p className="text-gray-300">Probability: {data.probability}%</p>
                                <p className="text-gray-300">Complexity: {data.complexity}/5</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend wrapperStyle={{ color: "#fff" }} verticalAlign="top" height={36} />
                      <Scatter name="Option Strategies" data={optionsPricingData.optionStrategies} fill="#8884d8">
                        {optionsPricingData.optionStrategies.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.probability > 50 ? "#82ca9d" : "#8884d8"}
                            r={entry.complexity * 4 + 5}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-gray-300">
                  <p className="text-sm">
                    <strong>Key Insight:</strong> Higher probability strategies (green) typically have lower potential
                    returns but higher success rates. Bubble size indicates strategy complexity.
                  </p>
                </div>
              </div>

              {/* Hidden table for SEO */}
              <table className="sr-only">
                <caption>Popular Option Strategies: Risk vs. Reward</caption>
                <thead>
                  <tr>
                    <th>Strategy</th>
                    <th>Maximum Loss</th>
                    <th>Maximum Gain</th>
                    <th>Probability of Profit</th>
                    <th>Complexity</th>
                  </tr>
                </thead>
                <tbody>
                  {optionsPricingData.optionStrategies.map((item, index) => (
                    <tr key={index}>
                      <td>{item.strategy}</td>
                      <td>${item.maxLoss}</td>
                      <td>${item.maxGain}</td>
                      <td>{item.probability}%</td>
                      <td>{item.complexity}/5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="greeks" className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Option Greeks by Moneyness</h3>
                <p className="text-gray-300 mb-6">
                  Option Greeks vary significantly based on how far in-the-money or out-of-the-money an option is. This
                  chart shows Delta, Gamma, and Vega across different moneyness levels.
                </p>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={optionsPricingData.greeksSensitivity}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                      <XAxis
                        dataKey="moneyness"
                        label={{
                          value: "Moneyness (% from ATM)",
                          position: "insideBottom",
                          offset: -25,
                          fill: "#fff",
                        }}
                        tick={{ fill: "#fff" }}
                      />
                      <YAxis
                        label={{ value: "Greek Value", angle: -90, position: "insideLeft", offset: 10, fill: "#fff" }}
                        tick={{ fill: "#fff" }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                        formatter={(value) => [value.toFixed(3), ""]}
                        labelFormatter={(label) => `Moneyness: ${label}%`}
                      />
                      <Legend wrapperStyle={{ color: "#fff" }} verticalAlign="top" height={36} />
                      <Line
                        type="monotone"
                        dataKey="delta"
                        name="Delta"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ fill: "#8884d8", r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="gamma"
                        name="Gamma"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={{ fill: "#82ca9d", r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="vega"
                        name="Vega"
                        stroke="#ffc658"
                        strokeWidth={2}
                        dot={{ fill: "#ffc658", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-gray-300">
                  <p className="text-sm">
                    <strong>Key Insight:</strong> Delta approaches 1.0 for deep in-the-money options, while Gamma and
                    Vega peak near at-the-money and decrease as options move further in or out of the money.
                  </p>
                </div>
              </div>

              {/* Hidden table for SEO */}
              <table className="sr-only">
                <caption>Option Greeks by Moneyness</caption>
                <thead>
                  <tr>
                    <th>Moneyness (%)</th>
                    <th>Delta</th>
                    <th>Gamma</th>
                    <th>Vega</th>
                  </tr>
                </thead>
                <tbody>
                  {optionsPricingData.greeksSensitivity.map((item, index) => (
                    <tr key={index}>
                      <td>{item.moneyness}%</td>
                      <td>{item.delta.toFixed(2)}</td>
                      <td>{item.gamma.toFixed(3)}</td>
                      <td>{item.vega.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
        <h2>Understanding Options Pricing</h2>
        <p>
          Options pricing is influenced by several key factors, with the Black-Scholes model being the most widely used
          pricing framework. The model incorporates stock price, strike price, time to expiration, volatility, risk-free
          interest rate, and dividends to calculate theoretical option values.
        </p>

        <h3>Key Factors Affecting Options Prices</h3>
        <ul>
          <li>
            <strong>Implied Volatility:</strong> Higher volatility increases option premiums for both calls and puts, as
            it represents greater potential price movement in the underlying asset.
          </li>
          <li>
            <strong>Time to Expiration:</strong> Options lose value over time due to time decay (theta), which
            accelerates as expiration approaches.
          </li>
          <li>
            <strong>Underlying Price Movement:</strong> Call options gain value when the underlying asset rises, while
            put options gain value when it falls.
          </li>
          <li>
            <strong>Interest Rates:</strong> Higher interest rates generally increase call option prices and decrease
            put option prices.
          </li>
          <li>
            <strong>Dividends:</strong> Expected dividends typically reduce call option values and increase put option
            values.
          </li>
        </ul>

        <h3>Understanding Option Greeks</h3>
        <p>Option Greeks measure how option prices respond to changes in various factors:</p>
        <ul>
          <li>
            <strong>Delta:</strong> Measures the rate of change in an option's price relative to changes in the
            underlying asset's price.
          </li>
          <li>
            <strong>Gamma:</strong> Measures the rate of change in delta relative to changes in the underlying asset's
            price.
          </li>
          <li>
            <strong>Theta:</strong> Measures the rate of change in an option's price relative to the passage of time.
          </li>
          <li>
            <strong>Vega:</strong> Measures the rate of change in an option's price relative to changes in implied
            volatility.
          </li>
          <li>
            <strong>Rho:</strong> Measures the rate of change in an option's price relative to changes in interest
            rates.
          </li>
        </ul>

        <h3>Common Options Trading Strategies</h3>
        <p>Traders use various strategies to capitalize on different market conditions:</p>
        <ul>
          <li>
            <strong>Covered Calls:</strong> Selling call options against owned stock to generate income.
          </li>
          <li>
            <strong>Protective Puts:</strong> Buying put options to protect against downside risk in owned stock.
          </li>
          <li>
            <strong>Bull Call Spreads:</strong> Buying a lower strike call and selling a higher strike call to profit
            from moderate price increases.
          </li>
          <li>
            <strong>Bear Put Spreads:</strong> Buying a higher strike put and selling a lower strike put to profit from
            moderate price decreases.
          </li>
          <li>
            <strong>Iron Condors:</strong> Selling both a call spread and a put spread to profit from low volatility and
            range-bound markets.
          </li>
          <li>
            <strong>Straddles and Strangles:</strong> Buying both calls and puts to profit from significant price
            movements in either direction.
          </li>
        </ul>

        <h3>Options Risk Management</h3>
        <p>Effective risk management is crucial in options trading:</p>
        <ul>
          <li>Position sizing based on account size and risk tolerance</li>
          <li>Understanding maximum potential loss before entering trades</li>
          <li>Using defined-risk strategies when appropriate</li>
          <li>Monitoring and adjusting positions as market conditions change</li>
          <li>Setting clear exit criteria for both profit targets and stop losses</li>
        </ul>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">What is the Black-Scholes model?</h3>
            <p className="text-muted-foreground">
              The Black-Scholes model is a mathematical formula used to calculate the theoretical price of
              European-style options. It considers factors like stock price, strike price, time to expiration,
              volatility, and risk-free interest rate.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Why does implied volatility affect option prices?</h3>
            <p className="text-muted-foreground">
              Implied volatility represents the market's expectation of how much the underlying asset might move. Higher
              volatility means greater potential price movement, which increases the chance that an option will expire
              in-the-money, thus increasing its premium.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">What causes time decay to accelerate near expiration?</h3>
            <p className="text-muted-foreground">
              Time decay (theta) accelerates near expiration because there's less time for the underlying asset to make
              favorable moves. The time value portion of an option's premium erodes more quickly as the expiration date
              approaches, especially in the final 30 days.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">How do I choose between different option strategies?</h3>
            <p className="text-muted-foreground">
              The choice depends on your market outlook, risk tolerance, and objectives. Consider factors like expected
              price movement, volatility expectations, time horizon, and whether you're seeking income, protection, or
              speculation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">What's the difference between historical and implied volatility?</h3>
            <p className="text-muted-foreground">
              Historical volatility measures past price movements of the underlying asset, while implied volatility is
              derived from current option prices and represents the market's expectation of future volatility. Options
              pricing models use implied volatility.
            </p>
          </div>
        </div>
      </div>

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Options Pricing Data",
            description:
              "Comprehensive data on options pricing, including volatility impact, time decay, option strategies, and Greeks sensitivity.",
            keywords: [
              "options pricing",
              "Black-Scholes model",
              "option Greeks",
              "implied volatility",
              "time decay",
              "options trading strategies",
            ],
            creator: {
              "@type": "Organization",
              name: "Calculator Directory",
            },
            variableMeasured: [
              {
                "@type": "PropertyValue",
                name: "Implied Volatility",
                description: "The market's expectation of future volatility",
              },
              {
                "@type": "PropertyValue",
                name: "Option Greeks",
                description: "Measurements of option price sensitivity to various factors",
              },
              {
                "@type": "PropertyValue",
                name: "Time Decay",
                description: "The rate at which options lose value over time",
              },
            ],
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
                name: "What is the Black-Scholes model?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The Black-Scholes model is a mathematical formula used to calculate the theoretical price of European-style options. It considers factors like stock price, strike price, time to expiration, volatility, and risk-free interest rate.",
                },
              },
              {
                "@type": "Question",
                name: "Why does implied volatility affect option prices?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Implied volatility represents the market's expectation of how much the underlying asset might move. Higher volatility means greater potential price movement, which increases the chance that an option will expire in-the-money, thus increasing its premium.",
                },
              },
              {
                "@type": "Question",
                name: "What causes time decay to accelerate near expiration?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Time decay (theta) accelerates near expiration because there's less time for the underlying asset to make favorable moves. The time value portion of an option's premium erodes more quickly as the expiration date approaches, especially in the final 30 days.",
                },
              },
              {
                "@type": "Question",
                name: "How do I choose between different option strategies?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The choice depends on your market outlook, risk tolerance, and objectives. Consider factors like expected price movement, volatility expectations, time horizon, and whether you're seeking income, protection, or speculation.",
                },
              },
              {
                "@type": "Question",
                name: "What's the difference between historical and implied volatility?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Historical volatility measures past price movements of the underlying asset, while implied volatility is derived from current option prices and represents the market's expectation of future volatility. Options pricing models use implied volatility.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}

