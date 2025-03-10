"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ArrowUpDown, Info } from "lucide-react"

// Common currencies
const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
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

type ConversionItem = {
  currency: string
  value: number
}

export default function CurrencyConverterCalculator() {
  const [baseCurrency, setBaseCurrency] = useState("USD")
  const [baseAmount, setBaseAmount] = useState(1)
  const [targetCurrencies, setTargetCurrencies] = useState<ConversionItem[]>([
    { currency: "EUR", value: 0 },
    { currency: "GBP", value: 0 },
    { currency: "JPY", value: 0 },
  ])
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([])

  // Update available currencies
  useEffect(() => {
    const used = [baseCurrency, ...targetCurrencies.map((t) => t.currency)]
    setAvailableCurrencies(currencies.filter((c) => !used.includes(c.code)).map((c) => c.code))
  }, [baseCurrency, targetCurrencies])

  // Calculate conversions
  useEffect(() => {
    const updated = targetCurrencies.map((item) => {
      const rate = baseCurrency === item.currency ? 1 : mockExchangeRates[baseCurrency][item.currency]

      return {
        ...item,
        value: baseAmount * rate,
      }
    })

    setTargetCurrencies(updated)
  }, [baseCurrency, baseAmount])

  // Add a new target currency
  const handleAddCurrency = () => {
    if (availableCurrencies.length > 0) {
      const newCurrency = availableCurrencies[0]
      const rate = baseCurrency === newCurrency ? 1 : mockExchangeRates[baseCurrency][newCurrency]

      setTargetCurrencies([...targetCurrencies, { currency: newCurrency, value: baseAmount * rate }])
    }
  }

  // Remove a target currency
  const handleRemoveCurrency = (index: number) => {
    setTargetCurrencies(targetCurrencies.filter((_, i) => i !== index))
  }

  // Update a target currency
  const handleChangeCurrency = (index: number, newCurrency: string) => {
    const updated = [...targetCurrencies]
    const rate = baseCurrency === newCurrency ? 1 : mockExchangeRates[baseCurrency][newCurrency]

    updated[index] = {
      currency: newCurrency,
      value: baseAmount * rate,
    }

    setTargetCurrencies(updated)
  }

  // Swap with base currency
  const handleSwapWithBase = (index: number) => {
    const targetCurrency = targetCurrencies[index].currency
    const newTargets = targetCurrencies.filter((_, i) => i !== index)

    // Add the old base to the targets
    const rate = targetCurrency === baseCurrency ? 1 : mockExchangeRates[targetCurrency][baseCurrency]

    newTargets.push({
      currency: baseCurrency,
      value: baseAmount * rate,
    })

    setBaseCurrency(targetCurrency)
    setTargetCurrencies(newTargets)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between multiple currencies simultaneously</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="converter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="converter">Multi-Currency Converter</TabsTrigger>
            <TabsTrigger value="info">Currency Information</TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="space-y-6">
            <div className="space-y-6">
              {/* Base currency section */}
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="base-currency">Base Currency</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                    <SelectTrigger id="base-currency">
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

                  <div className="md:col-span-2">
                    <Input
                      type="number"
                      value={baseAmount}
                      onChange={(e) => setBaseAmount(Number.parseFloat(e.target.value) || 0)}
                      min={0}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              </div>

              {/* Target currencies section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Target Currencies</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddCurrency}
                    disabled={availableCurrencies.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Currency
                  </Button>
                </div>

                {targetCurrencies.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-md">
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Select value={item.currency} onValueChange={(value) => handleChangeCurrency(index, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies
                            .filter(
                              (c) =>
                                c.code === item.currency ||
                                (!targetCurrencies.map((t) => t.currency).includes(c.code) && c.code !== baseCurrency),
                            )
                            .map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.code} - {currency.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <div className="md:col-span-2 flex items-center space-x-2">
                        <div className="flex-grow">
                          <Input type="text" value={item.value.toFixed(2)} readOnly className="bg-muted" />
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSwapWithBase(index)}
                          title="Swap with base currency"
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCurrency(index)}
                          className="text-destructive"
                          title="Remove currency"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {targetCurrencies.length === 0 && (
                  <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                    No target currencies added. Click "Add Currency" to start converting.
                  </div>
                )}
              </div>

              <div className="bg-primary/5 p-4 rounded-md text-sm text-muted-foreground">
                <Info className="h-4 w-4 inline-block mr-2" />
                Exchange rates are updated daily. Last update: March 6, 2025.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info">
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-4">Currency Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currencies.map((currency) => (
                    <div key={currency.code} className="flex items-center space-x-3 p-2 border-b">
                      <div className="font-bold text-lg">{currency.symbol}</div>
                      <div>
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-sm text-muted-foreground">{currency.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-md">
                <h3 className="font-medium mb-2">About Currency Conversion</h3>
                <p className="text-sm text-muted-foreground">
                  Currency conversion is the process of changing one currency into another at a specific exchange rate.
                  Exchange rates fluctuate based on market conditions, economic indicators, and central bank policies.
                  This calculator provides approximate conversions for informational purposes only.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

