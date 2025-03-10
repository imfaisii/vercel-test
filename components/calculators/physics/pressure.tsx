"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PressureCalculator() {
  // State for pressure calculation
  const [force, setForce] = useState<number>(100)
  const [area, setArea] = useState<number>(10)
  const [pressure, setPressure] = useState<number>(10)

  // State for unit conversion
  const [pressureValue, setPressureValue] = useState<number>(1)
  const [fromUnit, setFromUnit] = useState<string>("pascal")
  const [toUnit, setToUnit] = useState<string>("bar")
  const [convertedValue, setConvertedValue] = useState<number>(0.00001)

  // Conversion factors to Pascal
  const conversionFactors = {
    pascal: 1,
    bar: 100000,
    psi: 6894.76,
    atm: 101325,
    torr: 133.322,
    mmHg: 133.322,
  }

  // Unit labels for display
  const unitLabels = {
    pascal: "Pascal (Pa)",
    bar: "Bar",
    psi: "Pounds per square inch (psi)",
    atm: "Atmosphere (atm)",
    torr: "Torr",
    mmHg: "Millimeters of mercury (mmHg)",
  }

  // Calculate pressure when force or area changes
  useEffect(() => {
    setPressure(force / area)
  }, [force, area])

  // Calculate unit conversion
  useEffect(() => {
    // Convert to Pascal first, then to target unit
    const valueInPascal = pressureValue * conversionFactors[fromUnit as keyof typeof conversionFactors]
    const result = valueInPascal / conversionFactors[toUnit as keyof typeof conversionFactors]
    setConvertedValue(result)
  }, [pressureValue, fromUnit, toUnit])

  // Handle input changes
  const handleForceChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setForce(numValue)
    }
  }

  const handleAreaChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setArea(numValue)
    }
  }

  const handlePressureValueChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setPressureValue(numValue)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pressure Calculator</CardTitle>
        <CardDescription>Calculate pressure using force and area, and convert between pressure units</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Pressure Calculator</TabsTrigger>
            <TabsTrigger value="converter">Pressure Converter</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="force">Force (N)</Label>
                  <Input
                    id="force"
                    type="number"
                    min="0"
                    value={force}
                    onChange={(e) => handleForceChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (m²)</Label>
                  <Input
                    id="area"
                    type="number"
                    min="0.0001"
                    step="0.0001"
                    value={area}
                    onChange={(e) => handleAreaChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressure">Pressure (Pa)</Label>
                <Input id="pressure" type="number" value={pressure.toFixed(2)} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Common Pressure Values</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-md bg-muted p-2">
                    <span className="font-medium">In Bar: </span>
                    {(pressure / 100000).toFixed(6)} bar
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <span className="font-medium">In PSI: </span>
                    {(pressure / 6894.76).toFixed(4)} psi
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <span className="font-medium">In Atmospheres: </span>
                    {(pressure / 101325).toFixed(6)} atm
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <span className="font-medium">In mmHg: </span>
                    {(pressure / 133.322).toFixed(2)} mmHg
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-muted p-4">
              <h3 className="font-medium">Pressure Formula</h3>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Pressure:</strong> P = F ÷ A (force divided by area)
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Force:</strong> F = P × A (pressure multiplied by area)
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Area:</strong> A = F ÷ P (force divided by pressure)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="converter" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pressureValue">Value</Label>
                  <Input
                    id="pressureValue"
                    type="number"
                    value={pressureValue}
                    onChange={(e) => handlePressureValueChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromUnit">From Unit</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger id="fromUnit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="convertedValue">Result</Label>
                  <Input id="convertedValue" type="number" value={convertedValue.toExponential(6)} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toUnit">To Unit</Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger id="toUnit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-muted p-4">
              <h3 className="font-medium">Common Pressure Conversions</h3>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>1 Pascal (Pa)</strong> = 0.00001 bar = 0.000145 psi = 0.00000987 atm = 0.0075 mmHg
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>1 bar</strong> = 100,000 Pa = 14.5038 psi = 0.987 atm = 750.062 mmHg
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>1 atmosphere (atm)</strong> = 101,325 Pa = 1.01325 bar = 14.6959 psi = 760 mmHg
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default PressureCalculator

