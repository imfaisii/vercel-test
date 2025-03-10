"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male")
  const [age, setAge] = useState<number>(30)
  const [height, setHeight] = useState<number>(170)
  const [weight, setWeight] = useState<number>(70)
  const [activityLevel, setActivityLevel] = useState<string>("moderate")
  const [goal, setGoal] = useState<string>("maintain")
  const [bmr, setBmr] = useState<number>(0)
  const [tdee, setTdee] = useState<number>(0)
  const [targetCalories, setTargetCalories] = useState<number>(0)

  useEffect(() => {
    calculateCalories()
  }, [gender, age, height, weight, activityLevel, goal])

  const calculateCalories = () => {
    // Calculate BMR using Mifflin-St Jeor Equation
    let calculatedBmr = 0

    if (gender === "male") {
      calculatedBmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      calculatedBmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    setBmr(Math.round(calculatedBmr))

    // Calculate TDEE based on activity level
    let activityMultiplier = 1.2 // Sedentary

    switch (activityLevel) {
      case "sedentary":
        activityMultiplier = 1.2
        break
      case "light":
        activityMultiplier = 1.375
        break
      case "moderate":
        activityMultiplier = 1.55
        break
      case "active":
        activityMultiplier = 1.725
        break
      case "very-active":
        activityMultiplier = 1.9
        break
    }

    const calculatedTdee = Math.round(calculatedBmr * activityMultiplier)
    setTdee(calculatedTdee)

    // Calculate target calories based on goal
    let goalAdjustment = 0

    switch (goal) {
      case "lose":
        goalAdjustment = -500 // Calorie deficit for weight loss
        break
      case "maintain":
        goalAdjustment = 0
        break
      case "gain":
        goalAdjustment = 500 // Calorie surplus for weight gain
        break
    }

    setTargetCalories(calculatedTdee + goalAdjustment)
  }

  return (
    <div className="w-full">
      <div className="grid gap-4">
        <RadioGroup
          value={gender}
          onValueChange={(value) => setGender(value as "male" | "female")}
          className="grid grid-cols-2 gap-2"
        >
          <div>
            <RadioGroupItem value="male" id="male" className="peer sr-only" />
            <Label
              htmlFor="male"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              Male
            </Label>
          </div>
          <div>
            <RadioGroupItem value="female" id="female" className="peer sr-only" />
            <Label
              htmlFor="female"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              Female
            </Label>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label>Age: {age}</Label>
          <Slider min={18} max={80} step={1} value={[age]} onValueChange={(value) => setAge(value[0])} />
        </div>

        <div className="space-y-2">
          <Label>Height (cm): {height}</Label>
          <Slider min={140} max={220} step={1} value={[height]} onValueChange={(value) => setHeight(value[0])} />
        </div>

        <div className="space-y-2">
          <Label>Weight (kg): {weight}</Label>
          <Slider min={40} max={150} step={1} value={[weight]} onValueChange={(value) => setWeight(value[0])} />
        </div>

        <div className="space-y-2">
          <Label>Activity Level</Label>
          <Select value={activityLevel} onValueChange={setActivityLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
              <SelectItem value="very-active">Very Active (hard exercise daily)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Select your goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">Lose Weight</SelectItem>
              <SelectItem value="maintain">Maintain Weight</SelectItem>
              <SelectItem value="gain">Gain Weight</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle>Daily Calorie Needs</CardTitle>
          <CardDescription>Based on your information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">BMR</p>
              <p className="text-xl font-bold">{bmr}</p>
              <p className="text-xs text-muted-foreground">calories/day</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">TDEE</p>
              <p className="text-xl font-bold">{tdee}</p>
              <p className="text-xs text-muted-foreground">calories/day</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="text-xl font-bold text-primary">{targetCalories}</p>
              <p className="text-xs text-muted-foreground">calories/day</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

