"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Percent, DollarSign } from "lucide-react"
import Link from "next/link"

export function QuickCalculatorWidget() {
  // Basic Calculator State
  const [basicInput, setBasicInput] = useState("")
  const [basicResult, setBasicResult] = useState("")

  // Percentage Calculator State
  const [percentValue, setPercentValue] = useState("")
  const [percentOf, setPercentOf] = useState("")
  const [percentResult, setPercentResult] = useState("")

  // Tip Calculator State
  const [billAmount, setBillAmount] = useState("")
  const [tipPercent, setTipPercent] = useState("15")
  const [tipResult, setTipResult] = useState("")

  // Basic Calculator Logic
  const handleBasicCalculation = () => {
    try {
      // Using Function constructor instead of eval for better security
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict";return (' + basicInput + ")")()
      setBasicResult(Number.isFinite(result) ? result.toString() : "Error")
    } catch (error) {
      setBasicResult("Error")
    }
  }

  // Handle key press for basic calculator
  const handleBasicKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBasicCalculation()
    }
  }

  // Percentage Calculator Logic
  const handlePercentCalculation = () => {
    try {
      const result = (Number.parseFloat(percentValue) / 100) * Number.parseFloat(percentOf)
      setPercentResult(Number.isFinite(result) ? result.toFixed(2).toString() : "Error")
    } catch (error) {
      setPercentResult("Error")
    }
  }

  // Tip Calculator Logic
  const handleTipCalculation = () => {
    try {
      const bill = Number.parseFloat(billAmount)
      const tip = bill * (Number.parseFloat(tipPercent) / 100)
      const total = bill + tip

      if (!Number.isFinite(bill) || !Number.isFinite(tip)) {
        setTipResult("Error")
        return
      }

      setTipResult(`Tip: $${tip.toFixed(2)}, Total: $${total.toFixed(2)}`)
    } catch (error) {
      setTipResult("Error")
    }
  }

  return (
    <Card className="w-full shadow-md border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Quick Calculator</CardTitle>
        </div>
        <CardDescription>Solve common calculations instantly</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">
              <Calculator className="h-4 w-4 mr-2" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="percentage">
              <Percent className="h-4 w-4 mr-2" />
              Percentage
            </TabsTrigger>
            <TabsTrigger value="tip">
              <DollarSign className="h-4 w-4 mr-2" />
              Tip
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-0">
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter calculation (e.g., 5+10*3)"
                  value={basicInput}
                  onChange={(e) => setBasicInput(e.target.value)}
                  onKeyPress={handleBasicKeyPress}
                  className="mb-2"
                  aria-label="Basic calculation input"
                />
                <Button onClick={handleBasicCalculation} className="w-full">
                  Calculate
                </Button>
              </div>
              {basicResult && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="font-mono text-lg" aria-live="polite">
                    {basicResult}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="percentage" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="percent-value" className="sr-only">
                    Percentage
                  </label>
                  <Input
                    id="percent-value"
                    type="number"
                    placeholder="Percentage"
                    value={percentValue}
                    onChange={(e) => setPercentValue(e.target.value)}
                    aria-label="Percentage value"
                  />
                </div>
                <div>
                  <label htmlFor="percent-of" className="sr-only">
                    Of value
                  </label>
                  <Input
                    id="percent-of"
                    type="number"
                    placeholder="Of value"
                    value={percentOf}
                    onChange={(e) => setPercentOf(e.target.value)}
                    aria-label="Of value"
                  />
                </div>
              </div>
              <Button onClick={handlePercentCalculation} className="w-full">
                Calculate
              </Button>
              {percentResult && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="font-mono text-lg" aria-live="polite">
                    {percentResult}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tip" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="bill-amount" className="sr-only">
                    Bill amount
                  </label>
                  <Input
                    id="bill-amount"
                    type="number"
                    placeholder="Bill amount"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    aria-label="Bill amount"
                  />
                </div>
                <div>
                  <label htmlFor="tip-percent" className="sr-only">
                    Tip percentage
                  </label>
                  <Input
                    id="tip-percent"
                    type="number"
                    placeholder="Tip %"
                    value={tipPercent}
                    onChange={(e) => setTipPercent(e.target.value)}
                    aria-label="Tip percentage"
                  />
                </div>
              </div>
              <Button onClick={handleTipCalculation} className="w-full">
                Calculate
              </Button>
              {tipResult && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="font-mono text-lg" aria-live="polite">
                    {tipResult}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">Need more advanced calculations?</p>
        <Link href="/calculators/math">
          <Button variant="outline" size="sm">
            View All Calculators
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

