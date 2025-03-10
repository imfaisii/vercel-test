"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const cryptoData = [
  { name: "Bitcoin", symbol: "BTC", price: 65000, difficulty: 55.6, blockReward: 6.25 },
  { name: "Ethereum", symbol: "ETH", price: 3500, difficulty: 12.5, blockReward: 2 },
  { name: "Litecoin", symbol: "LTC", price: 80, difficulty: 15.5, blockReward: 12.5 },
  { name: "Monero", symbol: "XMR", price: 170, difficulty: 320000, blockReward: 0.6 },
  { name: "Dogecoin", symbol: "DOGE", price: 0.15, difficulty: 8.5, blockReward: 10000 },
]

export default function CryptoMiningCalculator() {
  const [cryptocurrency, setCryptocurrency] = useState<string>("BTC")
  const [hashRate, setHashRate] = useState<number>(100)
  const [hashRateUnit, setHashRateUnit] = useState<string>("TH/s")
  const [powerConsumption, setPowerConsumption] = useState<number>(3200)
  const [electricityCost, setElectricityCost] = useState<number>(0.12)
  const [poolFee, setPoolFee] = useState<number>(2)
  const [hardwareCost, setHardwareCost] = useState<number>(10000)
  const [results, setResults] = useState({
    dailyRevenue: 0,
    dailyProfit: 0,
    monthlyProfit: 0,
    yearlyProfit: 0,
    breakEvenDays: 0,
    roi: 0,
  })

  // Calculate mining profitability
  useEffect(() => {
    const calculateProfitability = () => {
      const selectedCrypto = cryptoData.find((c) => c.symbol === cryptocurrency)
      if (!selectedCrypto) return

      // Convert hash rate to TH/s for standardization
      let standardizedHashRate = hashRate
      if (hashRateUnit === "PH/s") standardizedHashRate = hashRate * 1000
      if (hashRateUnit === "EH/s") standardizedHashRate = hashRate * 1000000
      if (hashRateUnit === "GH/s") standardizedHashRate = hashRate / 1000
      if (hashRateUnit === "MH/s") standardizedHashRate = hashRate / 1000000

      // Calculate daily rewards (simplified model)
      let dailyRewards = 0

      if (cryptocurrency === "BTC") {
        // Bitcoin calculation (simplified)
        const networkHashRate = 350000 // in TH/s
        const blocksPerDay = 144
        dailyRewards = (standardizedHashRate / networkHashRate) * blocksPerDay * selectedCrypto.blockReward
      } else if (cryptocurrency === "ETH") {
        // Ethereum calculation (simplified)
        const networkHashRate = 1000 // in TH/s
        const blocksPerDay = 6500
        dailyRewards = (standardizedHashRate / networkHashRate) * blocksPerDay * selectedCrypto.blockReward
      } else {
        // Generic calculation for other coins
        const networkHashRate = selectedCrypto.difficulty * 10
        const blocksPerDay = 720 // Approximate for most coins
        dailyRewards = (standardizedHashRate / networkHashRate) * blocksPerDay * selectedCrypto.blockReward
      }

      // Apply pool fee
      dailyRewards = dailyRewards * (1 - poolFee / 100)

      // Calculate revenue and costs
      const dailyRevenue = dailyRewards * selectedCrypto.price
      const dailyElectricityCost = (powerConsumption / 1000) * 24 * electricityCost
      const dailyProfit = dailyRevenue - dailyElectricityCost
      const monthlyProfit = dailyProfit * 30
      const yearlyProfit = dailyProfit * 365

      // Calculate ROI and break-even
      const roi = (yearlyProfit / hardwareCost) * 100
      const breakEvenDays = hardwareCost / dailyProfit

      setResults({
        dailyRevenue,
        dailyProfit,
        monthlyProfit,
        yearlyProfit,
        breakEvenDays,
        roi,
      })
    }

    calculateProfitability()
  }, [cryptocurrency, hashRate, hashRateUnit, powerConsumption, electricityCost, poolFee, hardwareCost])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Mining Calculator</CardTitle>
        <CardDescription>Calculate mining profitability for different cryptocurrencies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cryptocurrency">Cryptocurrency</Label>
              <Select value={cryptocurrency} onValueChange={setCryptocurrency}>
                <SelectTrigger id="cryptocurrency">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptoData.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      {crypto.name} ({crypto.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hardwareCost">Hardware Cost (USD)</Label>
              <Input
                id="hardwareCost"
                type="number"
                value={hardwareCost}
                onChange={(e) => setHardwareCost(Number.parseFloat(e.target.value) || 0)}
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="hashRate">Hash Rate</Label>
              <Input
                id="hashRate"
                type="number"
                value={hashRate}
                onChange={(e) => setHashRate(Number.parseFloat(e.target.value) || 0)}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hashRateUnit">Unit</Label>
              <Select value={hashRateUnit} onValueChange={setHashRateUnit}>
                <SelectTrigger id="hashRateUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MH/s">MH/s</SelectItem>
                  <SelectItem value="GH/s">GH/s</SelectItem>
                  <SelectItem value="TH/s">TH/s</SelectItem>
                  <SelectItem value="PH/s">PH/s</SelectItem>
                  <SelectItem value="EH/s">EH/s</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="powerConsumption">Power Consumption (W)</Label>
              <Input
                id="powerConsumption"
                type="number"
                value={powerConsumption}
                onChange={(e) => setPowerConsumption(Number.parseFloat(e.target.value) || 0)}
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="electricityCost">Electricity Cost (USD/kWh)</Label>
              <Input
                id="electricityCost"
                type="number"
                value={electricityCost}
                onChange={(e) => setElectricityCost(Number.parseFloat(e.target.value) || 0)}
                min={0}
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poolFee">Pool Fee (%)</Label>
              <div className="pt-2">
                <Slider
                  id="poolFee"
                  value={[poolFee]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => setPoolFee(value[0])}
                />
              </div>
              <div className="text-right text-sm">{poolFee}%</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Daily Revenue</div>
              <div className="text-xl font-bold">${results.dailyRevenue.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Daily Profit</div>
              <div className="text-xl font-bold">${results.dailyProfit.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Monthly Profit</div>
              <div className="text-xl font-bold">${results.monthlyProfit.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Yearly Profit</div>
              <div className="text-xl font-bold">${results.yearlyProfit.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Break-even</div>
              <div className="text-xl font-bold">{results.breakEvenDays.toFixed(0)} days</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">ROI (yearly)</div>
              <div className="text-xl font-bold">{results.roi.toFixed(2)}%</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Note: These calculations are estimates based on current network difficulty and prices. Actual results may
            vary due to market volatility and network changes.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

