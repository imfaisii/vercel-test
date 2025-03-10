"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Percent, DollarSign, Calculator } from "lucide-react"

const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState<string>("")
  const [discountPercent, setDiscountPercent] = useState<string>("")
  const [discountAmount, setDiscountAmount] = useState<string>("")
  const [finalPrice, setFinalPrice] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("percent")

  // Calculate when inputs change
  useEffect(() => {
    calculateDiscount()
  }, [originalPrice, discountPercent, discountAmount, activeTab])

  const calculateDiscount = () => {
    const price = Number.parseFloat(originalPrice)

    if (isNaN(price)) {
      setFinalPrice("")
      return
    }

    if (activeTab === "percent") {
      const discount = Number.parseFloat(discountPercent)

      if (isNaN(discount)) {
        setFinalPrice("")
        return
      }

      const discountValue = price * (discount / 100)
      const final = price - discountValue

      setDiscountAmount(discountValue.toFixed(2))
      setFinalPrice(final.toFixed(2))
    } else {
      const discount = Number.parseFloat(discountAmount)

      if (isNaN(discount)) {
        setFinalPrice("")
        setDiscountPercent("")
        return
      }

      const final = price - discount
      const discountPercentValue = (discount / price) * 100

      setDiscountPercent(discountPercentValue.toFixed(2))
      setFinalPrice(final.toFixed(2))
    }
  }

  const handleReset = () => {
    setOriginalPrice("")
    setDiscountPercent("")
    setDiscountAmount("")
    setFinalPrice("")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Discount Calculator</CardTitle>
        <CardDescription>Calculate the final price after applying a discount</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="percent">
              <Percent className="h-4 w-4 mr-2" />
              Discount Percent
            </TabsTrigger>
            <TabsTrigger value="amount">
              <DollarSign className="h-4 w-4 mr-2" />
              Discount Amount
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="original-price">Original Price ($)</Label>
              <Input
                id="original-price"
                type="number"
                placeholder="Enter original price"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>

            <TabsContent value="percent" className="space-y-2 mt-0">
              <Label htmlFor="discount-percent">Discount (%)</Label>
              <Input
                id="discount-percent"
                type="number"
                placeholder="Enter discount percentage"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="amount" className="space-y-2 mt-0">
              <Label htmlFor="discount-amount">Discount Amount ($)</Label>
              <Input
                id="discount-amount"
                type="number"
                placeholder="Enter discount amount"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </TabsContent>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Original Price:</span>
                <span className="font-semibold">${originalPrice || "0.00"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Discount:</span>
                <div className="flex items-center">
                  <span className="font-semibold">${discountAmount || "0.00"}</span>
                  <ArrowRight className="h-3 w-3 mx-2" />
                  <span className="font-semibold">{discountPercent || "0"}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                <span className="text-sm font-medium">Final Price:</span>
                <span className="font-bold text-lg">${finalPrice || "0.00"}</span>
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

export default DiscountCalculator

