"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowUp, ArrowDown, Calculator, Percent } from "lucide-react"

const IncreaseDecreaseCalculator = () => {
  const [originalValue, setOriginalValue] = useState<string>("")
  const [percentageChange, setPercentageChange] = useState<string>("")
  const [newValue, setNewValue] = useState<string>("")
  const [changeAmount, setChangeAmount] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("increase")

  // Calculate when inputs change
  useEffect(() => {
    calculateChange()
  }, [originalValue, percentageChange, activeTab])

  const calculateChange = () => {
    const original = Number.parseFloat(originalValue)
    const percentage = Number.parseFloat(percentageChange)

    if (isNaN(original) || isNaN(percentage)) {
      setNewValue("")
      setChangeAmount("")
      return
    }

    let change: number
    let result: number

    if (activeTab === "increase") {
      change = original * (percentage / 100)
      result = original + change
    } else {
      change = original * (percentage / 100)
      result = original - change
    }

    setNewValue(result.toFixed(2))
    setChangeAmount(Math.abs(change).toFixed(2))
  }

  const handleReset = () => {
    setOriginalValue("")
    setPercentageChange("")
    setNewValue("")
    setChangeAmount("")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Percentage Increase/Decrease</CardTitle>
        <CardDescription>Calculate the result of a percentage increase or decrease</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="increase">
              <ArrowUp className="h-4 w-4 mr-2" />
              Increase
            </TabsTrigger>
            <TabsTrigger value="decrease">
              <ArrowDown className="h-4 w-4 mr-2" />
              Decrease
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="original-value">Original Value</Label>
              <Input
                id="original-value"
                type="number"
                placeholder="Enter original value"
                value={originalValue}
                onChange={(e) => setOriginalValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage-change">
                Percentage {activeTab === "increase" ? "Increase" : "Decrease"} (%)
              </Label>
              <Input
                id="percentage-change"
                type="number"
                placeholder="Enter percentage"
                value={percentageChange}
                onChange={(e) => setPercentageChange(e.target.value)}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Original Value:</span>
                <span className="font-semibold">{originalValue || "0"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {activeTab === "increase" ? "Increase" : "Decrease"} Amount:
                </span>
                <div className="flex items-center">
                  <span className="font-semibold">{changeAmount || "0"}</span>
                  <Percent className="h-3 w-3 mx-1" />
                </div>
              </div>

              <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                <span className="text-sm font-medium">New Value:</span>
                <span className="font-bold text-lg">{newValue || "0"}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={handleReset}>
              <Calculator className="h-4 w-4 mr-2" />
              Reset Calculator
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default IncreaseDecreaseCalculator

