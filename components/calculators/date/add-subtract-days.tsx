"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"
import { format, addDays, addMonths, addYears, subDays, subMonths, subYears } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddSubtractDaysCalculator() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [operation, setOperation] = useState<"add" | "subtract">("add")
  const [unit, setUnit] = useState<"days" | "months" | "years">("days")
  const [amount, setAmount] = useState<number>(1)
  const [resultDate, setResultDate] = useState<Date | null>(null)
  const [recentCalculations, setRecentCalculations] = useState<
    Array<{
      startDate: Date
      operation: string
      amount: number
      unit: string
      resultDate: Date
    }>
  >([])

  const calculateDate = () => {
    if (!startDate) return

    let result: Date

    if (operation === "add") {
      if (unit === "days") result = addDays(startDate, amount)
      else if (unit === "months") result = addMonths(startDate, amount)
      else result = addYears(startDate, amount)
    } else {
      if (unit === "days") result = subDays(startDate, amount)
      else if (unit === "months") result = subMonths(startDate, amount)
      else result = subYears(startDate, amount)
    }

    setResultDate(result)

    // Add to recent calculations
    const newCalculation = {
      startDate: new Date(startDate),
      operation: operation === "add" ? "Added" : "Subtracted",
      amount,
      unit,
      resultDate: result,
    }

    setRecentCalculations((prev) => [newCalculation, ...prev.slice(0, 4)])
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Date Add/Subtract Calculator</CardTitle>
        <CardDescription>Add or subtract days, months, or years from a date</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="recent">Recent Calculations</TabsTrigger>
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
                  <Label>Operation</Label>
                  <RadioGroup
                    defaultValue="add"
                    value={operation}
                    onValueChange={(value) => setOperation(value as "add" | "subtract")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="add" id="add" />
                      <Label htmlFor="add">Add</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="subtract" id="subtract" />
                      <Label htmlFor="subtract">Subtract</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={unit} onValueChange={(value) => setUnit(value as "days" | "months" | "years")}>
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculateDate} className="mt-2">
                  Calculate Date
                </Button>
              </div>

              {resultDate && (
                <div className="grid gap-4 mt-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Result</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-background p-4 rounded-md text-center">
                        <div className="text-sm text-muted-foreground mb-1">
                          {operation === "add" ? "Adding" : "Subtracting"} {amount} {unit} to{" "}
                          {format(startDate!, "PPP")}
                        </div>
                        <div className="text-2xl font-bold">{format(resultDate, "PPP")}</div>
                        <div className="text-sm text-muted-foreground mt-1">{format(resultDate, "EEEE")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="recent">
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Recent Calculations</h3>
              {recentCalculations.length === 0 ? (
                <div className="text-center p-6 border rounded-md text-muted-foreground">
                  No recent calculations. Use the calculator to see your history here.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCalculations.map((calc, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">
                            {calc.operation} {calc.amount} {calc.unit}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            From {format(calc.startDate, "PPP")} to {format(calc.resultDate, "PPP")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{format(calc.resultDate, "EEEE")}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">Results account for leap years and month length variations</p>
      </CardFooter>
    </Card>
  )
}

