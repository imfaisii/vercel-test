"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CryptoTaxCalculator() {
  const [purchasePrice, setPurchasePrice] = useState<number>(10000)
  const [salePrice, setSalePrice] = useState<number>(15000)
  const [taxRate, setTaxRate] = useState<number>(20)
  const [holdingPeriod, setHoldingPeriod] = useState<number>(6)
  const [country, setCountry] = useState<string>("us")

  // Calculate tax
  const calculateTax = () => {
    const profit = salePrice - purchasePrice

    // Apply different tax rates based on country and holding period
    let effectiveTaxRate = taxRate

    if (country === "us") {
      // US tax rules (simplified)
      if (holdingPeriod >= 12) {
        effectiveTaxRate = 15 // Long-term capital gains tax rate
      }
    } else if (country === "uk") {
      // UK tax rules (simplified)
      if (profit < 12300) {
        effectiveTaxRate = 0 // Tax-free allowance
      }
    } else if (country === "germany") {
      // German tax rules (simplified)
      if (holdingPeriod >= 12) {
        effectiveTaxRate = 0 // Tax-free after 1 year
      }
    }

    const taxAmount = profit * (effectiveTaxRate / 100)
    const netProfit = profit - taxAmount

    return {
      profit,
      taxAmount,
      netProfit,
      effectiveTaxRate,
    }
  }

  const taxResult = calculateTax()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Tax Calculator</CardTitle>
        <CardDescription>Calculate tax implications for cryptocurrency transactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="info">Tax Information</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Tax Jurisdiction</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="germany">Germany</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holdingPeriod">Holding Period (months)</Label>
                  <Input
                    id="holdingPeriod"
                    type="number"
                    value={holdingPeriod}
                    onChange={(e) => setHoldingPeriod(Number.parseInt(e.target.value) || 0)}
                    min={0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price (USD)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number.parseFloat(e.target.value) || 0)}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price (USD)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number.parseFloat(e.target.value) || 0)}
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number.parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                />
                <p className="text-xs text-muted-foreground">
                  Default tax rate. Will be adjusted based on jurisdiction and holding period.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Profit/Loss</div>
                  <div className="text-xl font-bold">${taxResult.profit.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Effective Tax Rate</div>
                  <div className="text-xl font-bold">{taxResult.effectiveTaxRate.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tax Amount</div>
                  <div className="text-xl font-bold">${taxResult.taxAmount.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Net Profit</div>
                  <div className="text-xl font-bold">${taxResult.netProfit.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Tax Considerations for Cryptocurrencies</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Cryptocurrency tax laws vary by country and are constantly evolving. Here are some general guidelines:
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">United States</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>Cryptocurrencies are treated as property for tax purposes</li>
                  <li>Short-term gains (held less than 1 year) are taxed at ordinary income rates</li>
                  <li>Long-term gains (held more than 1 year) qualify for lower capital gains rates</li>
                  <li>Each transaction may be a taxable event, including crypto-to-crypto trades</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">United Kingdom</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>Cryptocurrencies are subject to capital gains tax</li>
                  <li>Annual tax-free allowance applies (£12,300 for 2021/22)</li>
                  <li>Mining and staking may be treated as income</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Germany</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>Cryptocurrencies held for more than 1 year are tax-free</li>
                  <li>Short-term gains are taxed at the individual's income tax rate</li>
                  <li>Mining and staking may have different tax implications</li>
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> This calculator provides estimates only and should not be considered tax
                  advice. Consult with a qualified tax professional for advice specific to your situation.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

