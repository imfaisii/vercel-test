"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for efficient frontier
const efficientFrontierData = [
  { risk: 2, return: 2, allocation: "100% Bonds" },
  { risk: 4, return: 3.5, allocation: "80% Bonds, 20% Stocks" },
  { risk: 6, return: 5, allocation: "60% Bonds, 40% Stocks" },
  { risk: 8, return: 6.5, allocation: "40% Bonds, 60% Stocks" },
  { risk: 10, return: 8, allocation: "20% Bonds, 80% Stocks" },
  { risk: 15, return: 10, allocation: "100% Stocks" },
]

// Sample data for asset class returns
const assetClassReturnsData = [
  { name: "US Stocks", return: 10.5, risk: 15.7 },
  { name: "Int'l Stocks", return: 8.2, risk: 17.5 },
  { name: "US Bonds", return: 3.8, risk: 5.2 },
  { name: "REITs", return: 9.3, risk: 14.8 },
  { name: "Gold", return: 5.2, risk: 16.8 },
  { name: "Cash", return: 1.2, risk: 0.9 },
]

// Sample data for diversification benefits
const diversificationData = [
  { year: "2018", undiversified: -4.5, diversified: -2.1 },
  { year: "2019", undiversified: 31.2, diversified: 22.5 },
  { year: "2020", undiversified: 18.4, diversified: 14.7 },
  { year: "2021", undiversified: 28.7, diversified: 19.8 },
  { year: "2022", undiversified: -18.1, diversified: -11.2 },
  { year: "2023", undiversified: 24.2, diversified: 17.5 },
]

// Sample data for historical portfolio performance
const historicalPerformanceData = [
  { year: 2000, conservative: -0.9, balanced: -2.8, aggressive: -9.1 },
  { year: 2001, conservative: 3.7, balanced: -0.6, aggressive: -11.9 },
  { year: 2002, conservative: 8.3, balanced: 3.6, aggressive: -13.4 },
  { year: 2003, conservative: 8.5, balanced: 14.3, aggressive: 28.7 },
  { year: 2004, conservative: 6.8, balanced: 8.7, aggressive: 12.5 },
  { year: 2005, conservative: 4.1, balanced: 5.9, aggressive: 7.8 },
  { year: 2006, conservative: 7.3, balanced: 10.4, aggressive: 15.8 },
  { year: 2007, conservative: 7.8, balanced: 7.1, aggressive: 5.5 },
  { year: 2008, conservative: -2.4, balanced: -16.4, aggressive: -33.8 },
  { year: 2009, conservative: 11.1, balanced: 19.5, aggressive: 28.3 },
  { year: 2010, conservative: 9.4, balanced: 11.9, aggressive: 15.1 },
]

