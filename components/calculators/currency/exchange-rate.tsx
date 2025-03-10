"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRightLeft, RefreshCw } from "lucide-react"

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

// Mock exchange rates (in a real app, these would come from an API)
const mockExchangeRates: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.82,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.88,
    CNY: 7.19,
    INR: 83.12,
    BRL: 5.05,
  },
  EUR: {
    USD: 1.09,
    GBP: 0.86,
    JPY: 163.28,
    CAD: 1.48,
    AUD: 1.65,
    CHF: 0.96,
    CNY: 7.83,
    INR: 90.54,
    BRL: 5.5,
  },
  GBP: {
    USD: 1.27,
    EUR: 1.16,
    JPY: 189.86,
    CAD: 1.72,
    AUD: 1.92,
    CHF: 1.11,
    CNY: 9.1,
    INR: 105.28,
    BRL: 6.39,
  },
  JPY: {
    USD: 0.0067,
    EUR: 0.0061,
    GBP: 0.0053,
    CAD: 0.0091,
    AUD: 0.0101,
    CHF: 0.0059,
    CNY: 0.048,
    INR: 0.55,
    BRL: 0.034,
  },
  CAD: {
    USD: 0.74,
    EUR: 0.68,
    GBP: 0.58,
    JPY: 110.16,
    AUD: 1.12,
    CHF: 0.65,
    CNY: 5.29,
    INR: 61.12,
    BRL: 3.71,
  },
  AUD: {
    USD: 0.66,
    EUR: 0.61,
    GBP: 0.52,
    JPY: 98.57,
    CAD: 0.89,
    CHF: 0.58,
    CNY: 4.73,
    INR: 54.69,
    BRL: 3.32,
  },
  CHF: {
    USD: 1.14,
    EUR: 1.04,
    GBP: 0.9,
    JPY: 170.25,
    CAD: 1.55,
    AUD: 1.72,
    CNY: 8.17,
    INR: 94.45,
    BRL: 5.74,
  },
  CNY: {
    USD: 0.14,
    EUR: 0.13,
    GBP: 0.11,
    JPY: 20.84,
    CAD: 0.19,
    AUD: 0.21,
    CHF: 0.12,
    INR: 11.56,
    BRL: 0.7,
  },
  INR: {
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.8,
    CAD: 0.016,
    AUD: 0.018,
    CHF: 0.011,
    CNY: 0.087,
    BRL: 0.061,
  },
  BRL: {
    USD: 0.2,
    EUR: 0.18,
    GBP: 0.16,
    JPY: 29.67,
    CAD: 0.27,
    AUD: 0.3,
    CHF: 0.17,
    CNY: 1.42,
    INR: 16.46,
  },
}

export default function ExchangeRateCalculator() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [amount, setAmount] = useState(1)
  const [result, setResult] = useState(0)
  const [rate, setRate] = useState(0)
  const [popularRates, setPopularRates] = useState<Array<{ currency: string; rate: number }>>([])

  // Calculate exchange rate and result
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      const currentRate = fromCurrency === toCurrency ? 1 : mockExchangeRates[fromCurrency][toCurrency]

      setRate(currentRate)
      setResult(amount * currentRate)

      // Update popular rates
      const popular = currencies
        .filter((c) => c.code !== fromCurrency)
        .slice(0, 5)
        .map((c) => ({
          currency: c.code,
          rate: fromCurrency === c.code ? 1 : mockExchangeRates[fromCurrency][c.code],
        }))

      setPopularRates(popular)
    }
  }, [fromCurrency, toCurrency, amount])

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Exchange Rate Calculator</CardTitle>
        <CardDescription>Convert between different currencies using current exchange rates</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="converter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="converter">Currency Converter</TabsTrigger>
            <TabsTrigger value="popular">Popular Rates</TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
                    min={0}
                  />
                </div>

                <div>
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

                <Button variant="outline" size="icon" className="w-full" onClick={handleSwap}>
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Swap Currencies
                </Button>

                <div>
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

              <div className="flex flex-col justify-center space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground mb-2">Exchange Rate:</div>
                  <div className="text-2xl font-bold">
                    1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                  </div>
                </div>

                <div className="bg-primary/10 p-6 rounded-md">
                  <div className="text-sm text-muted-foreground mb-2">Converted Amount:</div>
                  <div className="text-3xl font-bold">
                    {result.toFixed(2)} {toCurrency}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  <RefreshCw className="h-3 w-3 inline mr-1" />
                  Rates updated: March 6, 2025
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="popular">
            <div className="space-y-4">
              <div className="mb-4">
                <Label htmlFor="base-currency">Base Currency</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger id="base-currency">
                    <SelectValue placeholder="Select base currency" />
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

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-4">Popular Exchange Rates for {fromCurrency}</h3>
                <div className="space-y-3">
                  {popularRates.map((item) => (
                    <div key={item.currency} className="flex justify-between items-center border-b border-border pb-2">
                      <div>
                        <span className="font-medium">{item.currency}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {currencies.find((c) => c.code === item.currency)?.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.rate.toFixed(4)}</div>
                        <div className="text-xs text-muted-foreground">
                          1 {fromCurrency} = {item.rate.toFixed(4)} {item.currency}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-md">
                <h3 className="font-medium mb-2">About Exchange Rates</h3>
                <p className="text-sm text-muted-foreground">
                  Exchange rates represent the value of one currency in terms of another. They fluctuate based on
                  economic factors, central bank policies, and market conditions. The rates shown here are for
                  informational purposes only.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

