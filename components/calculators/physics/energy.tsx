"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function EnergyCalculator() {
  const [energyValue, setEnergyValue] = useState<number>(100)
  const [fromUnit, setFromUnit] = useState<string>("joule")
  const [toUnit, setToUnit] = useState<string>("calorie")
  const [result, setResult] = useState<number>(0)

  // For the calculator tab
  const [mass, setMass] = useState<number>(0)
  const [velocity, setVelocity] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [gravity, setGravity] = useState<number>(9.8)
  const [kineticEnergy, setKineticEnergy] = useState<number>(0)
  const [potentialEnergy, setPotentialEnergy] = useState<number>(0)

  // Conversion factors to Joules
  const conversionFactors = {
    joule: 1,
    calorie: 4.184,
    kilocalorie: 4184,
    electronvolt: 1.602e-19,
    kilowattHour: 3.6e6,
    footPound: 1.356,
    btu: 1055.06,
  }

  // Unit labels for display
  const unitLabels = {
    joule: "Joules (J)",
    calorie: "Calories (cal)",
    kilocalorie: "Kilocalories (kcal)",
    electronvolt: "Electronvolts (eV)",
    kilowattHour: "Kilowatt-hours (kWh)",
    footPound: "Foot-pounds (ft⋅lb)",
    btu: "British Thermal Units (BTU)",
  }

  // Calculate conversion when inputs change
  useEffect(() => {
    // Convert to joules first, then to target unit
    const valueInJoules = energyValue * conversionFactors[fromUnit as keyof typeof conversionFactors]
    const convertedValue = valueInJoules / conversionFactors[toUnit as keyof typeof conversionFactors]
    setResult(convertedValue)
  }, [energyValue, fromUnit, toUnit])

  // Calculate energy values when inputs change
  useEffect(() => {
    // Kinetic energy = 0.5 * mass * velocity^2
    const ke = 0.5 * mass * Math.pow(velocity, 2)
    setKineticEnergy(ke)

    // Potential energy = mass * gravity * height
    const pe = mass * gravity * height
    setPotentialEnergy(pe)
  }, [mass, velocity, height, gravity])

  const handleInputChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setEnergyValue(numValue)
    } else {
      setEnergyValue(0)
    }
  }

  const handleMassChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setMass(numValue)
    }
  }

  const handleVelocityChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setVelocity(numValue)
    }
  }

  const handleHeightChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setHeight(numValue)
    }
  }

  const handleGravityChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setGravity(numValue)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Energy Calculator</CardTitle>
        <CardDescription>Convert between different units of energy and calculate energy values</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="converter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="converter">Energy Converter</TabsTrigger>
            <TabsTrigger value="calculator">Energy Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromValue">Value</Label>
                  <Input
                    id="fromValue"
                    type="number"
                    value={energyValue}
                    onChange={(e) => handleInputChange(e.target.value)}
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
                  <Label htmlFor="result">Result</Label>
                  <Input id="result" type="number" value={result.toFixed(6)} readOnly />
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
              <h3 className="font-medium">Energy Conversion Formula</h3>
              <p className="text-sm text-muted-foreground mt-2">
                To convert energy from one unit to another, we first convert to joules (J) as the base unit, then
                convert to the target unit.
              </p>
              <p className="text-sm mt-2">
                <strong>Example:</strong> 1 calorie = 4.184 joules, 1 kilowatt-hour = 3,600,000 joules
              </p>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mass">Mass (kg)</Label>
                  <Input
                    id="mass"
                    type="number"
                    placeholder="Enter mass"
                    value={mass || ""}
                    onChange={(e) => handleMassChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="velocity">Velocity (m/s)</Label>
                  <Input
                    id="velocity"
                    type="number"
                    placeholder="Enter velocity"
                    value={velocity || ""}
                    onChange={(e) => handleVelocityChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height"
                    value={height || ""}
                    onChange={(e) => handleHeightChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gravity">Gravity (m/s²)</Label>
                  <Input
                    id="gravity"
                    type="number"
                    value={gravity}
                    onChange={(e) => handleGravityChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kinetic Energy (J)</Label>
                  <Input type="number" readOnly value={kineticEnergy.toFixed(2)} />
                </div>
                <div className="space-y-2">
                  <Label>Potential Energy (J)</Label>
                  <Input type="number" readOnly value={potentialEnergy.toFixed(2)} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-muted p-4">
              <h3 className="font-medium">Energy Formulas</h3>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Kinetic Energy:</strong> KE = ½ × mass × velocity²
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Potential Energy:</strong> PE = mass × gravity × height
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default EnergyCalculator

