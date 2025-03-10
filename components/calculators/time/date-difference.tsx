"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [results, setResults] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    workDays: number
    weekends: number
    weeks: number
    months: number
    years: number
  } | null>(null)
  const [error, setError] = useState("")

  const calculateDifference = () => {
    try {
      setError("")

      if (!startDate || !endDate) {
        setError("Please select both start and end dates")
        return
      }

      const start = new Date(startDate)
      const end = new Date(endDate)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setError("Please enter valid dates")
        return
      }

      if (end < start) {
        setError("End date must be after start date")
        return
      }

      // Calculate difference in milliseconds
      const diffMs = end.getTime() - start.getTime()

      // Convert to various units
      const seconds = Math.floor(diffMs / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      // Calculate work days (excluding weekends)
      let workDays = 0
      let weekends = 0
      const tempDate = new Date(start)

      while (tempDate <= end) {
        const day = tempDate.getDay()
        if (day !== 0 && day !== 6) {
          workDays++
        } else {
          weekends++
        }
        tempDate.setDate(tempDate.getDate() + 1)
      }

      // Calculate weeks, months, years
      const weeks = Math.floor(days / 7)

      // Approximate months and years
      const years = end.getFullYear() - start.getFullYear()
      let months = end.getMonth() - start.getMonth() + years * 12

      // Adjust for partial months
      if (end.getDate() < start.getDate()) {
        months--
      }

      setResults({
        days,
        hours,
        minutes,
        seconds,
        workDays,
        weekends,
        weeks,
        months,
        years,
      })
    } catch (err) {
      setError("Error calculating date difference. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Date Difference Calculator</CardTitle>
          <CardDescription>Calculate the exact time between two dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            <Button onClick={calculateDifference} className="w-full">
              Calculate Difference
            </Button>

            {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Time difference between {new Date(startDate).toLocaleDateString()} and{" "}
              {new Date(endDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Days</p>
                    <p className="text-3xl font-bold">{results.days}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Weeks</p>
                    <p className="text-3xl font-bold">{results.weeks}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Months</p>
                    <p className="text-3xl font-bold">{results.months}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Years</p>
                    <p className="text-3xl font-bold">{results.years}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Total Days</p>
                    <p className="text-2xl font-bold">{results.days}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Work Days</p>
                    <p className="text-2xl font-bold">{results.workDays}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Weekend Days</p>
                    <p className="text-2xl font-bold">{results.weekends}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <p className="text-2xl font-bold">{results.hours}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Total Minutes</p>
                    <p className="text-2xl font-bold">{results.minutes}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Total Seconds</p>
                    <p className="text-2xl font-bold">{results.seconds}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

