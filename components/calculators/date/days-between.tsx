"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"
import {
  format,
  differenceInDays,
  differenceInBusinessDays,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  differenceInWeeks,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function DaysBetweenCalculator() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [difference, setDifference] = useState<{
    days: number
    businessDays: number
    weeks: number
    months: number
    years: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const calculateDifference = () => {
    if (!startDate || !endDate) return

    const days = Math.abs(differenceInDays(endDate, startDate))
    const businessDays = Math.abs(differenceInBusinessDays(endDate, startDate))
    const weeks = Math.abs(differenceInWeeks(endDate, startDate))
    const months = Math.abs(differenceInCalendarMonths(endDate, startDate))
    const years = Math.abs(differenceInCalendarYears(endDate, startDate))
    const hours = Math.abs(differenceInHours(endDate, startDate))
    const minutes = Math.abs(differenceInMinutes(endDate, startDate))
    const seconds = Math.abs(differenceInSeconds(endDate, startDate))

    setDifference({
      days,
      businessDays,
      weeks,
      months,
      years,
      hours,
      minutes,
      seconds,
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Days Between Calculator</CardTitle>
        <CardDescription>Calculate the exact time between two dates</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator">
            <div className="grid gap-6 mt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Select start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={calculateDifference} className="mt-2">
                  Calculate Difference
                </Button>
              </div>

              {difference && (
                <div className="grid gap-4 mt-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Time Between Dates</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="bg-background p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">{difference.days}</div>
                        <div className="text-sm text-muted-foreground">Days</div>
                      </div>
                      <div className="bg-background p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">{difference.businessDays}</div>
                        <div className="text-sm text-muted-foreground">Business Days</div>
                      </div>
                      <div className="bg-background p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">{difference.weeks.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Weeks</div>
                      </div>
                      <div className="bg-background p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">{difference.months}</div>
                        <div className="text-sm text-muted-foreground">Months</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Detailed Breakdown</h3>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">Years:</div>
                        <div className="text-sm font-medium">{difference.years}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">Hours:</div>
                        <div className="text-sm font-medium">{difference.hours.toLocaleString()}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">Minutes:</div>
                        <div className="text-sm font-medium">{difference.minutes.toLocaleString()}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">Seconds:</div>
                        <div className="text-sm font-medium">{difference.seconds.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="info">
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="text-lg font-medium">About Days Between Calculator</h3>
                <p className="text-muted-foreground mt-1">
                  The Days Between Calculator determines the exact time between two dates in various units, including
                  days, business days, weeks, months, and more.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">How It Works</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-1">
                  <li>Select a start date and an end date</li>
                  <li>The calculator determines the time between these dates in multiple units</li>
                  <li>Business days exclude weekends (Saturday and Sunday)</li>
                  <li>Results are shown as absolute values (the order of dates doesn't matter)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium">Common Uses</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-1">
                  <li>Project planning and deadline calculations</li>
                  <li>Determining contract or subscription durations</li>
                  <li>Calculating age or time since/until an event</li>
                  <li>Planning business operations based on working days</li>
                  <li>Tracking time-sensitive processes or milestones</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">Results are calculated based on the Gregorian calendar</p>
      </CardFooter>
    </Card>
  )
}

