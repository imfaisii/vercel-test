"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const lengthUnits = {
  meter: { name: "Meters (m)", conversion: 1 },
  kilometer: { name: "Kilometers (km)", conversion: 1000 },
  centimeter: { name: "Centimeters (cm)", conversion: 0.01 },
  millimeter: { name: "Millimeters (mm)", conversion: 0.001 },
  inch: { name: "Inches (in)", conversion: 0.0254 },
  foot: { name: "Feet (ft)", conversion: 0.3048 },
  yard: { name: "Yards (yd)", conversion: 0.9144 },
  mile: { name: "Miles (mi)", conversion: 1609.34 },
  nauticalMile: { name: "Nautical Miles (nmi)", conversion: 1852 },
}

export default function LengthCalculator() {
  const [value, setValue] = useState<string>("1")
  const [fromUnit, setFromUnit] = useState<string>("meter")
  const [toUnit, setToUnit] = useState<string>("kilometer")
  const [result, setResult] = useState<string>("0.001")
  const [commonConversions, setCommonConversions] = useState<{ from: string; to: string; value: string }[]>([])

  useEffect(() => {
    if (!value || isNaN(Number(value))) {
      setResult("Invalid input")
      return
    }

    const inputValue = Number.parseFloat(value)
    const fromConversion = lengthUnits[fromUnit as keyof typeof lengthUnits].conversion
    const toConversion = lengthUnits[toUnit as keyof typeof lengthUnits].conversion

    const resultValue = (inputValue * fromConversion) / toConversion
    setResult(resultValue.toLocaleString("en-US", { maximumFractionDigits: 10 }))
  }, [value, fromUnit, toUnit])

  useEffect(() => {
    // Generate common conversions based on the current input value
    if (!value || isNaN(Number(value))) return

    const inputValue = Number.parseFloat(value)
    const fromConversion = lengthUnits[fromUnit as keyof typeof lengthUnits].conversion
    const baseValue = inputValue * fromConversion // Convert to meters

    const newCommonConversions = [
      {
        from: fromUnit,
        to: "meter",
        value: (baseValue / lengthUnits.meter.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "kilometer",
        value: (baseValue / lengthUnits.kilometer.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "centimeter",
        value: (baseValue / lengthUnits.centimeter.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "inch",
        value: (baseValue / lengthUnits.inch.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "foot",
        value: (baseValue / lengthUnits.foot.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "mile",
        value: (baseValue / lengthUnits.mile.conversion).toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
    ]

    setCommonConversions(newCommonConversions)
  }, [value, fromUnit])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Length Converter</CardTitle>
        <CardDescription>Convert between different units of length</CardDescription>
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
                    {Object.entries(lengthUnits).map(([key, { name }]) => (
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
                    {Object.entries(lengthUnits).map(([key, { name }]) => (
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
                    {lengthUnits[conversion.to as keyof typeof lengthUnits].name}
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
          <p>Length conversion is the process of converting a measurement from one unit of length to another.</p>
          <p className="mt-2">Common length conversions:</p>
          <ul className="list-disc list-inside mt-1">
            <li>1 meter = 100 centimeters</li>
            <li>1 kilometer = 1000 meters</li>
            <li>1 foot = 12 inches</li>
            <li>1 mile = 5280 feet</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}

