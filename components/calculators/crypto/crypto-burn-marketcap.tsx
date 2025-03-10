"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CryptoBurnMarketCapCalculator() {
  const [totalSupply, setTotalSupply] = useState<number>(1000000000)
  const [circulatingSupply, setCirculatingSupply] = useState<number>(750000000)
  const [currentPrice, setCurrentPrice] = useState<number>(1)
  const [burnAmount, setBurnAmount] = useState<number>(100000000)
  const [burnPercentage, setBurnPercentage] = useState<number>(10)
  const [burnType, setBurnType] = useState<"amount" | "percentage">("amount")
  const [results, setResults] = useState({
    preMarketCap: 0,
    postMarketCap: 0,
    newCirculatingSupply: 0,
    newPrice: 0,
    priceIncrease: 0,
    priceIncreasePercentage: 0,
  })

  // Calculate the impact of token burn on market cap and price
  useEffect(() => {
    const calculateBurnImpact = () => {
      // Calculate pre-burn metrics
      const preMarketCap = circulatingSupply * currentPrice

      // Calculate burn amount based on type
      let actualBurnAmount = 0
      if (burnType === "amount") {
        actualBurnAmount = burnAmount
      } else {
        actualBurnAmount = circulatingSupply * (burnPercentage / 100)
      }

      // Ensure burn amount doesn't exceed circulating supply
      actualBurnAmount = Math.min(actualBurnAmount, circulatingSupply)

      // Calculate post-burn metrics
      const newCirculatingSupply = circulatingSupply - actualBurnAmount

      // Assuming market cap remains constant (simplified model)
      const postMarketCap = preMarketCap
      const newPrice = newCirculatingSupply > 0 ? postMarketCap / newCirculatingSupply : 0

      const priceIncrease = newPrice - currentPrice
      const priceIncreasePercentage = (priceIncrease / currentPrice) * 100

      setResults({
        preMarketCap,
        postMarketCap,
        newCirculatingSupply,
        newPrice,
        priceIncrease,
        priceIncreasePercentage,
      })
    }

    calculateBurnImpact()
  }, [totalSupply, circulatingSupply, currentPrice, burnAmount, burnPercentage, burnType])

  // Handle burn type change
  const handleBurnTypeChange = (value: string) => {
    setBurnType(value as "amount" | "percentage")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Burn MarketCap Calculator</CardTitle>
        <CardDescription>Calculate the impact of token burns on market capitalization and price</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="info">Burn Information</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="totalSupply">Total Supply</Label>
                  <Input
                    id="totalSupply"
                    type="number"
                    value={totalSupply}
                    onChange={(e) => setTotalSupply(Number.parseFloat(e.target.value) || 0)}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="circulatingSupply">Circulating Supply</Label>
                  <Input
                    id="circulatingSupply"
                    type="number"
                    value={circulatingSupply}
                    onChange={(e) => setCirculatingSupply(Number.parseFloat(e.target.value) || 0)}
                    min={0}
                    max={totalSupply}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPrice">Current Price (USD)</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number.parseFloat(e.target.value) || 0)}
                  min={0}
                  step="0.000001"
                />
              </div>

              <div className="space-y-2">
                <Label>Burn Type</Label>
                <Tabs value={burnType} onValueChange={handleBurnTypeChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="amount">Fixed Amount</TabsTrigger>
                    <TabsTrigger value="percentage">Percentage</TabsTrigger>
                  </TabsList>

                  <TabsContent value="amount" className="space-y-2 pt-2">
                    <Label htmlFor="burnAmount">Burn Amount (tokens)</Label>
                    <Input
                      id="burnAmount"
                      type="number"
                      value={burnAmount}
                      onChange={(e) => setBurnAmount(Number.parseFloat(e.target.value) || 0)}
                      min={0}
                      max={circulatingSupply}
                    />
                  </TabsContent>

                  <TabsContent value="percentage" className="space-y-2 pt-2">
                    <Label htmlFor="burnPercentage">Burn Percentage (%)</Label>
                    <Input
                      id="burnPercentage"
                      type="number"
                      value={burnPercentage}
                      onChange={(e) => setBurnPercentage(Number.parseFloat(e.target.value) || 0)}
                      min={0}
                      max={100}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-sm text-muted-foreground">Pre-Burn Market Cap</div>
                  <div className="text-xl font-bold">${results.preMarketCap.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Post-Burn Market Cap</div>
                  <div className="text-xl font-bold">${results.postMarketCap.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">New Circulating Supply</div>
                  <div className="text-xl font-bold">{results.newCirculatingSupply.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">New Price</div>
                  <div className="text-xl font-bold">${results.newPrice.toFixed(6)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Price Increase</div>
                  <div className="text-xl font-bold">${results.priceIncrease.toFixed(6)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Price Increase %</div>
                  <div className="text-xl font-bold">{results.priceIncreasePercentage.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">What is Token Burning?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Token burning is the process of permanently removing tokens from circulation, reducing the total
                  supply. This is typically done by sending tokens to a "burn address" that has no private key, making
                  the tokens irretrievable.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Benefits of Token Burns</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>Reduces circulating supply, potentially increasing token value</li>
                  <li>Can be used as a deflationary mechanism</li>
                  <li>May increase scarcity and demand</li>
                  <li>Often viewed positively by the market</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Common Burn Mechanisms</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>
                    <strong>Buy-back and burn:</strong> Projects use revenue to purchase tokens and burn them
                  </li>
                  <li>
                    <strong>Transaction burns:</strong> A percentage of each transaction is automatically burned
                  </li>
                  <li>
                    <strong>Scheduled burns:</strong> Regular burns at predetermined intervals
                  </li>
                  <li>
                    <strong>One-time burns:</strong> Large burns done once, often at token launch
                  </li>
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This calculator assumes market cap remains constant after the burn, which is a
                  simplified model. In reality, market dynamics, investor sentiment, and other factors can significantly
                  impact the actual price movement following a token burn.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

