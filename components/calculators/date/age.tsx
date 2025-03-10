"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"
import { format, differenceInYears, differenceInMonths, differenceInDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [referenceDate, setReferenceDate] = useState<Date | undefined>(new Date())
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null)
  const [nextBirthday, setNextBirthday] = useState<{ days: number; date: Date } | null>(null)

  const calculateAge = () => {
    if (!birthDate || !referenceDate) return

    const years = differenceInYears(referenceDate, birthDate)

    // Calculate months (after subtracting years)
    const dateAfterYears = new Date(birthDate)
    dateAfterYears.setFullYear(dateAfterYears.getFullYear() + years)
    const months = differenceInMonths(referenceDate, dateAfterYears)

    // Calculate days (after subtracting years and months)
    const dateAfterMonths = new Date(dateAfterYears)
    dateAfterMonths.setMonth(dateAfterMonths.getMonth() + months)
    const days = differenceInDays(referenceDate, dateAfterMonths)

    setAge({ years, months, days })

    // Calculate next birthday
    const nextBirthdayDate = new Date(referenceDate)
    nextBirthdayDate.setMonth(birthDate.getMonth())
    nextBirthdayDate.setDate(birthDate.getDate())

    if (nextBirthdayDate < referenceDate) {
      nextBirthdayDate.setFullYear(nextBirthdayDate.getFullYear() + 1)
    }

    const daysUntilBirthday = differenceInDays(nextBirthdayDate, referenceDate)
    setNextBirthday({ days: daysUntilBirthday, date: nextBirthdayDate })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Age Calculator</CardTitle>
        <CardDescription>Calculate exact age and find out when your next birthday is</CardDescription>
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
                  <Label htmlFor="birth-date">Birth Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !birthDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthDate ? format(birthDate, "PPP") : <span>Select birth date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reference-date">Reference Date (defaults to today)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !referenceDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {referenceDate ? format(referenceDate, "PPP") : <span>Select reference date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={referenceDate} onSelect={setReferenceDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={calculateAge} className="mt-2">
                  Calculate Age
                </Button>
              </div>

              {age && (
                <div className="grid gap-4 mt-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Age Result</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-background p-3 rounded-md">
                        <div className="text-3xl font-bold">{age.years}</div>
                        <div className="text-sm text-muted-foreground">Years</div>
                      </div>
                      <div className="bg-background p-3 rounded-md">
                        <div className="text-3xl font-bold">{age.months}</div>
                        <div className="text-sm text-muted-foreground">Months</div>
                      </div>
                      <div className="bg-background p-3 rounded-md">
                        <div className="text-3xl font-bold">{age.days}</div>
                        <div className="text-sm text-muted-foreground">Days</div>
                      </div>
                    </div>
                  </div>

                  {nextBirthday && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Next Birthday</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background p-3 rounded-md text-center">
                          <div className="text-3xl font-bold">{nextBirthday.days}</div>
                          <div className="text-sm text-muted-foreground">Days until next birthday</div>
                        </div>
                        <div className="bg-background p-3 rounded-md text-center">
                          <div className="text-lg font-bold">{format(nextBirthday.date, "PPP")}</div>
                          <div className="text-sm text-muted-foreground">Next birthday date</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="info">
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="text-lg font-medium">About Age Calculation</h3>
                <p className="text-muted-foreground mt-1">
                  The age calculator determines your exact age in years, months, and days based on your birth date and a
                  reference date (typically today).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">How It Works</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-1">
                  <li>Enter your birth date</li>
                  <li>The calculator uses today as the reference date by default, but you can change it</li>
                  <li>The calculator determines your exact age in years, months, and days</li>
                  <li>It also calculates how many days until your next birthday</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium">Common Uses</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-1">
                  <li>Determining exact age for legal or administrative purposes</li>
                  <li>Planning birthday celebrations</li>
                  <li>Calculating age at a specific point in time (historical or future)</li>
                  <li>Tracking developmental milestones</li>
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

