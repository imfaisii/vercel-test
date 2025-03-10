"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const cryptoCurrencies = [
  { name: "Bitcoin", symbol: "BTC", value: 65000 },
  { name: "Ethereum", symbol: "ETH", value: 3500 },
  { name: "Solana", symbol: "SOL", value: 150 },
  { name: "Cardano", symbol: "ADA", value: 0.5 },
  { name: "Dogecoin", symbol: "DOGE", value: 0.15 },
]

const fiatCurrencies = [
  { name: "US Dollar", symbol: "USD", value: 1 },
  { name: "Euro", symbol: "EUR", value: 0.92 },
  { name: "British Pound", symbol: "GBP", value: 0.79 },
  { name: "Japanese Yen", symbol: "JPY", value: 150 },
  { name: "Canadian Dollar", symbol: "CAD", value: 1.35 },
]

export default function CryptoConverterCalculator() {
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState<string>("BTC")
  const [toCurrency, setToCurrency] = useState<string>("USD")
  const [result, setResult] = useState<number>(0)
  const [fromType, setFromType] = useState<"crypto" | "fiat">("crypto")
  const [toType, setToType] = useState<"crypto" | "fiat">("fiat")

  // Calculate conversion
  useEffect(() => {
    const calculateConversion = () => {
      let fromValue = 0
      let toValue = 0

      // Get from currency value
      if (fromType === "crypto") {
        const currency = cryptoCurrencies.find((c) => c.symbol === fromCurrency)
        fromValue = currency ? currency.value : 0
      } else {
        const currency = fiatCurrencies.find((c) => c.symbol === fromCurrency)
        fromValue = currency ? currency.value : 0
      }

      // Get to currency value
      if (toType === "crypto") {
        const currency = cryptoCurrencies.find((c) => c.symbol === toCurrency)
        toValue = currency ? currency.value : 0
      } else {
        const currency = fiatCurrencies.find((c) => c.symbol === toCurrency)
        toValue = currency ? currency.value : 0
      }

      // Calculate result
      if (fromType === "crypto" && toType === "fiat") {
        // Crypto to Fiat
        setResult((amount * fromValue) / toValue)
      } else if (fromType === "fiat" && toType === "crypto") {
        // Fiat to Crypto
        setResult((amount * fromValue) / toValue)
      } else if (fromType === "crypto" && toType === "crypto") {
        // Crypto to Crypto
        setResult((amount * fromValue) / toValue)
      } else {
        // Fiat to Fiat
        setResult((amount * fromValue) / toValue)
      }
    }

    calculateConversion()
  }, [amount, fromCurrency, toCurrency, fromType, toType])

  // Handle currency type change
  const handleFromTypeChange = (value: string) => {
    const newType = value as "crypto" | "fiat"
    setFromType(newType)
    // Set default currency for the selected type
    if (newType === "crypto") {
      setFromCurrency("BTC")
    } else {
      setFromCurrency("USD")
    }
  }

  const handleToTypeChange = (value: string) => {
    const newType = value as "crypto" | "fiat"
    setToType(newType)
    // Set default currency for the selected type
    if (newType === "crypto") {
      setToCurrency("BTC")
    } else {
      setToCurrency("USD")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Converter Calculator</CardTitle>
        <CardDescription>Convert between cryptocurrencies and fiat currencies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
                min={0}
                step="0.000001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fromType">From</Label>
              <Select value={fromType} onValueChange={handleFromTypeChange}>
                <SelectTrigger id="fromType">
                  <SelectValue placeholder="Select currency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="fiat">Fiat Currency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromCurrency">Currency</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="fromCurrency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {fromType === "crypto"
                    ? cryptoCurrencies.map((currency) => (
                        <SelectItem key={currency.symbol} value={currency.symbol}>
                          {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))
                    : fiatCurrencies.map((currency) => (
                        <SelectItem key={currency.symbol} value={currency.symbol}>
                          {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="toType">To</Label>
              <Select value={toType} onValueChange={handleToTypeChange}>
                <SelectTrigger id="toType">
                  <SelectValue placeholder="Select currency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="fiat">Fiat Currency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toCurrency">Currency</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="toCurrency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {toType === "crypto"
                    ? cryptoCurrencies.map((currency) => (
                        <SelectItem key={currency.symbol} value={currency.symbol}>
                          {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))
                    : fiatCurrencies.map((currency) => (
                        <SelectItem key={currency.symbol} value={currency.symbol}>
                          {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Conversion Result</div>
            <div className="mt-1 text-2xl font-bold">
              {amount} {fromCurrency} = {result.toFixed(6)} {toCurrency}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Note: These rates are for demonstration purposes only and may not reflect current market values.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

