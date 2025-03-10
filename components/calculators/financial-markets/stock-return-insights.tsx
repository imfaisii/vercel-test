"use client"
import { Card, CardContent } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { formatCurrency } from "@/lib/utils"

// Sample data for visualizations
const compoundGrowthData = [
  { year: 0, value: 10000, label: "Initial $10,000" },
  { year: 5, value: 14693, label: "After 5 Years" },
  { year: 10, value: 21589, label: "After 10 Years" },
  { year: 15, value: 31722, label: "After 15 Years" },
  { year: 20, value: 46610, label: "After 20 Years" },
  { year: 25, value: 68485, label: "After 25 Years" },
  { year: 30, value: 100627, label: "After 30 Years" },
]

const marketCycleData = [
  { period: "1950s", return: 19.4, label: "1950s: 19.4%" },
  { period: "1960s", return: 7.8, label: "1960s: 7.8%" },
  { period: "1970s", return: 5.9, label: "1970s: 5.9%" },
  { period: "1980s", return: 17.6, label: "1980s: 17.6%" },
  { period: "1990s", return: 18.2, label: "1990s: 18.2%" },
  { period: "2000s", return: -0.9, label: "2000s: -0.9%" },
  { period: "2010s", return: 13.6, label: "2010s: 13.6%" },
  { period: "2020s*", return: 12.1, label: "2020s*: 12.1% (partial)" },
]

const sectorPerformanceData = [
  { name: "Technology", cagr: 15.2, risk: 18.7, size: 28 },
  { name: "Healthcare", cagr: 11.8, risk: 14.2, size: 14 },
  { name: "Financials", cagr: 9.7, risk: 17.5, size: 13 },
  { name: "Consumer Disc.", cagr: 12.3, risk: 16.8, size: 10 },
  { name: "Communication", cagr: 10.5, risk: 15.3, size: 9 },
  { name: "Industrials", cagr: 10.1, risk: 15.9, size: 8 },
  { name: "Consumer Staples", cagr: 8.9, risk: 11.2, size: 7 },
  { name: "Energy", cagr: 7.8, risk: 19.2, size: 5 },
  { name: "Utilities", cagr: 7.2, risk: 12.1, size: 3 },
  { name: "Materials", cagr: 8.5, risk: 16.4, size: 2 },
  { name: "Real Estate", cagr: 9.2, risk: 15.7, size: 3 },
]

const contributionImpactData = [
  { year: 0, withContributions: 10000, withoutContributions: 10000 },
  { year: 5, withContributions: 25000, withoutContributions: 14693 },
  { year: 10, withContributions: 46000, withoutContributions: 21589 },
  { year: 15, withContributions: 75000, withoutContributions: 31722 },
  { year: 20, withContributions: 115000, withoutContributions: 46610 },
  { year: 25, withContributions: 170000, withoutContributions: 68485 },
  { year: 30, withContributions: 245000, withoutContributions: 100627 },
]

