"use client"

import { useState, useEffect, useRef } from "react"
import { AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CountdownCalculator() {
  const [targetDate, setTargetDate] = useState("")
  const [targetTime, setTargetTime] = useState("00:00")
  const [eventName, setEventName] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  })
  const [error, setError] = useState("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startCountdown = () => {
    try {
      setError("")

      if (!targetDate) {
        setError("Please select a target date")
        return
      }

      // Combine date and time
      const targetDateTime = new Date(`${targetDate}T${targetTime || "00:00"}:00`)

      if (isNaN(targetDateTime.getTime())) {
        setError("Please enter a valid date and time")
        return
      }

      if (targetDateTime <= new Date()) {
        setError("Target date must be in the future")
        return
      }

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Update countdown immediately
      updateCountdown(targetDateTime)

      // Set interval to update countdown every second
      intervalRef.current = setInterval(() => {
        updateCountdown(targetDateTime)
      }, 1000)

      setIsRunning(true)
    } catch (err) {
      setError("Error starting countdown. Please try again.")
    }
  }

  const updateCountdown = (targetDateTime: Date) => {
    const now = new Date()
    const difference = targetDateTime.getTime() - now.getTime()

    // If countdown is complete
    if (difference <= 0) {
      setTimeRemaining({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
      })
      setIsRunning(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    // Calculate time units
    const totalSeconds = Math.floor(difference / 1000)
    const days = Math.floor(totalSeconds / (60 * 60 * 24))
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
    const seconds = Math.floor(totalSeconds % 60)

    setTimeRemaining({
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
    })
  }

  const stopCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)
  }

  const resetCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)
    setTimeRemaining({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
    })
    setTargetDate("")
    setTargetTime("00:00")
    setEventName("")
    setError("")
  }

  // Format time with leading zeros
  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0")
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!isRunning || !targetDate) return 0

    const targetDateTime = new Date(`${targetDate}T${targetTime || "00:00"}:00`)
    const startTime = new Date()
    startTime.setHours(0, 0, 0, 0)

    const totalDuration = targetDateTime.getTime() - startTime.getTime()
    const elapsed = totalDuration - timeRemaining.totalSeconds * 1000

    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="countdown" disabled={!isRunning}>
            Countdown
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Countdown Timer</CardTitle>
              <CardDescription>Set up a countdown to a future date and time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-name">Event Name (Optional)</Label>
                  <Input
                    id="event-name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g., Birthday, Wedding, Launch"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="target-date">Target Date</Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="target-time">Target Time (Optional)</Label>
                  <Input
                    id="target-time"
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  {!isRunning ? (
                    <Button onClick={startCountdown} className="flex-1">
                      Start Countdown
                    </Button>
                  ) : (
                    <>
                      <Button onClick={stopCountdown} variant="outline" className="flex-1">
                        Pause
                      </Button>
                      <Button onClick={resetCountdown} variant="destructive" className="flex-1">
                        Reset
                      </Button>
                    </>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countdown">
          <Card>
            <CardHeader>
              <CardTitle>{eventName || "Countdown"}</CardTitle>
              <CardDescription>
                Time remaining until {new Date(`${targetDate}T${targetTime || "00:00"}:00`).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-4xl font-bold">{formatTime(timeRemaining.days)}</p>
                    <p className="text-xs text-muted-foreground mt-1">DAYS</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-4xl font-bold">{formatTime(timeRemaining.hours)}</p>
                    <p className="text-xs text-muted-foreground mt-1">HOURS</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-4xl font-bold">{formatTime(timeRemaining.minutes)}</p>
                    <p className="text-xs text-muted-foreground mt-1">MINUTES</p>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-4xl font-bold">{formatTime(timeRemaining.seconds)}</p>
                    <p className="text-xs text-muted-foreground mt-1">SECONDS</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(calculateProgress())}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={stopCountdown} variant="outline" className="flex-1">
                    Pause
                  </Button>
                  <Button onClick={resetCountdown} variant="destructive" className="flex-1">
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

