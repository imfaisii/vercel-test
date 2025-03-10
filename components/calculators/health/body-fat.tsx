"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BodyFatCalculator() {
  const [method, setMethod] = useState<"navy" | "skinfold">("navy")
  const [gender, setGender] = useState<"male" | "female">("male")
  const [weight, setWeight] = useState<number>(70)
  const [height, setHeight] = useState<number>(170)
  const [waist, setWaist] = useState<number>(80)
  const [neck, setNeck] = useState<number>(36)
  const [hip, setHip] = useState<number>(90)
  const [bodyFat, setBodyFat] = useState<number>(0)
  const [category, setCategory] = useState<string>("")

  useEffect(() => {
    calculateBodyFat()
  }, [method, gender, weight, height, waist, neck, hip])

  const calculateBodyFat = () => {
    if (method === "navy") {
      // Navy Method Body Fat Calculation
      let calculatedBodyFat = 0

      if (gender === "male") {
        // Male formula: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
        calculatedBodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
      } else {
        // Female formula: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
        calculatedBodyFat =
          495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450
      }

      setBodyFat(Number.parseFloat(calculatedBodyFat.toFixed(1)))
    } else {
      // Simplified skinfold method (this is just an example, real skinfold would need more inputs)
      // For demo purposes, we'll use a simplified calculation
      const bmi = weight / Math.pow(height / 100, 2)
      let calculatedBodyFat = 0

      if (gender === "male") {
        calculatedBodyFat = 1.2 * bmi + 0.23 * 30 - 16.2
      } else {
        calculatedBodyFat = 1.2 * bmi + 0.23 * 30 - 5.4
      }

      setBodyFat(Number.parseFloat(calculatedBodyFat.toFixed(1)))
    }

    // Determine body fat category
    determineCategory()
  }

  const determineCategory = () => {
    if (gender === "male") {
      if (bodyFat < 6) setCategory("Essential Fat")
      else if (bodyFat >= 6 && bodyFat < 14) setCategory("Athletic")
      else if (bodyFat >= 14 && bodyFat < 18) setCategory("Fitness")
      else if (bodyFat >= 18 && bodyFat < 25) setCategory("Average")
      else setCategory("Obese")
    } else {
      if (bodyFat < 16) setCategory("Essential Fat")
      else if (bodyFat >= 16 && bodyFat < 24) setCategory("Athletic")
      else if (bodyFat >= 24 && bodyFat < 31) setCategory("Fitness")
      else if (bodyFat >= 31 && bodyFat < 37) setCategory("Average")
      else setCategory("Obese")
    }
  }

  const getBodyFatColor = () => {
    if (gender === "male") {
      if (bodyFat < 6) return "text-blue-500"
      if (bodyFat >= 6 && bodyFat < 14) return "text-green-500"
      if (bodyFat >= 14 && bodyFat < 18) return "text-green-400"
      if (bodyFat >= 18 && bodyFat < 25) return "text-yellow-500"
      return "text-red-500"
    } else {
      if (bodyFat < 16) return "text-blue-500"
      if (bodyFat >= 16 && bodyFat < 24) return "text-green-500"
      if (bodyFat >= 24 && bodyFat < 31) return "text-green-400"
      if (bodyFat >= 31 && bodyFat < 37) return "text-yellow-500"
      return "text-red-500"
    }
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="navy" onValueChange={(value) => setMethod(value as "navy" | "skinfold")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="navy">Navy Method</TabsTrigger>
          <TabsTrigger value="skinfold">Skinfold Method</TabsTrigger>
        </TabsList>

        <div className="my-4">
          <RadioGroup
            value={gender}
            onValueChange={(value) => setGender(value as "male" | "female")}
            className="grid grid-cols-2 gap-2"
          >
            <div>
              <RadioGroupItem value="male" id="male-bf" className="peer sr-only" />
              <Label
                htmlFor="male-bf"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Male
              </Label>
            </div>
            <div>
              <RadioGroupItem value="female" id="female-bf" className="peer sr-only" />
              <Label
                htmlFor="female-bf"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Female
              </Label>
            </div>
          </RadioGroup>
        </div>

        <TabsContent value="navy" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Height (cm): {height}</Label>
              <Slider min={140} max={220} step={1} value={[height]} onValueChange={(value) => setHeight(value[0])} />
            </div>

            <div className="space-y-2">
              <Label>Weight (kg): {weight}</Label>
              <Slider min={40} max={150} step={1} value={[weight]} onValueChange={(value) => setWeight(value[0])} />
            </div>

            <div className="space-y-2">
              <Label>Waist (cm): {waist}</Label>
              <Slider min={50} max={150} step={1} value={[waist]} onValueChange={(value) => setWaist(value[0])} />
            </div>

            <div className="space-y-2">
              <Label>Neck (cm): {neck}</Label>
              <Slider min={25} max={60} step={1} value={[neck]} onValueChange={(value) => setNeck(value[0])} />
            </div>

            {gender === "female" && (
              <div className="space-y-2">
                <Label>Hip (cm): {hip}</Label>
                <Slider min={70} max={150} step={1} value={[hip]} onValueChange={(value) => setHip(value[0])} />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="skinfold" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Height (cm): {height}</Label>
              <Slider min={140} max={220} step={1} value={[height]} onValueChange={(value) => setHeight(value[0])} />
            </div>

            <div className="space-y-2">
              <Label>Weight (kg): {weight}</Label>
              <Slider min={40} max={150} step={1} value={[weight]} onValueChange={(value) => setWeight(value[0])} />
            </div>

            <p className="text-sm text-muted-foreground">
              Note: This is a simplified skinfold calculation for demonstration purposes. A real skinfold measurement
              would require multiple site measurements with calipers.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle>Body Fat Percentage</CardTitle>
          <CardDescription>Estimated body composition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className={`text-3xl font-bold ${getBodyFatColor()}`}>{bodyFat}%</p>
            <p className={`text-lg font-medium ${getBodyFatColor()}`}>{category}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

