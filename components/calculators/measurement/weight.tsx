"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const weightUnits = {
  kilogram: { name: "Kilograms (kg)", conversion: 1 },
  gram: { name: "Grams (g)", conversion: 0.001 },
  milligram: { name: "Milligrams (mg)", conversion: 0.000001 },
  metricTon: { name: "Metric Tons (t)", conversion: 1000 },
  pound: { name: "Pounds (lb)", conversion: 0.453592 },
  ounce: { name: "Ounces (oz)", conversion: 0.0283495 },
  stone: { name: "Stone (st)", conversion: 6.35029 },
  usTon: { name: "US Tons", conversion: 907.185 },
  imperialTon: { name: "Imperial Tons", conversion: 1016.05 },
}

export default function WeightCalculator() {
  const [value, setValue] = useState<string>("1")
  const [fromUnit, setFromUnit] = useState<string>("kilogram")
  const [toUnit, setToUnit] = useState<string>("pound")
  const [result, setResult] = useState<string>("2.20462")
  const [commonConversions, setCommonConversions] = useState<{ from: string; to: string; value: string }[]>([])

  useEffect(() => {
    if (!value || isNaN(Number(value))) {
      setResult("Invalid input")
      return
    }

    const inputValue = Number.parseFloat(value)
    const fromConversion = weightUnits[fromUnit as keyof typeof weightUnits].conversion
    const toConversion = weightUnits[toUnit as keyof typeof weightUnits].conversion

    const resultValue = (inputValue * fromConversion) / toConversion
    setResult(resultValue.toLocaleString("en-US", { maximumFractionDigits: 10 }))
  }, [value, fromUnit, toUnit])

  useEffect(() => {
    // Generate common conversions based on the current input value
    if (!value || isNaN(Number(value))) return

    const inputValue = Number.parseFloat(value)
    const fromConversion = weightUnits[fromUnit as keyof typeof weightUnits].conversion
    const baseValue = inputValue * fromConversion // Convert to kilograms

    const newCommonConversions = [
      {
        from: fromUnit,
        to: "kilogram",
        value: (baseValue / weightUnits.kilogram.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "gram",
        value: (baseValue / weightUnits.gram.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "pound",
        value: (baseValue / weightUnits.pound.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "ounce",
        value: (baseValue / weightUnits.ounce.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "stone",
        value: (baseValue / weightUnits.stone.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "metricTon",
        value: (baseValue / weightUnits.metricTon.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
    ]

    setCommonConversions(newCommonConversions)
  }, [value, fromUnit])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Weight Converter</CardTitle>
        <CardDescription>Convert between different units of weight and mass</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="converter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="converter">Converter</TabsTrigger>
            <TabsTrigger value="common">Common Conversions</TabsTrigger>
          </TabsList>
          <TabsContent value="converter" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter a value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-unit">From</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger id="from-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(weightUnits).map(([key, { name }]) => (
                      <SelectItem key={key} value={key}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-unit">To</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger id="to-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(weightUnits).map(([key, { name }]) => (
                      <SelectItem key={key} value={key}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <div className="flex items-center h-10 px-4 border rounded-md bg-muted/50">
                  <span className="text-sm">{result}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="common">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonConversions.map((conversion, index) => (
                <div key={index} className="flex justify-between p-3 border rounded-md">
                  <span className="text-sm font-medium">
                    {weightUnits[conversion.to as keyof typeof weightUnits].name}
                  </span>
                  <span className="text-sm">{conversion.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>
            Weight conversion is the process of converting a measurement from one unit of weight or mass to another.
          </p>
          <p className="mt-2">Common weight conversions:</p>
          <ul className="list-disc list-inside mt-1">
            <li>1 kilogram = 1000 grams</li>
            <li>1 pound = 16 ounces</li>
            <li>1 kilogram ≈ 2.20462 pounds</li>
            <li>1 stone = 14 pounds</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}

