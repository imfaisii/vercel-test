"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function VelocityCalculator() {
  // State for velocity calculation
  const [distance, setDistance] = useState<number>(100)
  const [time, setTime] = useState<number>(10)
  const [velocity, setVelocity] = useState<number>(10)

  // State for unit conversion
  const [velocityValue, setVelocityValue] = useState<number>(60)
  const [fromUnit, setFromUnit] = useState<string>("kmh")
  const [toUnit, setToUnit] = useState<string>("mph")
  const [convertedValue, setConvertedValue] = useState<number>(37.28)

  // State for calculation mode
  const [calcMode, setCalcMode] = useState<string>("velocity")

  // Conversion factors to m/s
  const conversionFactors = {
    ms: 1,
    kmh: 1 / 3.6,
    mph: 0.44704,
    fts: 0.3048,
    knot: 0.514444,
  }

  // Unit labels for display
  const unitLabels = {
    ms: "Meters per second (m/s)",
    kmh: "Kilometers per hour (km/h)",
    mph: "Miles per hour (mph)",
    fts: "Feet per second (ft/s)",
    knot: "Knots (kn)",
  }

  // Calculate velocity when distance or time changes
  useEffect(() => {
    if (calcMode === "velocity") {
      setVelocity(distance / time)
    } else if (calcMode === "distance") {
      setDistance(velocity * time)
    } else if (calcMode === "time") {
      setTime(distance / velocity)
    }
  }, [distance, time, velocity, calcMode])

  // Calculate unit conversion
  useEffect(() => {
    // Convert to m/s first, then to target unit
    const valueInMS = velocityValue * conversionFactors[fromUnit as keyof typeof conversionFactors]
    const result = valueInMS / conversionFactors[toUnit as keyof typeof conversionFactors]
    setConvertedValue(result)
  }, [velocityValue, fromUnit, toUnit])

  // Handle input changes
  const handleDistanceChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setDistance(numValue)
    }
  }

  const handleTimeChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setTime(numValue)
    }
  }

  const handleVelocityChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setVelocity(numValue)
    }
  }

  const handleVelocityValueChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setVelocityValue(numValue)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Velocity Calculator</CardTitle>
        <CardDescription>Calculate velocity, distance, time, and convert between velocity units</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Velocity Calculator</TabsTrigger>
            <TabsTrigger value="converter">Velocity Converter</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="space-y-4">
              <RadioGroup
                defaultValue="velocity"
                className="flex space-x-4"
                onValueChange={setCalcMode}
                value={calcMode}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="velocity" id="calc-velocity" />
                  <Label htmlFor="calc-velocity">Calculate Velocity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="distance" id="calc-distance" />
                  <Label htmlFor="calc-distance">Calculate Distance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="time" id="calc-time" />
                  <Label htmlFor="calc-time">Calculate Time</Label>
                </div>
              </RadioGroup>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (m)</Label>
                  <Input
                    id="distance"
                    type="number"
                    min="0"
                    value={distance}
                    onChange={(e) => handleDistanceChange(e.target.value)}
                    disabled={calcMode === "distance"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time (s)</Label>
                  <Input
                    id="time"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    disabled={calcMode === "time"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="velocity">Velocity (m/s)</Label>
                  <Input
                    id="velocity"
                    type="number"
                    value={velocity.toFixed(2)}
                    onChange={(e) => handleVelocityChange(e.target.value)}
                    disabled={calcMode === "velocity"}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-muted p-4">
              <h3 className="font-medium">Velocity Formulas</h3>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Velocity:</strong> v = d ÷ t (distance divided by time)
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Distance:</strong> d = v × t (velocity multiplied by time)
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Time:</strong> t = d ÷ v (distance divided by velocity)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="converter" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="velocityValue">Value</Label>
                  <Input
                    id="velocityValue"
                    type="number"
                    value={velocityValue}
                    onChange={(e) => handleVelocityValueChange(e.target.value)}
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
                  <Input id="convertedValue" type="number" value={convertedValue.toFixed(2)} readOnly />
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
              <h3 className="font-medium">Common Velocity Conversions</h3>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>1 m/s</strong> = 3.6 km/h = 2.237 mph = 3.281 ft/s = 1.944 knots
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>1 km/h</strong> = 0.278 m/s = 0.621 mph = 0.911 ft/s = 0.54 knots
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>1 mph</strong> = 0.447 m/s = 1.609 km/h = 1.467 ft/s = 0.869 knots
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default VelocityCalculator

