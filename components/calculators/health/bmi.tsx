"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")
  const [height, setHeight] = useState<number>(170)
  const [weight, setWeight] = useState<number>(70)
  const [heightFt, setHeightFt] = useState<number>(5)
  const [heightIn, setHeightIn] = useState<number>(10)
  const [weightLbs, setWeightLbs] = useState<number>(154)
  const [bmi, setBmi] = useState<number>(0)
  const [category, setCategory] = useState<string>("")

  useEffect(() => {
    calculateBMI()
  }, [height, weight, heightFt, heightIn, weightLbs, unit])

  const calculateBMI = () => {
    let calculatedBMI = 0

    if (unit === "metric") {
      // BMI = weight(kg) / (height(m))²
      calculatedBMI = weight / Math.pow(height / 100, 2)
    } else {
      // BMI = 703 × weight(lb) / (height(in))²
      const heightInches = heightFt * 12 + heightIn
      calculatedBMI = (703 * weightLbs) / Math.pow(heightInches, 2)
    }

    setBmi(Number.parseFloat(calculatedBMI.toFixed(1)))

    // Determine BMI category
    if (calculatedBMI < 18.5) {
      setCategory("Underweight")
    } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
      setCategory("Normal weight")
    } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
      setCategory("Overweight")
    } else {
      setCategory("Obesity")
    }
  }

  const getBmiColor = () => {
    if (bmi < 18.5) return "text-blue-500"
    if (bmi >= 18.5 && bmi < 25) return "text-green-500"
    if (bmi >= 25 && bmi < 30) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="metric" onValueChange={(value) => setUnit(value as "metric" | "imperial")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metric">Metric</TabsTrigger>
          <TabsTrigger value="imperial">Imperial</TabsTrigger>
        </TabsList>

        <TabsContent value="metric" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Height (cm): {height}</Label>
              <Slider min={100} max={250} step={1} value={[height]} onValueChange={(value) => setHeight(value[0])} />
            </div>

            <div className="space-y-2">
              <Label>Weight (kg): {weight}</Label>
              <Slider min={30} max={200} step={1} value={[weight]} onValueChange={(value) => setWeight(value[0])} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="imperial" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Height (ft)</Label>
                <Input
                  type="number"
                  min={1}
                  max={8}
                  value={heightFt}
                  onChange={(e) => setHeightFt(Number.parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Height (in)</Label>
                <Input
                  type="number"
                  min={0}
                  max={11}
                  value={heightIn}
                  onChange={(e) => setHeightIn(Number.parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Weight (lbs)</Label>
              <Input
                type="number"
                min={50}
                max={500}
                value={weightLbs}
                onChange={(e) => setWeightLbs(Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle>Your BMI</CardTitle>
          <CardDescription>Body Mass Index Result</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className={`text-3xl font-bold ${getBmiColor()}`}>{bmi}</p>
            <p className={`text-lg font-medium ${getBmiColor()}`}>{category}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

