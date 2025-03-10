"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, DollarSign, Percent } from "lucide-react"

const TaxCalculator = () => {
  const [amount, setAmount] = useState<string>("")
  const [taxRate, setTaxRate] = useState<string>("")
  const [taxAmount, setTaxAmount] = useState<string>("")
  const [totalAmount, setTotalAmount] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("add")
  const [commonRates, setCommonRates] = useState<number[]>([5, 7, 10, 15])

  // Calculate when inputs change
  useEffect(() => {
    calculateTax()
  }, [amount, taxRate, activeTab])

  const calculateTax = () => {
    const baseAmount = Number.parseFloat(amount)
    const rate = Number.parseFloat(taxRate)

    if (isNaN(baseAmount) || isNaN(rate)) {
      setTaxAmount("")
      setTotalAmount("")
      return
    }

    const tax = baseAmount * (rate / 100)

    if (activeTab === "add") {
      // Add tax to amount
      setTaxAmount(tax.toFixed(2))
      setTotalAmount((baseAmount + tax).toFixed(2))
    } else {
      // Extract tax from amount (amount is the total)
      const extractedTax = baseAmount * (rate / (100 + rate))
      const preTaxAmount = baseAmount - extractedTax
      setTaxAmount(extractedTax.toFixed(2))
      setTotalAmount(baseAmount.toFixed(2))
      setAmount(preTaxAmount.toFixed(2))
    }
  }

  const handleReset = () => {
    setAmount("")
    setTaxRate("")
    setTaxAmount("")
    setTotalAmount("")
  }

  const handleCommonRateClick = (rate: number) => {
    setTaxRate(rate.toString())
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Tax Calculator</CardTitle>
        <CardDescription>Calculate tax amounts and totals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="add">
              <DollarSign className="h-4 w-4 mr-2" />
              Add Tax
            </TabsTrigger>
            <TabsTrigger value="extract">
              <Percent className="h-4 w-4 mr-2" />
              Extract Tax
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">{activeTab === "add" ? "Pre-tax Amount ($)" : "Total Amount with Tax ($)"}</Label>
              <Input
                id="amount"
                type="number"
                placeholder={activeTab === "add" ? "Enter pre-tax amount" : "Enter amount with tax"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                placeholder="Enter tax rate"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {commonRates.map((rate) => (
                  <Button
                    key={rate}
                    variant={taxRate === rate.toString() ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCommonRateClick(rate)}
                  >
                    {rate}%
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              {activeTab === "add" ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pre-tax Amount:</span>
                    <span className="font-semibold">${amount || "0.00"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tax Amount ({taxRate || "0"}%):</span>
                    <span className="font-semibold">${taxAmount || "0.00"}</span>
                  </div>

                  <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="font-bold text-lg">${totalAmount || "0.00"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Amount (with tax):</span>
                    <span className="font-semibold">${totalAmount || "0.00"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tax Amount ({taxRate || "0"}%):</span>
                    <span className="font-semibold">${taxAmount || "0.00"}</span>
                  </div>

                  <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                    <span className="text-sm font-medium">Pre-tax Amount:</span>
                    <span className="font-bold text-lg">${amount || "0.00"}</span>
                  </div>
                </>
              )}
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

export default TaxCalculator

