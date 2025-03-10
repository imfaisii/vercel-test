"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, LineChart, ArrowUpDown } from "lucide-react"

// Common currencies
const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "BRL", name: "Brazilian Real" },
]

// Mock historical data (in a real app, this would come from an API)
const generateMockHistoricalData = (baseCurrency: string, targetCurrency: string, startDate: Date, endDate: Date) => {
  const baseRate = baseCurrency === "USD" ? 1 : Math.random() * 2
  const targetRate = targetCurrency === "USD" ? 1 : Math.random() * 2
  const exchangeRate = baseRate / targetRate

  const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const data = []

  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    // Add some random fluctuation to the rate
    const fluctuation = (Math.random() - 0.5) * 0.1
    const rate = exchangeRate * (1 + fluctuation)

    data.push({
      date: format(date, "yyyy-MM-dd"),
      rate: rate.toFixed(4),
    })
  }

  return data
}

export default function HistoricalRatesCalculator() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2025, 1, 1))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2025, 2, 1))
  const [historicalData, setHistoricalData] = useState<Array<{ date: string; rate: string }>>([])
  const [stats, setStats] = useState({ highest: 0, lowest: 0, average: 0 })

  // Fetch historical data
  const fetchHistoricalData = () => {
    if (!startDate || !endDate) return

    // In a real app, this would be an API call
    const data = generateMockHistoricalData(fromCurrency, toCurrency, startDate, endDate)
    setHistoricalData(data)

    // Calculate stats
    const rates = data.map((item) => Number.parseFloat(item.rate))
    setStats({
      highest: Math.max(...rates),
      lowest: Math.min(...rates),
      average: rates.reduce((sum, rate) => sum + rate, 0) / rates.length,
    })
  }

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Historical Exchange Rates</CardTitle>
        <CardDescription>View and compare historical currency exchange rates</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="historical" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="historical">Historical Rates</TabsTrigger>
            <TabsTrigger value="analysis">Rate Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="historical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-grow">
                    <Label htmlFor="from-currency">From Currency</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger id="from-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" size="icon" className="mt-6" onClick={handleSwap}>
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>

                  <div className="flex-grow">
                    <Label htmlFor="to-currency">To Currency</Label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger id="to-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="start-date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button id="end-date" variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => (startDate ? date < startDate : false) || date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button className="w-full" onClick={fetchHistoricalData} disabled={!startDate || !endDate}>
                  Get Historical Rates
                </Button>
              </div>

              <div className="space-y-4">
                {historicalData.length > 0 ? (
                  <>
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-medium mb-2">Exchange Rate Summary</h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-primary/10 p-2 rounded">
                          <div className="text-xs text-muted-foreground">Highest</div>
                          <div className="font-bold">{stats.highest.toFixed(4)}</div>
                        </div>
                        <div className="bg-primary/10 p-2 rounded">
                          <div className="text-xs text-muted-foreground">Lowest</div>
                          <div className="font-bold">{stats.lowest.toFixed(4)}</div>
                        </div>
                        <div className="bg-primary/10 p-2 rounded">
                          <div className="text-xs text-muted-foreground">Average</div>
                          <div className="font-bold">{stats.average.toFixed(4)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md max-h-60 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-muted sticky top-0">
                          <tr>
                            <th className="text-left p-2">Date</th>
                            <th className="text-right p-2">Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historicalData.map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2">{item.date}</td>
                              <td className="text-right p-2">
                                {item.rate} {toCurrency}/{fromCurrency}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 border border-dashed rounded-md">
                    <LineChart className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="font-medium">No Historical Data</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select currencies and date range, then click "Get Historical Rates"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="space-y-6">
              {historicalData.length > 0 ? (
                <>
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-4">
                      {fromCurrency} to {toCurrency} Exchange Rate Analysis
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Date Range</Label>
                          <div className="font-medium">
                            {startDate && format(startDate, "MMM d, yyyy")} -{" "}
                            {endDate && format(endDate, "MMM d, yyyy")}
                          </div>
                        </div>
                        <div>
                          <Label>Total Days</Label>
                          <div className="font-medium">{historicalData.length}</div>
                        </div>
                      </div>

                      <div>
                        <Label>Rate Volatility</Label>
                        <div className="font-medium">
                          {(((stats.highest - stats.lowest) / stats.lowest) * 100).toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Percentage difference between highest and lowest rates
                        </div>
                      </div>

                      <div className="h-40 bg-muted/50 rounded-md flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <LineChart className="h-8 w-8 mx-auto mb-2" />
                          <div>Chart visualization would appear here</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Currency Performance</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {historicalData.length > 0 &&
                        (Number.parseFloat(historicalData[0].rate) <
                        Number.parseFloat(historicalData[historicalData.length - 1].rate)
                          ? `${fromCurrency} has weakened against ${toCurrency} during this period.`
                          : `${fromCurrency} has strengthened against ${toCurrency} during this period.`)}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Starting Rate</Label>
                        <div className="font-medium">{historicalData.length > 0 && historicalData[0].rate}</div>
                      </div>
                      <div>
                        <Label>Ending Rate</Label>
                        <div className="font-medium">
                          {historicalData.length > 0 && historicalData[historicalData.length - 1].rate}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-md">
                  <LineChart className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No Data to Analyze</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    First retrieve historical data from the "Historical Rates" tab to view analysis
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

