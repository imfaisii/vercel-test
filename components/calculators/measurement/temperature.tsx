"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const temperatureUnits = {
  celsius: { name: "Celsius (°C)" },
  fahrenheit: { name: "Fahrenheit (°F)" },
  kelvin: { name: "Kelvin (K)" },
  rankine: { name: "Rankine (°R)" },
  reaumur: { name: "Réaumur (°Ré)" },
}

// Temperature conversions are not linear, so we need special conversion functions
const convertTemperature = (value: number, fromUnit: string, toUnit: string): number => {
  // First convert to Celsius as the base unit
  let celsius: number

  switch (fromUnit) {
    case "celsius":
      celsius = value
      break
    case "fahrenheit":
      celsius = ((value - 32) * 5) / 9
      break
    case "kelvin":
      celsius = value - 273.15
      break
    case "rankine":
      celsius = ((value - 491.67) * 5) / 9
      break
    case "reaumur":
      celsius = (value * 5) / 4
      break
    default:
      return Number.NaN
  }

  // Then convert from Celsius to the target unit
  switch (toUnit) {
    case "celsius":
      return celsius
    case "fahrenheit":
      return (celsius * 9) / 5 + 32
    case "kelvin":
      return celsius + 273.15
    case "rankine":
      return ((celsius + 273.15) * 9) / 5
    case "reaumur":
      return (celsius * 4) / 5
    default:
      return Number.NaN
  }
}

export default function TemperatureCalculator() {
  const [value, setValue] = useState<string>("0")
  const [fromUnit, setFromUnit] = useState<string>("celsius")
  const [toUnit, setToUnit] = useState<string>("fahrenheit")
  const [result, setResult] = useState<string>("32")
  const [commonConversions, setCommonConversions] = useState<{ from: string; to: string; value: string }[]>([])

  useEffect(() => {
    if (!value || isNaN(Number(value))) {
      setResult("Invalid input")
      return
    }

    const inputValue = Number.parseFloat(value)
    const resultValue = convertTemperature(inputValue, fromUnit, toUnit)

    if (isNaN(resultValue)) {
      setResult("Error")
    } else {
      setResult(resultValue.toLocaleString("en-US", { maximumFractionDigits: 6 }))
    }
  }, [value, fromUnit, toUnit])

  useEffect(() => {
    // Generate common conversions based on the current input value
    if (!value || isNaN(Number(value))) return

    const inputValue = Number.parseFloat(value)

    const newCommonConversions = [
      {
        from: fromUnit,
        to: "celsius",
        value: convertTemperature(inputValue, fromUnit, "celsius").toLocaleString("en-US", {
          maximumFractionDigits: 6,
        }),
      },
      {
        from: fromUnit,
        to: "fahrenheit",
        value: convertTemperature(inputValue, fromUnit, "fahrenheit").toLocaleString("en-US", {
          maximumFractionDigits: 6,
        }),
      },
      {
        from: fromUnit,
        to: "kelvin",
        value: convertTemperature(inputValue, fromUnit, "kelvin").toLocaleString("en-US", { maximumFractionDigits: 6 }),
      },
      {
        from: fromUnit,
        to: "rankine",
        value: convertTemperature(inputValue, fromUnit, "rankine").toLocaleString("en-US", {
          maximumFractionDigits: 6,
        }),
      },
    ]

    setCommonConversions(newCommonConversions)
  }, [value, fromUnit])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Temperature Converter</CardTitle>
        <CardDescription>Convert between different temperature scales</CardDescription>
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
                    {Object.entries(temperatureUnits).map(([key, { name }]) => (
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
                    {Object.entries(temperatureUnits).map(([key, { name }]) => (
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
                    {temperatureUnits[conversion.to as keyof typeof temperatureUnits].name}
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
          <p>Temperature conversion is the process of converting a temperature from one scale to another.</p>
          <p className="mt-2">Common temperature conversions:</p>
          <ul className="list-disc list-inside mt-1">
            <li>°F = (°C × 9/5) + 32</li>
            <li>°C = (°F - 32) × 5/9</li>
            <li>K = °C + 273.15</li>
            <li>°R = °F + 459.67</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}

