"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { formatPercent } from "@/lib/utils"

// Sample data for dividend insights
const dividendIncomeData = [
  { year: 1, withReinvestment: 5000, withoutReinvestment: 5000, dividendIncome: 200 },
  { year: 5, withReinvestment: 7500, withoutReinvestment: 6000, dividendIncome: 240 },
  { year: 10, withReinvestment: 11200, withoutReinvestment: 7000, dividendIncome: 280 },
  { year: 15, withReinvestment: 16800, withoutReinvestment: 8000, dividendIncome: 320 },
  { year: 20, withReinvestment: 25000, withoutReinvestment: 9000, dividendIncome: 360 },
  { year: 25, withReinvestment: 37500, withoutReinvestment: 10000, dividendIncome: 400 },
  { year: 30, withReinvestment: 56000, withoutReinvestment: 11000, dividendIncome: 440 },
]

const dividendAristocratsData = [
  { name: "JNJ", yield: 2.8, growthRate: 6.2, sector: "Healthcare", streak: 59 },
  { name: "PG", yield: 2.4, growthRate: 5.8, sector: "Consumer Staples", streak: 65 },
  { name: "KO", yield: 3.1, growthRate: 4.2, sector: "Consumer Staples", streak: 59 },
  { name: "PEP", yield: 2.7, growthRate: 7.1, sector: "Consumer Staples", streak: 49 },
  { name: "MMM", yield: 3.9, growthRate: 2.8, sector: "Industrials", streak: 63 },
  { name: "XOM", yield: 3.7, growthRate: 2.2, sector: "Energy", streak: 38 },
  { name: "WMT", yield: 1.5, growthRate: 8.5, sector: "Consumer Staples", streak: 48 },
  { name: "MCD", yield: 2.2, growthRate: 7.8, sector: "Consumer Discretionary", streak: 45 },
]

const yieldVsGrowthData = [
  { name: "High Yield Utilities", yield: 4.8, growth: 2.0, risk: 3.5, size: 100 },
  { name: "REITs", yield: 4.2, growth: 3.5, risk: 4.0, size: 100 },
  { name: "Consumer Staples", yield: 2.8, growth: 5.0, risk: 2.5, size: 100 },
  { name: "Healthcare", yield: 2.3, growth: 6.5, risk: 3.0, size: 100 },
  { name: "Financials", yield: 3.2, growth: 4.5, risk: 4.0, size: 100 },
  { name: "Technology", yield: 1.2, growth: 9.5, risk: 4.5, size: 100 },
  { name: "Energy", yield: 3.9, growth: 2.5, risk: 5.0, size: 100 },
  { name: "Industrials", yield: 2.1, growth: 7.0, risk: 3.8, size: 100 },
]

const marketCycleData = [
  { year: "2000", bull: 2.8, bear: 0 },
  { year: "2001", bull: 0, bear: -3.2 },
  { year: "2002", bull: 0, bear: -2.5 },
  { year: "2003", bull: 3.1, bear: 0 },
  { year: "2004", bull: 2.9, bear: 0 },
  { year: "2005", bull: 2.7, bear: 0 },
  { year: "2006", bull: 2.5, bear: 0 },
  { year: "2007", bull: 2.4, bear: 0 },
  { year: "2008", bull: 0, bear: -3.8 },
  { year: "2009", bull: 0, bear: -1.5 },
  { year: "2010", bull: 2.2, bear: 0 },
  { year: "2011", bull: 2.3, bear: 0 },
  { year: "2012", bull: 2.5, bear: 0 },
  { year: "2013", bull: 2.1, bear: 0 },
  { year: "2014", bull: 2.2, bear: 0 },
  { year: "2015", bull: 2.3, bear: 0 },
  { year: "2016", bull: 2.4, bear: 0 },
  { year: "2017", bull: 2.0, bear: 0 },
  { year: "2018", bull: 0, bear: -2.1 },
  { year: "2019", bull: 2.2, bear: 0 },
  { year: "2020", bull: 0, bear: -2.8 },
  { year: "2021", bull: 1.8, bear: 0 },
  { year: "2022", bull: 0, bear: -2.2 },
  { year: "2023", bull: 2.1, bear: 0 },
]

const stabilityData = [
  { name: "Dividend Aristocrats", value: 92 },
  { name: "High Yield Stocks", value: 78 },
  { name: "Growth Stocks", value: 45 },
  { name: "Market Average", value: 65 },
]

