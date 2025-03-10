"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

export function ForceCalculator() {
  // Newton's Second Law: F = m * a
  const [mass, setMass] = useState<number>(1)
  const [acceleration, setAcceleration] = useState<number>(9.8)
  const [force, setForce] = useState<number>(9.8)
  const [massUnit, setMassUnit] = useState<string>("kg")
  const [forceUnit, setForceUnit] = useState<string>("newton")

  // Conversion factors
  const massConversionFactors = {
    kg: 1,
    g: 0.001,
    lb: 0.453592,
    oz: 0.0283495,
  }

  const forceConversionFactors = {
    newton: 1,
    dyne: 0.00001,
    poundForce: 4.44822,
    kilogramForce: 9.80665,
  }

  const unitLabels = {
    mass: {
      kg: "Kilograms (kg)",
      g: "Grams (g)",
      lb: "Pounds (lb)",
      oz: "Ounces (oz)",
    },
    force: {
      newton: "Newtons (N)",
      dyne: "Dynes (dyn)",
      poundForce: "Pound-force (lbf)",
      kilogramForce: "Kilogram-force (kgf)",
    },
  }

  // Calculate force when mass or acceleration changes
  useEffect(() => {
    const massInKg = mass * massConversionFactors[massUnit as keyof typeof massConversionFactors]
    const forceInNewtons = massInKg * acceleration
    const convertedForce = forceInNewtons / forceConversionFactors[forceUnit as keyof typeof forceConversionFactors]
    setForce(convertedForce)
  }, [mass, acceleration, massUnit, forceUnit])

  // Handle input changes
  const handleMassChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setMass(numValue)
    }
  }

  const handleAccelerationChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setAcceleration(numValue)
    }
  }

  const handleForceChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setForce(numValue)

      // Calculate mass based on force and acceleration
      const forceInNewtons = numValue * forceConversionFactors[forceUnit as keyof typeof forceConversionFactors]
      const massInKg = forceInNewtons / acceleration
      const convertedMass = massInKg / massConversionFactors[massUnit as keyof typeof massConversionFactors]
      setMass(convertedMass)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Force Calculator</CardTitle>
        <CardDescription>
          Calculate force using Newton's Second Law (F = m × a) and convert between force units
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="newton" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="newton">Newton's Laws</TabsTrigger>
            <TabsTrigger value="converter">Force Converter</TabsTrigger>
          </TabsList>

          <TabsContent value="newton" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mass">Mass</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="mass"
                      type="number"
                      min="0"
                      value={mass}
                      onChange={(e) => handleMassChange(e.target.value)}
                    />
                    <Select value={massUnit} onValueChange={setMassUnit}>
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(unitLabels.mass).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acceleration">Acceleration (m/s²)</Label>
                  <Input
                    id="acceleration"
                    type="number"
                    value={acceleration}
                    onChange={(e) => handleAccelerationChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="force">Force</Label>
                <div className="flex space-x-2">
                  <Input
                    id="force"
                    type="number"
                    min="0"
                    value={force.toFixed(4)}
                    onChange={(e) => handleForceChange(e.target.value)}
                  />
                  <Select value={forceUnit} onValueChange={setForceUnit}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitLabels.force).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Adjust Mass</Label>
                <Slider value={[mass]} min={0} max={100} step={0.1} onValueChange={(value) => setMass(value[0])} />
              </div>

              <div className="space-y-2">
                <Label>Adjust Acceleration</Label>
                <Slider
                  value={[acceleration]}
                  min={0}
                  max={20}
                  step={0.1}
                  onValueChange={(value) => setAcceleration(value[0])}
                />
              </div>
            </div>

            <div className="mt-6 rounded-md bg-muted p-4">
              <h3 className="font-medium">Newton's Laws of Motion</h3>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>First Law:</strong> An object at rest stays at rest, and an object in motion stays in motion
                unless acted upon by an external force.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Second Law:</strong> Force equals mass times acceleration (F = m × a).
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Third Law:</strong> For every action, there is an equal and opposite reaction.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="converter" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromForce">Value</Label>
                  <Input id="fromForce" type="number" min="0" placeholder="Enter force value" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromForceUnit">From Unit</Label>
                  <Select defaultValue="newton">
                    <SelectTrigger id="fromForceUnit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitLabels.force).map(([key, label]) => (
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
                  <Label htmlFor="toForce">Result</Label>
                  <Input id="toForce" type="number" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toForceUnit">To Unit</Label>
                  <Select defaultValue="poundForce">
                    <SelectTrigger id="toForceUnit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitLabels.force).map(([key, label]) => (
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
              <h3 className="font-medium">Force Conversion Factors</h3>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>1 Newton (N)</strong> = 100,000 Dynes = 0.225 Pound-force = 0.102 Kilogram-force
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>1 Pound-force (lbf)</strong> = 4.448 Newtons = 444,822 Dynes = 0.454 Kilogram-force
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ForceCalculator