export default function PortfolioAllocationInsights() {
  const [activeTab, setActiveTab] = useState("efficient-frontier")

  return (
    <div className="space-y-8 mt-8">
      <div className="hidden">
        <h2 id="portfolio-allocation-insights">Portfolio Allocation Insights</h2>
        <p>
          This section provides data visualizations and insights about portfolio allocation strategies, the efficient
          frontier, asset class performance, and diversification benefits. The data is presented in accessible tables
          and interactive charts.
        </p>

        <h3>Efficient Frontier Data</h3>
        <table>
          <caption>Risk vs. Return for Different Portfolio Allocations</caption>
          <thead>
            <tr>
              <th>Risk (%)</th>
              <th>Return (%)</th>
              <th>Allocation</th>
            </tr>
          </thead>
          <tbody>
            {efficientFrontierData.map((item, index) => (
              <tr key={index}>
                <td>{item.risk}</td>
                <td>{item.return}</td>
                <td>{item.allocation}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Asset Class Returns Data</h3>
        <table>
          <caption>Historical Returns and Risk by Asset Class</caption>
          <thead>
            <tr>
              <th>Asset Class</th>
              <th>Average Annual Return (%)</th>
              <th>Risk/Volatility (%)</th>
            </tr>
          </thead>
          <tbody>
            {assetClassReturnsData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.return}</td>
                <td>{item.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Diversification Benefits Data</h3>
        <table>
          <caption>Diversified vs. Undiversified Portfolio Performance</caption>
          <thead>
            <tr>
              <th>Year</th>
              <th>Undiversified Return (%)</th>
              <th>Diversified Return (%)</th>
            </tr>
          </thead>
          <tbody>
            {diversificationData.map((item, index) => (
              <tr key={index}>
                <td>{item.year}</td>
                <td>{item.undiversified}</td>
                <td>{item.diversified}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Historical Portfolio Performance Data</h3>
        <table>
          <caption>Annual Returns by Portfolio Type (2000-2010)</caption>
          <thead>
            <tr>
              <th>Year</th>
              <th>Conservative Portfolio (%)</th>
              <th>Balanced Portfolio (%)</th>
              <th>Aggressive Portfolio (%)</th>
            </tr>
          </thead>
          <tbody>
            {historicalPerformanceData.map((item, index) => (
              <tr key={index}>
                <td>{item.year}</td>
                <td>{item.conservative}</td>
                <td>{item.balanced}</td>
                <td>{item.aggressive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Portfolio Allocation Insights</CardTitle>
          <CardDescription>
            Explore data visualizations on asset allocation strategies, risk vs. return, and diversification benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="efficient-frontier">Efficient Frontier</TabsTrigger>
              <TabsTrigger value="asset-returns">Asset Returns</TabsTrigger>
              <TabsTrigger value="diversification">Diversification</TabsTrigger>
              <TabsTrigger value="historical">Historical Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="efficient-frontier" className="space-y-4">
              <div className="bg-black p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-white">The Efficient Frontier</h3>
                <p className="text-gray-300 mb-4">
                  The efficient frontier represents the optimal portfolios that offer the highest expected return for a
                  defined level of risk.
                </p>
                <div className="h-[400px]" aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis
                        type="number"
                        dataKey="risk"
                        name="Risk"
                        unit="%"
                        domain={[0, 16]}
                        label={{ value: "Risk (%)", position: "bottom", fill: "#aaa" }}
                        tick={{ fill: "#aaa" }}
                      />
                      <YAxis
                        type="number"
                        dataKey="return"
                        name="Return"
                        unit="%"
                        domain={[0, 12]}
                        label={{ value: "Return (%)", angle: -90, position: "left", fill: "#aaa" }}
                        tick={{ fill: "#aaa" }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, ""]}
                        labelFormatter={(value) => `Risk: ${value}%`}
                        contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                      />
                      <Scatter
                        name="Portfolio"
                        data={efficientFrontierData}
                        fill="#8884d8"
                        line={{ stroke: "#8884d8", strokeWidth: 2 }}
                      >
                        {efficientFrontierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 ? "#8884d8" : "#4dabf7"} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-white mb-2">Key Insights:</h4>
                  <ul className="list-disc pl-5 text-gray-300 space-y-1">
                    <li>Moving from bonds to stocks increases both potential returns and risk</li>
                    <li>The curve illustrates the risk/return tradeoff in portfolio construction</li>
                    <li>Portfolios on the efficient frontier maximize return for a given level of risk</li>
                    <li>Your optimal portfolio depends on your risk tolerance and investment timeline</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="asset-returns" className="space-y-4">
              <div className="bg-black p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-white">Asset Class Risk vs. Return</h3>
                <p className="text-gray-300 mb-4">
                  Different asset classes offer varying levels of historical returns and volatility (risk).
                </p>
                <div className="h-[400px]" aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis
                        type="number"
                        dataKey="risk"
                        name="Risk"
                        unit="%"
                        domain={[0, 20]}
                        label={{ value: "Risk/Volatility (%)", position: "bottom", fill: "#aaa" }}
                        tick={{ fill: "#aaa" }}
                      />
                      <YAxis
                        type="number"
                        dataKey="return"
                        name="Return"
                        unit="%"
                        domain={[0, 12]}
                        label={{ value: "Average Annual Return (%)", angle: -90, position: "left", fill: "#aaa" }}
                        tick={{ fill: "#aaa" }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
                        labelFormatter={(name) => `${name}`}
                        contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                      />
                      <Scatter name="Asset Classes" data={assetClassReturnsData} fill="#8884d8">
                        {assetClassReturnsData.map((entry, index) => {
                          const colors = ["#8884d8", "#4dabf7", "#82ca9d", "#ffc658", "#ff8042", "#ba68c8"]
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        })}
                      </Scatter>
                      <Legend formatter={(value) => <span style={{ color: "#aaa" }}>{value}</span>} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-white mb-2">Key Insights:</h4>
                  <ul className="list-disc pl-5 text-gray-300 space-y-1">
                    <li>US Stocks have historically provided the highest returns but with high volatility</li>
                    <li>Bonds offer moderate returns with lower risk</li>
                    <li>Cash provides the lowest risk but also the lowest returns</li>
                    <li>REITs can offer stock-like returns with slightly lower volatility</li>
                    <li>Gold has moderate returns but high volatility</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="diversification" className="space-y-4">
              <div className="bg-black p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-white">Benefits of Diversification</h3>
                <p className="text-gray-300 mb-4">
                  Diversified portfolios typically experience less volatility while capturing most of the upside.
                </p>
                <div className="h-[400px]" aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={diversificationData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 40,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="year" tick={{ fill: "#aaa" }} />
                      <YAxis
                        label={{ value: "Annual Return (%)", angle: -90, position: "left", fill: "#aaa" }}
                        tick={{ fill: "#aaa" }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
                        contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                      />
                      <Legend formatter={(value) => <span style={{ color: "#aaa" }}>{value}</span>} />
                      <Bar dataKey="undiversified" name="Single Asset (S&P 500)" fill="#8884d8" />
                      <Bar dataKey="diversified" name="Diversified Portfolio" fill="#4dabf7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-white mb-2">Key Insights:</h4>
                  <ul className="list-disc pl-5 text-gray-300 space-y-1">
                    <li>Diversified portfolios typically experience less severe downturns (2022)</li>
                    <li>
                      During bull markets, diversified portfolios may underperform the best-performing asset class
                    </li>
                    <li>Over time, diversification helps reduce portfolio volatility</li>
                    <li>Lower volatility can lead to better long-term compounding</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="historical" className="space-y-4">
              <div className="bg-black p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-white">Historical Portfolio Performance</h3>
                <p className="text-gray-300 mb-4">
                  Different portfolio allocations perform differently across market cycles (2000-2010).
                </p>
                <div className="h-[400px]" aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicalPerformanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 40,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="year" tick={{ fill: "#aaa" }} />
                      <YAxis
                        label={{ value: "Annual Return (%)", angle: -90, position: "left", fill: "#aaa" }}
                        tick={{ fill: "#aaa" }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
                        contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                      />
                      <Legend formatter={(value) => <span style={{ color: "#aaa" }}>{value}</span>} />
                      <Line
                        type="monotone"
                        dataKey="conservative"
                        name="Conservative (20/80)"
                        stroke="#4dabf7"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="balanced"
                        name="Balanced (60/40)"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="aggressive"
                        name="Aggressive (80/20)"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-white mb-2">Key Insights:</h4>
                  <ul className="list-disc pl-5 text-gray-300 space-y-1">
                    <li>
                      Conservative portfolios (20% stocks/80% bonds) provided more stability during market crashes
                      (2001-2002, 2008)
                    </li>
                    <li>
                      Aggressive portfolios (80% stocks/20% bonds) delivered higher returns during bull markets (2003,
                      2009)
                    </li>
                    <li>
                      Balanced portfolios (60% stocks/40% bonds) offered a middle ground between growth and stability
                    </li>
                    <li>Different allocations perform better in different market environments</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Understanding Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Asset allocation is the process of dividing your investments among different asset classes such as stocks,
              bonds, and cash to balance risk and reward according to your specific goals, risk tolerance, and
              investment timeline.
            </p>
            <h3 className="text-lg font-medium">The Three Main Asset Classes</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Stocks:</strong> Higher potential returns with higher volatility
              </li>
              <li>
                <strong>Bonds:</strong> Moderate returns with lower volatility
              </li>
              <li>
                <strong>Cash:</strong> Lowest returns with minimal volatility
              </li>
            </ul>
            <h3 className="text-lg font-medium">Alternative Asset Classes</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Real Estate:</strong> Through REITs or direct ownership
              </li>
              <li>
                <strong>Commodities:</strong> Including gold, silver, and other natural resources
              </li>
              <li>
                <strong>Alternative Investments:</strong> Private equity, hedge funds, etc.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation Strategies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-medium">Common Allocation Strategies</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Age-Based:</strong> The "100 minus your age" rule suggests the percentage of your portfolio that
                should be in stocks.
              </li>
              <li>
                <strong>Risk-Based:</strong> Allocations based on your risk tolerance:
                <ul className="list-disc pl-5 mt-1">
                  <li>Conservative: 20-40% stocks, 60-80% bonds/cash</li>
                  <li>Moderate: 40-70% stocks, 30-60% bonds/cash</li>
                  <li>Aggressive: 70-90% stocks, 10-30% bonds/cash</li>
                </ul>
              </li>
              <li>
                <strong>Goal-Based:</strong> Different allocations for different financial goals based on time horizon.
              </li>
              <li>
                <strong>Core-Satellite:</strong> A core of index funds supplemented with actively managed "satellite"
                investments.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">How often should I rebalance my portfolio?</h3>
            <p>
              Most financial advisors recommend rebalancing your portfolio at least annually. Some investors prefer
              semi-annual or quarterly rebalancing. Another approach is threshold-based rebalancing, where you rebalance
              when your allocation drifts more than 5% from your target.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Should my asset allocation change as I get older?</h3>
            <p>
              Generally, yes. As you approach retirement, it's typically advisable to gradually shift toward more
              conservative allocations to reduce volatility and protect your accumulated wealth. However, even in
              retirement, maintaining some growth-oriented investments is important to help combat inflation.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              What is the difference between strategic and tactical asset allocation?
            </h3>
            <p>
              Strategic asset allocation is a long-term approach where you set target allocations for various asset
              classes based on your goals and risk tolerance, then periodically rebalance back to those targets.
              Tactical asset allocation is a more active approach where you temporarily deviate from your long-term
              targets to capitalize on market opportunities or reduce exposure to perceived risks.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">How does international diversification benefit my portfolio?</h3>
            <p>
              International investments can help reduce portfolio volatility because different countries' markets often
              perform differently at various times. This imperfect correlation can smooth overall returns. Additionally,
              international exposure provides access to faster-growing economies and opportunities not available in your
              home market.
            </p>
          </div>
        </CardContent>
      </Card>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Portfolio Allocation Data",
            description:
              "Data on portfolio allocation strategies, efficient frontier, asset class returns, and diversification benefits",
            keywords: [
              "portfolio allocation",
              "asset allocation",
              "efficient frontier",
              "diversification",
              "investment risk",
              "investment return",
            ],
            creator: {
              "@type": "Organization",
              name: "Calculator Directory",
            },
            variableMeasured: [
              {
                "@type": "PropertyValue",
                name: "Risk",
                description: "Portfolio risk level measured as standard deviation",
                unitText: "PERCENT",
              },
              {
                "@type": "PropertyValue",
                name: "Return",
                description: "Expected or historical portfolio return",
                unitText: "PERCENT",
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
                name: "How often should I rebalance my portfolio?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most financial advisors recommend rebalancing your portfolio at least annually. Some investors prefer semi-annual or quarterly rebalancing. Another approach is threshold-based rebalancing, where you rebalance when your allocation drifts more than 5% from your target.",
                },
              },
              {
                "@type": "Question",
                name: "Should my asset allocation change as I get older?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Generally, yes. As you approach retirement, it's typically advisable to gradually shift toward more conservative allocations to reduce volatility and protect your accumulated wealth. However, even in retirement, maintaining some growth-oriented investments is important to help combat inflation.",
                },
              },
              {
                "@type": "Question",
                name: "What is the difference between strategic and tactical asset allocation?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Strategic asset allocation is a long-term approach where you set target allocations for various asset classes based on your goals and risk tolerance, then periodically rebalance back to those targets. Tactical asset allocation is a more active approach where you temporarily deviate from your long-term targets to capitalize on market opportunities or reduce exposure to perceived risks.",
                },
              },
              {
                "@type": "Question",
                name: "How does international diversification benefit my portfolio?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "International investments can help reduce portfolio volatility because different countries' markets often perform differently at various times. This imperfect correlation can smooth overall returns. Additionally, international exposure provides access to faster-growing economies and opportunities not available in your home market.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}

