"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Calculator, Users, Receipt } from "lucide-react"

const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState<string>("")
  const [tipPercent, setTipPercent] = useState<number>(15)
  const [numberOfPeople, setNumberOfPeople] = useState<string>("1")
  const [tipAmount, setTipAmount] = useState<string>("")
  const [totalAmount, setTotalAmount] = useState<string>("")
  const [perPersonAmount, setPerPersonAmount] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("calculate")

  // Calculate when inputs change
  useEffect(() => {
    calculateTip()
  }, [billAmount, tipPercent, numberOfPeople])

  const calculateTip = () => {
    const bill = Number.parseFloat(billAmount)
    const people = Number.parseInt(numberOfPeople) || 1

    if (isNaN(bill)) {
      setTipAmount("")
      setTotalAmount("")
      setPerPersonAmount("")
      return
    }

    const tip = bill * (tipPercent / 100)
    const total = bill + tip
    const perPerson = total / people

    setTipAmount(tip.toFixed(2))
    setTotalAmount(total.toFixed(2))
    setPerPersonAmount(perPerson.toFixed(2))
  }

  const handleReset = () => {
    setBillAmount("")
    setTipPercent(15)
    setNumberOfPeople("1")
    setTipAmount("")
    setTotalAmount("")
    setPerPersonAmount("")
  }

  const commonTipPercentages = [10, 15, 18, 20, 25]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Tip Calculator</CardTitle>
        <CardDescription>Calculate tip amount and split the bill among people</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="calculate">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </TabsTrigger>
            <TabsTrigger value="info">
              <Receipt className="h-4 w-4 mr-2" />
              Tipping Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculate" className="space-y-4 mt-0">
            <div className="space-y-2">
              <Label htmlFor="bill-amount">Bill Amount ($)</Label>
              <Input
                id="bill-amount"
                type="number"
                placeholder="Enter bill amount"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="tip-percent">Tip Percentage ({tipPercent}%)</Label>
              </div>
              <Slider
                id="tip-percent"
                min={0}
                max={30}
                step={1}
                value={[tipPercent]}
                onValueChange={(value) => setTipPercent(value[0])}
                className="my-4"
              />
              <div className="flex justify-between gap-2 mt-2">
                {commonTipPercentages.map((percent) => (
                  <Button
                    key={percent}
                    variant={tipPercent === percent ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTipPercent(percent)}
                    className="flex-1"
                  >
                    {percent}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="number-of-people">Number of People</Label>
              </div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const current = Number.parseInt(numberOfPeople) || 1
                    if (current > 1) {
                      setNumberOfPeople((current - 1).toString())
                    }
                  }}
                  disabled={numberOfPeople === "1"}
                >
                  -
                </Button>
                <Input
                  id="number-of-people"
                  type="number"
                  min="1"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  className="mx-2 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const current = Number.parseInt(numberOfPeople) || 1
                    setNumberOfPeople((current + 1).toString())
                  }}
                >
                  +
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bill Amount:</span>
                <span className="font-semibold">${billAmount || "0.00"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tip Amount ({tipPercent}%):</span>
                <span className="font-semibold">${tipAmount || "0.00"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Amount:</span>
                <span className="font-semibold">${totalAmount || "0.00"}</span>
              </div>

              {Number.parseInt(numberOfPeople) > 1 && (
                <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Per Person:</span>
                  </div>
                  <span className="font-bold text-lg">${perPersonAmount || "0.00"}</span>
                </div>
              )}
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={handleReset}>
              <Calculator className="h-4 w-4 mr-2" />
              Reset Calculator
            </Button>
          </TabsContent>

          <TabsContent value="info" className="mt-0">
            <div className="space-y-4 text-sm">
              <h3 className="font-semibold text-lg">Tipping Guide</h3>
              <p>Tipping customs vary by country and service type. Here's a general guide for the United States:</p>

              <div className="space-y-2">
                <h4 className="font-medium">Restaurant Service</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>15-20% for sit-down service</li>
                  <li>10% for buffet service</li>
                  <li>$1-2 per drink at bars</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Other Services</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>15-20% for taxi/rideshare drivers</li>
                  <li>15-20% for hair stylists and spa services</li>
                  <li>$2-5 per night for hotel housekeeping</li>
                  <li>10-15% for food delivery</li>
                </ul>
              </div>

              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Tip Etiquette</p>
                <p>
                  Tips are generally calculated on the pre-tax amount of the bill. For exceptional service, consider
                  tipping more than the standard percentage.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default TipCalculator

