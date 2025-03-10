"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const volumeUnits = {
  liter: { name: "Liters (L)", conversion: 1 },
  milliliter: { name: "Milliliters (mL)", conversion: 0.001 },
  cubicMeter: { name: "Cubic Meters (m³)", conversion: 1000 },
  cubicCentimeter: { name: "Cubic Centimeters (cm³)", conversion: 0.001 },
  gallon: { name: "Gallons (US)", conversion: 3.78541 },
  quart: { name: "Quarts (US)", conversion: 0.946353 },
  pint: { name: "Pints (US)", conversion: 0.473176 },
  cup: { name: "Cups (US)", conversion: 0.236588 },
  fluidOunce: { name: "Fluid Ounces (US)", conversion: 0.0295735 },
  imperialGallon: { name: "Gallons (UK)", conversion: 4.54609 },
  imperialQuart: { name: "Quarts (UK)", conversion: 1.13652 },
  imperialPint: { name: "Pints (UK)", conversion: 0.568261 },
  imperialFluidOunce: { name: "Fluid Ounces (UK)", conversion: 0.0284131 },
  tablespoon: { name: "Tablespoons", conversion: 0.0147868 },
  teaspoon: { name: "Teaspoons", conversion: 0.00492892 },
}

export default function VolumeCalculator() {
  const [value, setValue] = useState<string>("1")
  const [fromUnit, setFromUnit] = useState<string>("liter")
  const [toUnit, setToUnit] = useState<string>("gallon")
  const [result, setResult] = useState<string>("0.264172")
  const [commonConversions, setCommonConversions] = useState<{ from: string; to: string; value: string }[]>([])

  useEffect(() => {
    if (!value || isNaN(Number(value))) {
      setResult("Invalid input")
      return
    }

    const inputValue = Number.parseFloat(value)
    const fromConversion = volumeUnits[fromUnit as keyof typeof volumeUnits].conversion
    const toConversion = volumeUnits[toUnit as keyof typeof volumeUnits].conversion

    const resultValue = (inputValue * fromConversion) / toConversion
    setResult(resultValue.toLocaleString("en-US", { maximumFractionDigits: 10 }))
  }, [value, fromUnit, toUnit])

  useEffect(() => {
    // Generate common conversions based on the current input value
    if (!value || isNaN(Number(value))) return

    const inputValue = Number.parseFloat(value)
    const fromConversion = volumeUnits[fromUnit as keyof typeof volumeUnits].conversion
    const baseValue = inputValue * fromConversion // Convert to liters

    const newCommonConversions = [
      {
        from: fromUnit,
        to: "liter",
        value: (baseValue / volumeUnits.liter.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "milliliter",
        value: (baseValue / volumeUnits.milliliter.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "gallon",
        value: (baseValue / volumeUnits.gallon.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "cup",
        value: (baseValue / volumeUnits.cup.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "fluidOunce",
        value: (baseValue / volumeUnits.fluidOunce.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "tablespoon",
        value: (baseValue / volumeUnits.tablespoon.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
    ]

    setCommonConversions(newCommonConversions)
  }, [value, fromUnit])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Volume Converter</CardTitle>
        <CardDescription>Convert between different units of volume and capacity</CardDescription>
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
                    {Object.entries(volumeUnits).map(([key, { name }]) => (
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
                    {Object.entries(volumeUnits).map(([key, { name }]) => (
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
                    {volumeUnits[conversion.to as keyof typeof volumeUnits].name}
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
            Volume conversion is the process of converting a measurement from one unit of volume or capacity to another.
          </p>
          <p className="mt-2">Common volume conversions:</p>
          <ul className="list-disc list-inside mt-1">
            <li>1 liter = 1000 milliliters</li>
            <li>1 gallon (US) = 4 quarts = 8 pints = 16 cups</li>
            <li>1 cup = 8 fluid ounces = 16 tablespoons</li>
            <li>1 tablespoon = 3 teaspoons</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}