// Format currency for display
const formatDollar = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 border border-gray-700 p-4 rounded-lg shadow-lg">
        <p className="font-medium text-white">{`Year: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value >= 1000 ? formatDollar(entry.value) : formatPercent(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const AristocratTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-black/80 border border-gray-700 p-4 rounded-lg shadow-lg">
        <p className="font-medium text-white">{data.name}</p>
        <p className="text-sm text-purple-300">Yield: {formatPercent(data.yield)}</p>
        <p className="text-sm text-blue-300">Growth Rate: {formatPercent(data.growthRate)}</p>
        <p className="text-sm text-gray-300">Sector: {data.sector}</p>
        <p className="text-sm text-green-300">Dividend Streak: {data.streak} years</p>
      </div>
    )
  }
  return null
}

const ScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-black/80 border border-gray-700 p-4 rounded-lg shadow-lg">
        <p className="font-medium text-white">{data.name}</p>
        <p className="text-sm text-purple-300">Dividend Yield: {formatPercent(data.yield)}</p>
        <p className="text-sm text-blue-300">Growth Rate: {formatPercent(data.growth)}</p>
        <p className="text-sm text-orange-300">Risk Level: {data.risk}/5</p>
      </div>
    )
  }
  return null
}

export function DividendYieldInsights() {
  return (
    <div className="w-full bg-black text-white p-6 rounded-xl">
      <div className="mb-8">
        <h2 id="dividend-insights-heading" className="text-2xl font-bold mb-4 text-white">
          Dividend Investing Insights
        </h2>
        <p className="text-gray-300 mb-6">
          Explore data-driven insights about dividend investing strategies, income growth potential, and historical
          performance of dividend-paying stocks. These visualizations help illustrate the power of dividend investing
          for long-term wealth building.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Dividend Income Projection Chart */}
        <section aria-labelledby="dividend-income-heading" className="col-span-1 lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle id="dividend-income-heading" className="text-xl text-white">
                Dividend Reinvestment Growth Projection
              </CardTitle>
              <CardDescription className="text-gray-400">
                Impact of dividend reinvestment on a $5,000 initial investment with 4% yield over 30 years
              </CardDescription>
            </CardHeader>
            <CardContent>
              <figure>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dividendIncomeData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
                      <defs>
                        <linearGradient id="colorReinvest" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorNoReinvest" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ac1ff" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4ac1ff" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="year"
                        label={{
                          value: "Years",
                          position: "insideBottom",
                          offset: -10,
                          fill: "#aaa",
                        }}
                        tick={{ fill: "#aaa" }}
                      />
                      <YAxis
                        tickFormatter={formatDollar}
                        label={{
                          value: "Portfolio Value",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#aaa",
                        }}
                        tick={{ fill: "#aaa" }}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Area
                        type="monotone"
                        dataKey="withReinvestment"
                        name="With Reinvestment"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorReinvest)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="withoutReinvestment"
                        name="Without Reinvestment"
                        stroke="#4ac1ff"
                        fillOpacity={1}
                        fill="url(#colorNoReinvest)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <figcaption className="mt-4 text-sm text-gray-400">
                  This chart illustrates the compounding effect of dividend reinvestment over time. With reinvestment,
                  the portfolio grows exponentially compared to taking dividends as cash.
                </figcaption>
              </figure>

              {/* Hidden data table for SEO */}
              <div className="sr-only">
                <table>
                  <caption>Dividend Reinvestment Growth Projection Data</caption>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>With Reinvestment ($)</th>
                      <th>Without Reinvestment ($)</th>
                      <th>Annual Dividend Income ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dividendIncomeData.map((item) => (
                      <tr key={item.year}>
                        <td>{item.year}</td>
                        <td>{item.withReinvestment}</td>
                        <td>{item.withoutReinvestment}</td>
                        <td>{item.dividendIncome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-medium text-white mb-2">Key Insight</h4>
                <p className="text-gray-300">
                  Reinvesting dividends can potentially increase your portfolio value by over 400% compared to taking
                  dividends as income. This demonstrates the power of compounding, often called the "eighth wonder of
                  the world."
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Dividend Aristocrats Performance */}
        <section aria-labelledby="aristocrats-heading">
          <Card className="bg-gray-900 border-gray-800 h-full">
            <CardHeader>
              <CardTitle id="aristocrats-heading" className="text-xl text-white">
                Dividend Aristocrats Performance
              </CardTitle>
              <CardDescription className="text-gray-400">
                Companies with 25+ years of consecutive dividend increases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <figure>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dividendAristocratsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      barSize={20}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="name"
                        scale="band"
                        tick={{ fill: "#aaa" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        label={{
                          value: "Dividend Yield (%)",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#aaa",
                        }}
                        tick={{ fill: "#aaa" }}
                        tickFormatter={(value) => `${value}%`}
                        width={80}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                          value: "Growth Rate (%)",
                          angle: 90,
                          position: "insideRight",
                          fill: "#aaa",
                        }}
                        tick={{ fill: "#aaa" }}
                        tickFormatter={(value) => `${value}%`}
                        width={80}
                      />
                      <Tooltip content={<AristocratTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Bar yAxisId="left" dataKey="yield" name="Dividend Yield" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      <Bar
                        yAxisId="right"
                        dataKey="growthRate"
                        name="Growth Rate"
                        fill="#4ac1ff"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <figcaption className="mt-4 text-sm text-gray-400">
                  Dividend Aristocrats offer a balance of current income (yield) and future income growth potential
                  (growth rate).
                </figcaption>
              </figure>

              {/* Hidden data table for SEO */}
              <div className="sr-only">
                <table>
                  <caption>Dividend Aristocrats Performance Data</caption>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Dividend Yield (%)</th>
                      <th>Growth Rate (%)</th>
                      <th>Sector</th>
                      <th>Dividend Streak (Years)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dividendAristocratsData.map((item) => (
                      <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.yield}</td>
                        <td>{item.growthRate}</td>
                        <td>{item.sector}</td>
                        <td>{item.streak}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Yield vs Growth Matrix */}
        <section aria-labelledby="yield-growth-heading">
          <Card className="bg-gray-900 border-gray-800 h-full">
            <CardHeader>
              <CardTitle id="yield-growth-heading" className="text-xl text-white">
                Yield vs. Growth Matrix
              </CardTitle>
              <CardDescription className="text-gray-400">
                Positioning of different sectors by yield and dividend growth potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <figure>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        type="number"
                        dataKey="yield"
                        name="Dividend Yield"
                        label={{
                          value: "Dividend Yield (%)",
                          position: "insideBottom",
                          offset: -10,
                          fill: "#aaa",
                        }}
                        tick={{ fill: "#aaa" }}
                        domain={[0, 6]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <YAxis
                        type="number"
                        dataKey="growth"
                        name="Growth Rate"
                        label={{
                          value: "Growth Rate (%)",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#aaa",
                        }}
                        tick={{ fill: "#aaa" }}
                        domain={[0, 12]}
                        tickFormatter={(value) => `${value}%`}
                        width={80}
                      />
                      <ZAxis type="number" dataKey="size" range={[60, 400]} />
                      <Tooltip content={<ScatterTooltip />} />
                      <Scatter name="Sectors" data={yieldVsGrowthData}>
                        {yieldVsGrowthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 ? "#4ac1ff" : "#8884d8"} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <figcaption className="mt-4 text-sm text-gray-400">
                  This matrix helps visualize the trade-off between current income (yield) and future income growth
                  potential across different sectors.
                </figcaption>
              </figure>

              {/* Hidden data table for SEO */}
              <div className="sr-only">
                <table>
                  <caption>Yield vs Growth Matrix Data by Sector</caption>
                  <thead>
                    <tr>
                      <th>Sector</th>
                      <th>Dividend Yield (%)</th>
                      <th>Growth Rate (%)</th>
                      <th>Risk Level (1-5)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yieldVsGrowthData.map((item) => (
                      <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.yield}</td>
                        <td>{item.growth}</td>
                        <td>{item.risk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-medium text-white mb-2">Investment Strategy Insight</h4>
                <p className="text-gray-300">
                  Higher-yielding sectors (top-left) provide more immediate income but less growth, while lower-yielding
                  sectors (bottom-right) offer greater long-term income growth potential. A balanced dividend portfolio
                  typically includes both types.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Dividend Performance in Market Cycles */}
        <section aria-labelledby="market-cycles-heading" className="col-span-1 lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle id="market-cycles-heading" className="text-xl text-white">
                Dividend Performance Through Market Cycles
              </CardTitle>
              <CardDescription className="text-gray-400">
                How dividend income has performed during bull and bear markets (2000-2023)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <figure>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketCycleData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }} barGap={0}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="year" tick={{ fill: "#aaa" }} interval={2} />
                      <YAxis
                        tickFormatter={(value) => `${value}%`}
                        label={{
                          value: "Dividend Yield (%)",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#aaa",
                        }}
                        tick={{ fill: "#aaa" }}
                        domain={[-5, 5]}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Bar dataKey="bull" name="Bull Market Yield" fill="#4ac1ff" stackId="a" />
                      <Bar dataKey="bear" name="Bear Market Yield" fill="#ff4a8b" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <figcaption className="mt-4 text-sm text-gray-400">
                  While stock prices fluctuate dramatically during market cycles, dividend income tends to be more
                  stable and often continues to grow even during market downturns.
                </figcaption>
              </figure>

              {/* Hidden data table for SEO */}
              <div className="sr-only">
                <table>
                  <caption>Dividend Performance Through Market Cycles (2000-2023)</caption>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Bull Market Yield (%)</th>
                      <th>Bear Market Yield (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketCycleData.map((item) => (
                      <tr key={item.year}>
                        <td>{item.year}</td>
                        <td>{item.bull}</td>
                        <td>{item.bear}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-medium text-white mb-2">Historical Perspective</h4>
                <p className="text-gray-300">
                  During the 2008 financial crisis and 2020 pandemic, many companies maintained or even increased their
                  dividends despite stock price declines. This demonstrates how dividend income can provide stability
                  during market volatility.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <article className="mb-8 p-6 bg-gray-900 rounded-xl">
        <h3 className="text-xl font-bold mb-4 text-white">The Power of Dividend Investing</h3>
        <div className="prose prose-invert max-w-none">
          <p>
            Dividend investing is a strategy focused on building a portfolio of stocks that pay regular cash
            distributions to shareholders. This approach offers several key advantages:
          </p>

          <ul className="mt-4 space-y-2">
            <li>
              <strong>Passive Income:</strong> Dividends provide regular cash flow without selling assets
            </li>
            <li>
              <strong>Compounding Growth:</strong> Reinvested dividends can significantly accelerate portfolio growth
            </li>
            <li>
              <strong>Inflation Protection:</strong> Companies with growing dividends help maintain purchasing power
            </li>
            <li>
              <strong>Lower Volatility:</strong> Dividend stocks typically experience less price volatility
            </li>
            <li>
              <strong>Downside Protection:</strong> Dividend income continues even during market downturns
            </li>
          </ul>

          <h4 className="text-lg font-medium mt-6 mb-3">Dividend Aristocrats and Kings</h4>
          <p>
            "Dividend Aristocrats" are S&P 500 companies that have increased their dividend payouts for at least 25
            consecutive years. "Dividend Kings" have increased dividends for 50+ years. These companies demonstrate
            exceptional financial stability and long-term commitment to shareholder returns.
          </p>

          <h4 className="text-lg font-medium mt-6 mb-3">Dividend Yield vs. Growth Rate</h4>
          <p>
            When building a dividend portfolio, investors must balance current income (yield) with future income growth
            potential. High-yield stocks provide more immediate income but often grow slowly, while lower-yield stocks
            may increase their dividends at faster rates over time. A balanced approach typically includes both types.
          </p>

          <h4 className="text-lg font-medium mt-6 mb-3">Tax Considerations</h4>
          <p>
            Qualified dividends receive preferential tax treatment in many jurisdictions. In the United States,
            qualified dividends are taxed at the lower long-term capital gains rate rather than as ordinary income. This
            tax advantage enhances the after-tax return of dividend investing strategies.
          </p>
        </div>
      </article>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Dividend Investing Performance Data",
            description:
              "Comprehensive data on dividend growth, yield comparisons, and historical performance of dividend-paying stocks.",
            keywords: [
              "dividend investing",
              "dividend yield",
              "dividend growth",
              "dividend aristocrats",
              "income investing",
              "dividend reinvestment",
              "DRIP",
              "dividend stocks",
            ],
            creator: {
              "@type": "Organization",
              name: "FreeCalculators.AI",
              url: "https://freecalculators.ai",
            },
            temporalCoverage: "2000/2023",
            variableMeasured: ["Dividend Yield", "Dividend Growth Rate", "Total Return", "Income Stability"],
          }),
        }}
      />
    </div>
  )
}