const assetClassData = [
  { name: "US Large Cap", return: 10.2, risk: 15.7, color: "#8884d8" },
  { name: "US Small Cap", return: 11.8, risk: 19.2, color: "#83a6ed" },
  { name: "International", return: 8.7, risk: 17.5, color: "#8dd1e1" },
  { name: "Emerging Markets", return: 10.5, risk: 22.3, color: "#82ca9d" },
  { name: "US Bonds", return: 5.3, risk: 5.8, color: "#a4de6c" },
  { name: "TIPS", return: 4.8, risk: 5.2, color: "#d0ed57" },
  { name: "REITs", return: 9.6, risk: 17.1, color: "#ffc658" },
  { name: "Commodities", return: 5.7, risk: 18.4, color: "#ff8042" },
]

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label, formatter = (value: number) => value.toString() }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {formatter(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function StockReturnInsights() {
  return (
    <div className="space-y-8 mt-8">
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold tracking-tight">Stock Return Insights</h2>
        <p>
          Understanding stock market returns is essential for making informed investment decisions. The following
          visualizations provide insights into historical stock market performance, the power of compound growth, and
          the impact of different investment strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compound Growth Visualization */}
        <Card className="bg-black text-white overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">The Power of Compound Growth</h3>
            <p className="text-gray-300 mb-4">
              This chart illustrates how $10,000 grows over time at an 8% annual return rate, demonstrating the
              exponential nature of compound growth.
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={compoundGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="year"
                    label={{ value: "Years", position: "insideBottom", offset: -10, fill: "#fff" }}
                    tick={{ fill: "#fff" }}
                  />
                  <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} tick={{ fill: "#fff" }} width={80} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 border border-gray-700 p-3 rounded">
                            <p className="font-medium text-white">Year {label}</p>
                            <p className="text-purple-300">Value: {formatCurrency(payload[0].value)}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    name="Portfolio Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-300">
              <p>
                Notice how the growth accelerates in later years as returns compound on a larger base. This demonstrates
                why starting early and staying invested is crucial for long-term wealth building.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Market Cycles Visualization */}
        <Card className="bg-black text-white overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Stock Market Returns by Decade</h3>
            <p className="text-gray-300 mb-4">
              Historical average annual returns of the S&P 500 by decade, showing the cyclical nature of market
              performance.
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketCycleData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="period" tick={{ fill: "#fff" }} />
                  <YAxis tickFormatter={(value) => `${value}%`} tick={{ fill: "#fff" }} width={50} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 border border-gray-700 p-3 rounded">
                            <p className="font-medium text-white">{label}</p>
                            <p className="text-blue-300">Average Annual Return: {payload[0].value.toFixed(1)}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="return" name="Average Annual Return">
                    {marketCycleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.return < 0 ? "#ef4444" : "#3b82f6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-300">
              <p>
                Market returns vary significantly across different time periods. The 2000s saw negative returns due to
                the dot-com crash and financial crisis, while the 1950s, 1980s, and 1990s delivered exceptional
                performance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sector Performance Visualization */}
        <Card className="bg-black text-white overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Sector Performance: Risk vs. Return</h3>
            <p className="text-gray-300 mb-4">
              This scatter plot shows the relationship between risk (volatility) and return across different market
              sectors. Bubble size represents the sector's weight in the S&P 500.
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    type="number"
                    dataKey="risk"
                    name="Risk (Volatility)"
                    domain={[10, 25]}
                    label={{ value: "Risk (Volatility %)", position: "insideBottom", offset: -10, fill: "#fff" }}
                    tick={{ fill: "#fff" }}
                  />
                  <YAxis
                    type="number"
                    dataKey="cagr"
                    name="Return (CAGR)"
                    domain={[5, 20]}
                    label={{ value: "Return (CAGR %)", angle: -90, position: "insideLeft", offset: 10, fill: "#fff" }}
                    tick={{ fill: "#fff" }}
                    width={50}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 border border-gray-700 p-3 rounded">
                            <p className="font-medium text-white">{payload[0].payload.name}</p>
                            <p className="text-purple-300">Return: {payload[0].payload.cagr.toFixed(1)}%</p>
                            <p className="text-blue-300">Risk: {payload[0].payload.risk.toFixed(1)}%</p>
                            <p className="text-gray-300">Market Weight: {payload[0].payload.size}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Scatter name="Sectors" data={sectorPerformanceData} fill="#8884d8">
                    {sectorPerformanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.cagr > 12 ? "#8884d8" : entry.cagr > 9 ? "#83a6ed" : "#8dd1e1"}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-300">
              <p>
                Technology and Consumer Discretionary sectors have delivered higher returns but with increased
                volatility. Defensive sectors like Utilities and Consumer Staples offer lower returns with reduced risk.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contribution Impact Visualization */}
        <Card className="bg-black text-white overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Impact of Regular Contributions</h3>
            <p className="text-gray-300 mb-4">
              This chart compares the growth of a $10,000 investment with and without additional monthly contributions
              of $200.
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={contributionImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorWithContributions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="colorWithoutContributions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="year"
                    label={{ value: "Years", position: "insideBottom", offset: -10, fill: "#fff" }}
                    tick={{ fill: "#fff" }}
                  />
                  <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} tick={{ fill: "#fff" }} width={80} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 border border-gray-700 p-3 rounded">
                            <p className="font-medium text-white">Year {label}</p>
                            <p className="text-purple-300">With Contributions: {formatCurrency(payload[0].value)}</p>
                            <p className="text-green-300">Without Contributions: {formatCurrency(payload[1].value)}</p>
                            <p className="text-blue-300">
                              Difference: {formatCurrency(payload[0].value - payload[1].value)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="withContributions"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorWithContributions)"
                    name="With Monthly Contributions"
                  />
                  <Area
                    type="monotone"
                    dataKey="withoutContributions"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorWithoutContributions)"
                    name="Initial Investment Only"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-300">
              <p>
                Regular contributions significantly accelerate wealth building. After 30 years, the portfolio with
                monthly contributions is worth $245,000 compared to $100,627 with just the initial investment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden data tables for SEO */}
      <div className="sr-only">
        <h3>Compound Growth Data</h3>
        <table>
          <caption>Growth of $10,000 at 8% Annual Return</caption>
          <thead>
            <tr>
              <th>Year</th>
              <th>Portfolio Value</th>
            </tr>
          </thead>
          <tbody>
            {compoundGrowthData.map((item) => (
              <tr key={item.year}>
                <td>{item.year}</td>
                <td>${item.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Market Cycles Data</h3>
        <table>
          <caption>S&P 500 Average Annual Returns by Decade</caption>
          <thead>
            <tr>
              <th>Decade</th>
              <th>Average Annual Return</th>
            </tr>
          </thead>
          <tbody>
            {marketCycleData.map((item) => (
              <tr key={item.period}>
                <td>{item.period}</td>
                <td>{item.return.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Sector Performance Data</h3>
        <table>
          <caption>Market Sector Risk vs. Return</caption>
          <thead>
            <tr>
              <th>Sector</th>
              <th>Return (CAGR)</th>
              <th>Risk (Volatility)</th>
              <th>Market Weight</th>
            </tr>
          </thead>
          <tbody>
            {sectorPerformanceData.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.cagr.toFixed(1)}%</td>
                <td>{item.risk.toFixed(1)}%</td>
                <td>{item.size}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Contribution Impact Data</h3>
        <table>
          <caption>Impact of Regular Contributions on Portfolio Growth</caption>
          <thead>
            <tr>
              <th>Year</th>
              <th>With Monthly Contributions</th>
              <th>Initial Investment Only</th>
            </tr>
          </thead>
          <tbody>
            {contributionImpactData.map((item) => (
              <tr key={item.year}>
                <td>{item.year}</td>
                <td>${item.withContributions.toLocaleString()}</td>
                <td>${item.withoutContributions.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Educational content for SEO */}
      <div className="prose dark:prose-invert max-w-none">
        <h2>Understanding Stock Market Returns</h2>
        <p>
          Stock market returns are influenced by numerous factors including economic growth, corporate earnings,
          interest rates, inflation, and investor sentiment. While short-term market movements can be unpredictable,
          long-term returns have historically trended upward.
        </p>

        <h3>Key Factors Affecting Stock Returns</h3>
        <ul>
          <li>
            <strong>Economic Growth:</strong> Strong economic growth typically leads to higher corporate earnings and
            stock returns.
          </li>
          <li>
            <strong>Interest Rates:</strong> Lower interest rates generally support higher stock valuations by reducing
            borrowing costs and making stocks more attractive compared to bonds.
          </li>
          <li>
            <strong>Inflation:</strong> Moderate inflation can be positive for stocks, but high inflation often leads to
            higher interest rates and lower valuations.
          </li>
          <li>
            <strong>Corporate Earnings:</strong> Over the long term, stock prices tend to follow corporate earnings
            growth.
          </li>
          <li>
            <strong>Valuation:</strong> Starting valuation (P/E ratio) significantly impacts future returns. Higher
            starting valuations typically lead to lower future returns.
          </li>
        </ul>

        <h3>Historical Stock Market Performance</h3>
        <p>
          The U.S. stock market has delivered an average annual return of approximately 10% before inflation since 1926.
          However, this average masks significant variation across different time periods:
        </p>
        <ul>
          <li>The best 20-year period delivered annualized returns of 17.9% (1980-1999)</li>
          <li>The worst 20-year period delivered annualized returns of 0.5% (1929-1948)</li>
          <li>In any given year, returns have ranged from -43.3% (1931) to +54.0% (1933)</li>
        </ul>

        <h3>The Power of Compound Growth</h3>
        <p>
          Compound growth is the process where investment returns generate additional returns over time. This creates an
          exponential growth curve rather than a linear one. The longer your investment horizon, the more powerful this
          effect becomes.
        </p>
        <p>For example, $10,000 invested at an 8% annual return would grow to approximately:</p>
        <ul>
          <li>$14,693 after 5 years</li>
          <li>$21,589 after 10 years</li>
          <li>$46,610 after 20 years</li>
          <li>$100,627 after 30 years</li>
        </ul>
        <p>
          This demonstrates why starting early and staying invested for the long term is one of the most powerful
          investment strategies.
        </p>

        <h3>The Impact of Regular Contributions</h3>
        <p>
          Adding regular contributions to your investment portfolio significantly accelerates wealth building. For
          example, if you start with $10,000 and add $200 monthly to your investment portfolio (assuming an 8% annual
          return):
        </p>
        <ul>
          <li>After 10 years: $46,000 (compared to $21,589 without additional contributions)</li>
          <li>After 20 years: $115,000 (compared to $46,610 without additional contributions)</li>
          <li>After 30 years: $245,000 (compared to $100,627 without additional contributions)</li>
        </ul>

        <h3>Sector Performance and Diversification</h3>
        <p>
          Different market sectors perform differently based on economic conditions, technological changes, and other
          factors. Technology has been the strongest performing sector in recent decades, while utilities and energy
          have lagged. However, sector leadership rotates over time, highlighting the importance of diversification.
        </p>

        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3>What is a good annual return on stocks?</h3>
            <p>
              Historically, the S&P 500 has returned about 10% annually before inflation (7-8% after inflation). For
              long-term planning, many financial advisors suggest using more conservative estimates of 6-7% to account
              for periods of lower returns.
            </p>
          </div>
          <div>
            <h3>How do stock returns compare to other investments?</h3>
            <p>Stocks have historically outperformed most other asset classes over long periods. For comparison:</p>
            <ul>
              <li>U.S. Stocks: ~10% average annual return (1926-2023)</li>
              <li>U.S. Bonds: ~5% average annual return (1926-2023)</li>
              <li>Cash/Treasury Bills: ~3% average annual return (1926-2023)</li>
              <li>Gold: ~4% average annual return (1971-2023)</li>
              <li>Real Estate: ~7% average annual return (1970-2023)</li>
            </ul>
          </div>
          <div>
            <h3>How does inflation affect stock returns?</h3>
            <p>
              Inflation erodes the purchasing power of investment returns. When evaluating historical returns, it's
              important to consider "real returns" (returns after inflation). For example, a 10% nominal return during a
              period of 3% inflation represents a 7% real return.
            </p>
          </div>
          <div>
            <h3>What is the Rule of 72?</h3>
            <p>
              The Rule of 72 is a simple way to estimate how long it will take for an investment to double. Divide 72 by
              the annual return rate to get the approximate number of years. For example, at an 8% annual return, an
              investment would double in approximately 9 years (72 ÷ 8 = 9).
            </p>
          </div>
          <div>
            <h3>How do taxes impact investment returns?</h3>
            <p>
              Taxes can significantly reduce investment returns. Long-term capital gains are typically taxed at lower
              rates than short-term gains or ordinary income. Tax-advantaged accounts like 401(k)s and IRAs can help
              minimize the tax impact on investment returns.
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
            name: "Historical Stock Market Returns Data",
            description: "Historical data on stock market returns, sector performance, and investment growth scenarios",
            keywords: [
              "stock market returns",
              "investment growth",
              "compound interest",
              "sector performance",
              "market cycles",
            ],
            creator: {
              "@type": "Organization",
              name: "Calculator Directory",
            },
            temporalCoverage: "1950/2023",
            variableMeasured: [
              {
                "@type": "PropertyValue",
                name: "Annual Return",
                description: "Average annual return of the S&P 500 by decade",
              },
              {
                "@type": "PropertyValue",
                name: "Compound Growth",
                description: "Growth of investments over time with compound interest",
              },
              {
                "@type": "PropertyValue",
                name: "Sector Performance",
                description: "Risk and return characteristics of different market sectors",
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
                name: "What is a good annual return on stocks?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Historically, the S&P 500 has returned about 10% annually before inflation (7-8% after inflation). For long-term planning, many financial advisors suggest using more conservative estimates of 6-7% to account for periods of lower returns.",
                },
              },
              {
                "@type": "Question",
                name: "How do stock returns compare to other investments?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Stocks have historically outperformed most other asset classes over long periods. For comparison: U.S. Stocks: ~10% average annual return (1926-2023), U.S. Bonds: ~5% average annual return (1926-2023), Cash/Treasury Bills: ~3% average annual return (1926-2023), Gold: ~4% average annual return (1971-2023), Real Estate: ~7% average annual return (1970-2023).",
                },
              },
              {
                "@type": "Question",
                name: "How does inflation affect stock returns?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Inflation erodes the purchasing power of investment returns. When evaluating historical returns, it's important to consider 'real returns' (returns after inflation). For example, a 10% nominal return during a period of 3% inflation represents a 7% real return.",
                },
              },
              {
                "@type": "Question",
                name: "What is the Rule of 72?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The Rule of 72 is a simple way to estimate how long it will take for an investment to double. Divide 72 by the annual return rate to get the approximate number of years. For example, at an 8% annual return, an investment would double in approximately 9 years (72 ÷ 8 = 9).",
                },
              },
              {
                "@type": "Question",
                name: "How do taxes impact investment returns?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Taxes can significantly reduce investment returns. Long-term capital gains are typically taxed at lower rates than short-term gains or ordinary income. Tax-advantaged accounts like 401(k)s and IRAs can help minimize the tax impact on investment returns.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}

