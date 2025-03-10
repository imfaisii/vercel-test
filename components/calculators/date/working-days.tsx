"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, InfoIcon } from "lucide-react"
import { format, eachDayOfInterval, isWeekend, addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Default US holidays for 2023-2024
const defaultHolidays = [
  { name: "New Year's Day", date: new Date(2023, 0, 1) },
  { name: "Martin Luther King Jr. Day", date: new Date(2023, 0, 16) },
  { name: "Presidents' Day", date: new Date(2023, 1, 20) },
  { name: "Memorial Day", date: new Date(2023, 4, 29) },
  { name: "Independence Day", date: new Date(2023, 6, 4) },
  { name: "Labor Day", date: new Date(2023, 8, 4) },
  { name: "Veterans Day", date: new Date(2023, 10, 11) },
  { name: "Thanksgiving Day", date: new Date(2023, 10, 23) },
  { name: "Christmas Day", date: new Date(2023, 11, 25) },
  { name: "New Year's Day", date: new Date(2024, 0, 1) },
  { name: "Martin Luther King Jr. Day", date: new Date(2024, 0, 15) },
  { name: "Presidents' Day", date: new Date(2024, 1, 19) },
  { name: "Memorial Day", date: new Date(2024, 4, 27) },
  { name: "Independence Day", date: new Date(2024, 6, 4) },
  { name: "Labor Day", date: new Date(2024, 8, 2) },
  { name: "Veterans Day", date: new Date(2024, 10, 11) },
  { name: "Thanksgiving Day", date: new Date(2024, 10, 28) },
  { name: "Christmas Day", date: new Date(2024, 11, 25) },
]

export default function WorkingDaysCalculator() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [includeStartDay, setIncludeStartDay] = useState(true)
  const [includeEndDay, setIncludeEndDay] = useState(true)
  const [excludeWeekends, setExcludeWeekends] = useState(true)
  const [excludeHolidays, setExcludeHolidays] = useState(true)
  const [customHolidays, setCustomHolidays] = useState<{ name: string; date: Date }[]>(defaultHolidays)
  const [newHolidayName, setNewHolidayName] = useState("")
  const [newHolidayDate, setNewHolidayDate] = useState<Date | undefined>(undefined)
  const [results, setResults] = useState<{
    totalDays: number
    workingDays: number
    weekends: number
    holidays: number
  } | null>(null)

  const addHoliday = () => {
    if (newHolidayName && newHolidayDate) {
      setCustomHolidays([...customHolidays, { name: newHolidayName, date: newHolidayDate }])
      setNewHolidayName("")
      setNewHolidayDate(undefined)
    }
  }

  const removeHoliday = (index: number) => {
    const updatedHolidays = [...customHolidays]
    updatedHolidays.splice(index, 1)
    setCustomHolidays(updatedHolidays)
  }

  const calculateWorkingDays = () => {
    if (!startDate || !endDate) return

    // Adjust start and end dates based on inclusion settings
    let adjustedStartDate = new Date(startDate)
    let adjustedEndDate = new Date(endDate)

    if (!includeStartDay) {
      adjustedStartDate = addDays(adjustedStartDate, 1)
    }

    if (!includeEndDay) {
      adjustedEndDate = addDays(adjustedEndDate, -1)
    }

    // Ensure start date is before end date
    if (adjustedStartDate > adjustedEndDate) {
      const temp = adjustedStartDate
      adjustedStartDate = adjustedEndDate
      adjustedEndDate = temp
    }

    // Get all days in the range
    const allDays = eachDayOfInterval({ start: adjustedStartDate, end: adjustedEndDate })

    // Count weekends
    const weekendDays = allDays.filter((day) => isWeekend(day)).length

    // Count holidays (excluding those that fall on weekends if weekends are already excluded)
    const holidayDays = excludeHolidays
      ? allDays.filter((day) => {
          const isHoliday = customHolidays.some(
            (holiday) => day.getDate() === holiday.date.getDate() && day.getMonth() === holiday.date.getMonth(),
          )
          return isHoliday && (!excludeWeekends || !isWeekend(day))
        }).length
      : 0

    // Calculate working days
    const totalDays = allDays.length
    const workingDays = totalDays - (excludeWeekends ? weekendDays : 0) - holidayDays

    setResults({
      totalDays,
      workingDays,
      weekends: excludeWeekends ? weekendDays : 0,
      holidays: holidayDays,
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Working Days Calculator</CardTitle>
        <CardDescription>Calculate working days between dates, excluding weekends and holidays</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="holidays">Holidays</TabsTrigger>
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-start"
                      checked={includeStartDay}
                      onCheckedChange={(checked) => setIncludeStartDay(checked as boolean)}
                    />
                    <Label htmlFor="include-start">Include start date</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-end"
                      checked={includeEndDay}
                      onCheckedChange={(checked) => setIncludeEndDay(checked as boolean)}
                    />
                    <Label htmlFor="include-end">Include end date</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exclude-weekends"
                      checked={excludeWeekends}
                      onCheckedChange={(checked) => setExcludeWeekends(checked as boolean)}
                    />
                    <Label htmlFor="exclude-weekends">Exclude weekends</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exclude-holidays"
                      checked={excludeHolidays}
                      onCheckedChange={(checked) => setExcludeHolidays(checked as boolean)}
                    />
                    <Label htmlFor="exclude-holidays">Exclude holidays</Label>
                  </div>
                </div>

                <Button onClick={calculateWorkingDays} className="mt-2">
                  Calculate Working Days
                </Button>
              </div>

              {results && (
                <div className="grid gap-4 mt-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Results</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="bg-background p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">{results.totalDays}</div>
                        <div className="text-sm text-muted-foreground">Total Days</div>
                      </div>
                      <div className="bg-background p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">{results.workingDays}</div>
                        <div className="text-sm text-muted-foreground">Working Days</div>
                      </div>
                      <div className="bg-background p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">{results.weekends}</div>
                        <div className="text-sm text-muted-foreground">Weekend Days</div>
                      </div>
                      <div className="bg-background p-3 rounded-md text-center">
                        <div className="text-2xl font-bold">{results.holidays}</div>
                        <div className="text-sm text-muted-foreground">Holidays</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="holidays">
            <div className="grid gap-6 mt-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Add Custom Holiday</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="holiday-name">Holiday Name</Label>
                    <Input
                      id="holiday-name"
                      value={newHolidayName}
                      onChange={(e) => setNewHolidayName(e.target.value)}
                      placeholder="Enter holiday name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="holiday-date">Holiday Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newHolidayDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newHolidayDate ? format(newHolidayDate, "PPP") : <span>Select holiday date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={newHolidayDate} onSelect={setNewHolidayDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button onClick={addHoliday} disabled={!newHolidayName || !newHolidayDate}>
                    Add Holiday
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Current Holidays</h3>
                <div className="border rounded-md divide-y">
                  {customHolidays.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No holidays added</div>
                  ) : (
                    customHolidays.map((holiday, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{holiday.name}</div>
                          <div className="text-sm text-muted-foreground">{format(holiday.date, "PPP")}</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeHoliday(index)}>
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <InfoIcon className="h-4 w-4 mr-1" />
                  Working days calculation info
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Working days exclude weekends (Saturday and Sunday) and holidays. The calculation respects your
                  choices for including/excluding the start and end dates.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </p>
      </CardFooter>
    </Card>
  )
}

