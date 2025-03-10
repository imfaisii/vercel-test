"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HeartRateCalculator() {
  const [age, setAge] = useState<number>(30)
  const [restingHR, setRestingHR] = useState<number>(70)
  const [method, setMethod] = useState<string>("standard")
  const [maxHR, setMaxHR] = useState<number>(0)
  const [zones, setZones] = useState<{ name: string; min: number; max: number; description: string }[]>([])

  useEffect(() => {
    calculateHeartRateZones()
  }, [age, restingHR, method])

  const calculateHeartRateZones = () => {
    // Calculate maximum heart rate
    let calculatedMaxHR = 0

    if (method === "standard") {
      // Standard formula: 220 - age
      calculatedMaxHR = 220 - age
    } else if (method === "tanaka") {
      // Tanaka formula: 208 - (0.7 * age)
      calculatedMaxHR = 208 - 0.7 * age
    } else if (method === "karvonen") {
      // Karvonen formula uses resting heart rate
      calculatedMaxHR = 220 - age
    }

    setMaxHR(calculatedMaxHR)

    // Calculate heart rate zones
    const calculatedZones = []

    if (method === "karvonen") {
      // Karvonen method uses heart rate reserve (HRR = MaxHR - RestingHR)
      const hrr = calculatedMaxHR - restingHR

      calculatedZones.push({
        name: "Zone 1",
        min: Math.round(restingHR + hrr * 0.5),
        max: Math.round(restingHR + hrr * 0.6),
        description: "Very light intensity (50-60% HRR)",
      })

      calculatedZones.push({
        name: "Zone 2",
        min: Math.round(restingHR + hrr * 0.6),
        max: Math.round(restingHR + hrr * 0.7),
        description: "Light intensity (60-70% HRR)",
      })

      calculatedZones.push({
        name: "Zone 3",
        min: Math.round(restingHR + hrr * 0.7),
        max: Math.round(restingHR + hrr * 0.8),
        description: "Moderate intensity (70-80% HRR)",
      })

      calculatedZones.push({
        name: "Zone 4",
        min: Math.round(restingHR + hrr * 0.8),
        max: Math.round(restingHR + hrr * 0.9),
        description: "Hard intensity (80-90% HRR)",
      })

      calculatedZones.push({
        name: "Zone 5",
        min: Math.round(restingHR + hrr * 0.9),
        max: calculatedMaxHR,
        description: "Maximum intensity (90-100% HRR)",
      })
    } else {
      // Standard percentage-based zones
      calculatedZones.push({
        name: "Zone 1",
        min: Math.round(calculatedMaxHR * 0.5),
        max: Math.round(calculatedMaxHR * 0.6),
        description: "Very light intensity (50-60%)",
      })

      calculatedZones.push({
        name: "Zone 2",
        min: Math.round(calculatedMaxHR * 0.6),
        max: Math.round(calculatedMaxHR * 0.7),
        description: "Light intensity (60-70%)",
      })

      calculatedZones.push({
        name: "Zone 3",
        min: Math.round(calculatedMaxHR * 0.7),
        max: Math.round(calculatedMaxHR * 0.8),
        description: "Moderate intensity (70-80%)",
      })

      calculatedZones.push({
        name: "Zone 4",
        min: Math.round(calculatedMaxHR * 0.8),
        max: Math.round(calculatedMaxHR * 0.9),
        description: "Hard intensity (80-90%)",
      })

      calculatedZones.push({
        name: "Zone 5",
        min: Math.round(calculatedMaxHR * 0.9),
        max: calculatedMaxHR,
        description: "Maximum intensity (90-100%)",
      })
    }

    setZones(calculatedZones)
  }

  return (
    <div className="w-full">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Age: {age}</Label>
          <Slider min={18} max={80} step={1} value={[age]} onValueChange={(value) => setAge(value[0])} />
        </div>

        <div className="space-y-2">
          <Label>Resting Heart Rate: {restingHR} bpm</Label>
          <Slider min={40} max={100} step={1} value={[restingHR]} onValueChange={(value) => setRestingHR(value[0])} />
        </div>

        <div className="space-y-2">
          <Label>Calculation Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select calculation method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (220 - age)</SelectItem>
              <SelectItem value="tanaka">Tanaka (208 - 0.7 × age)</SelectItem>
              <SelectItem value="karvonen">Karvonen (uses resting HR)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle>Heart Rate Zones</CardTitle>
          <CardDescription>Maximum Heart Rate: {maxHR} bpm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {zones.map((zone, index) => (
              <div key={index} className="grid grid-cols-4 text-sm">
                <div className="font-medium">{zone.name}</div>
                <div>
                  {zone.min} - {zone.max} bpm
                </div>
                <div className="col-span-2 text-muted-foreground">{zone.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

